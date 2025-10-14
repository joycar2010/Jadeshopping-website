import { supabase } from '@/lib/supabase';
import type { Order, OrderItem, User } from '@/types';

export interface CreateOrderData {
  user_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  shipping_address_id: string;
  coupon_id?: string;
  payment_method: string;
  shipping_method: string;
  notes?: string;
}

export interface OrderFilters {
  user_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class OrderService {
  // 创建订单
  async createOrder(orderData: CreateOrderData): Promise<ServiceResponse<Order>> {
    try {
      // 开始事务
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          status: 'pending',
          total_amount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          shipping_address_id: orderData.shipping_address_id,
          coupon_id: orderData.coupon_id,
          payment_method: orderData.payment_method,
          shipping_method: orderData.shipping_method,
          notes: orderData.notes,
          order_number: `JD${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        return { success: false, error: orderError.message };
      }

      // 创建订单项
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // 回滚订单
        await supabase.from('orders').delete().eq('id', order.id);
        return { success: false, error: itemsError.message };
      }

      // 更新库存
      for (const item of orderData.items) {
        const { error: stockError } = await supabase.rpc('update_product_stock', {
          product_id: item.product_id,
          quantity_change: -item.quantity
        });

        if (stockError) {
          console.error('Error updating stock:', stockError);
          // 这里可以选择是否回滚整个订单
        }
      }

      return { success: true, data: order };
    } catch (error) {
      console.error('OrderService.createOrder error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 获取订单列表
  async getOrders(filters: OrderFilters = {}): Promise<ServiceResponse<{ orders: Order[]; total: number }>> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          users(id, name, email),
          addresses(full_name, phone, street, city, state, country, postal_code),
          coupons(code, name, discount_type, discount_value),
          order_items(
            id,
            product_id,
            quantity,
            price,
            total_price,
            products(id, name, image_url)
          )
        `, { count: 'exact' });

      // 应用过滤条件
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      // 排序
      query = query.order('created_at', { ascending: false });

      // 分页
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        return { success: false, error: error.message };
      }

      return {
        success: true,
        data: {
          orders: data || [],
          total: count || 0
        }
      };
    } catch (error) {
      console.error('OrderService.getOrders error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 根据ID获取订单详情
  async getOrderById(id: string): Promise<ServiceResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users(id, name, email, phone),
          addresses(full_name, phone, street, city, state, country, postal_code),
          coupons(code, name, discount_type, discount_value),
          order_items(
            id,
            product_id,
            quantity,
            price,
            total_price,
            products(id, name, image_url, description)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('OrderService.getOrderById error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 根据订单号获取订单
  async getOrderByNumber(orderNumber: string): Promise<ServiceResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users(id, name, email, phone),
          addresses(full_name, phone, street, city, state, country, postal_code),
          coupons(code, name, discount_type, discount_value),
          order_items(
            id,
            product_id,
            quantity,
            price,
            total_price,
            products(id, name, image_url, description)
          )
        `)
        .eq('order_number', orderNumber)
        .single();

      if (error) {
        console.error('Error fetching order by number:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('OrderService.getOrderByNumber error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 更新订单状态
  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<ServiceResponse<Order>> {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (notes) {
        updateData.notes = notes;
      }

      // 如果状态是已支付，更新支付时间
      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      // 如果状态是已发货，更新发货时间
      if (status === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      }

      // 如果状态是已完成，更新完成时间
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('OrderService.updateOrderStatus error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 取消订单
  async cancelOrder(orderId: string, reason?: string): Promise<ServiceResponse<Order>> {
    try {
      // 获取订单详情以恢复库存
      const orderResult = await this.getOrderById(orderId);
      if (!orderResult.success || !orderResult.data) {
        return { success: false, error: 'Order not found' };
      }

      const order = orderResult.data;

      // 恢复库存
      if (order.order_items) {
        for (const item of order.order_items) {
          const { error: stockError } = await supabase.rpc('update_product_stock', {
            product_id: item.product_id,
            quantity_change: item.quantity
          });

          if (stockError) {
            console.error('Error restoring stock:', stockError);
          }
        }
      }

      // 更新订单状态
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          notes: reason || 'Order cancelled by user',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error cancelling order:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('OrderService.cancelOrder error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 获取用户订单统计
  async getUserOrderStats(userId: string): Promise<ServiceResponse<{
    total: number;
    pending: number;
    paid: number;
    shipped: number;
    completed: number;
    cancelled: number;
  }>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user order stats:', error);
        return { success: false, error: error.message };
      }

      const stats = {
        total: data?.length || 0,
        pending: 0,
        paid: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0
      };

      data?.forEach(order => {
        switch (order.status) {
          case 'pending':
            stats.pending++;
            break;
          case 'paid':
            stats.paid++;
            break;
          case 'shipped':
            stats.shipped++;
            break;
          case 'completed':
            stats.completed++;
            break;
          case 'cancelled':
            stats.cancelled++;
            break;
        }
      });

      return { success: true, data: stats };
    } catch (error) {
      console.error('OrderService.getUserOrderStats error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 获取订单项
  async getOrderItems(orderId: string): Promise<ServiceResponse<OrderItem[]>> {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products(id, name, image_url, description)
        `)
        .eq('order_id', orderId);

      if (error) {
        console.error('Error fetching order items:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('OrderService.getOrderItems error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 更新订单物流信息
  async updateOrderTracking(orderId: string, trackingNumber: string, carrier?: string): Promise<ServiceResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          tracking_number: trackingNumber,
          carrier: carrier,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating order tracking:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('OrderService.updateOrderTracking error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 获取订单历史记录
  async getOrderHistory(orderId: string): Promise<ServiceResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('order_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching order history:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('OrderService.getOrderHistory error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 添加订单历史记录
  async addOrderHistory(orderId: string, action: string, description: string, userId?: string): Promise<ServiceResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('order_history')
        .insert({
          order_id: orderId,
          action,
          description,
          user_id: userId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding order history:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('OrderService.addOrderHistory error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 处理退款
  async processRefund(orderId: string, amount: number, reason: string): Promise<ServiceResponse<Order>> {
    try {
      // 获取订单详情
      const orderResult = await this.getOrderById(orderId);
      if (!orderResult.success || !orderResult.data) {
        return { success: false, error: 'Order not found' };
      }

      const order = orderResult.data;

      // 更新订单状态为退款中
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'refunding',
          refund_amount: amount,
          refund_reason: reason,
          refund_requested_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error processing refund:', error);
        return { success: false, error: error.message };
      }

      // 添加历史记录
      await this.addOrderHistory(orderId, 'refund_requested', `Refund requested: ${reason}. Amount: ¥${amount}`);

      return { success: true, data };
    } catch (error) {
      console.error('OrderService.processRefund error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 确认收货
  async confirmDelivery(orderId: string, userId: string): Promise<ServiceResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          delivered_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('user_id', userId) // 确保只有订单所有者可以确认收货
        .select()
        .single();

      if (error) {
        console.error('Error confirming delivery:', error);
        return { success: false, error: error.message };
      }

      // 添加历史记录
      await this.addOrderHistory(orderId, 'delivery_confirmed', 'Order delivery confirmed by customer', userId);

      return { success: true, data };
    } catch (error) {
      console.error('OrderService.confirmDelivery error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 重新下单（基于历史订单）
  async reorder(orderId: string, userId: string): Promise<ServiceResponse<Order>> {
    try {
      // 获取原订单详情
      const orderResult = await this.getOrderById(orderId);
      if (!orderResult.success || !orderResult.data) {
        return { success: false, error: 'Original order not found' };
      }

      const originalOrder = orderResult.data;

      // 检查订单是否属于当前用户
      if (originalOrder.user_id !== userId) {
        return { success: false, error: 'Unauthorized' };
      }

      // 准备新订单数据
      const newOrderData: CreateOrderData = {
        user_id: userId,
        items: originalOrder.order_items?.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })) || [],
        shipping_address_id: originalOrder.shipping_address_id,
        payment_method: originalOrder.payment_method,
        shipping_method: originalOrder.shipping_method,
        notes: `Reorder from order #${originalOrder.order_number}`
      };

      // 创建新订单
      return await this.createOrder(newOrderData);
    } catch (error) {
      console.error('OrderService.reorder error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 获取订单状态选项
  getOrderStatusOptions(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'pending', label: 'Pending Payment', color: 'yellow' },
      { value: 'paid', label: 'Paid', color: 'blue' },
      { value: 'processing', label: 'Processing', color: 'purple' },
      { value: 'shipped', label: 'Shipped', color: 'indigo' },
      { value: 'delivered', label: 'Delivered', color: 'green' },
      { value: 'completed', label: 'Completed', color: 'green' },
      { value: 'cancelled', label: 'Cancelled', color: 'red' },
      { value: 'refunding', label: 'Refunding', color: 'orange' },
      { value: 'refunded', label: 'Refunded', color: 'gray' }
    ];
  }

  // 获取订单状态显示信息
  getOrderStatusInfo(status: string): { label: string; color: string; description: string } {
    const statusMap: Record<string, { label: string; color: string; description: string }> = {
      pending: { label: 'Pending Payment', color: 'yellow', description: 'Waiting for payment' },
      paid: { label: 'Paid', color: 'blue', description: 'Payment received, preparing order' },
      processing: { label: 'Processing', color: 'purple', description: 'Order is being processed' },
      shipped: { label: 'Shipped', color: 'indigo', description: 'Order has been shipped' },
      delivered: { label: 'Delivered', color: 'green', description: 'Order has been delivered' },
      completed: { label: 'Completed', color: 'green', description: 'Order completed successfully' },
      cancelled: { label: 'Cancelled', color: 'red', description: 'Order has been cancelled' },
      refunding: { label: 'Refunding', color: 'orange', description: 'Refund is being processed' },
      refunded: { label: 'Refunded', color: 'gray', description: 'Order has been refunded' }
    };

    return statusMap[status] || { label: status, color: 'gray', description: 'Unknown status' };
  }
}