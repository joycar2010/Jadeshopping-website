import { supabase } from '@/lib/supabase';
import type { User, UserAddress, Coupon } from '@/types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressData {
  user_id: string;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string;
}

export class UserService {
  // 获取用户资料
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('UserService.getUserProfile error:', error);
      throw error;
    }
  }

  // 更新用户资料
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('UserService.updateUserProfile error:', error);
      throw error;
    }
  }

  // 获取用户地址列表
  static async getUserAddresses(userId: string): Promise<UserAddress[]> {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user addresses:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('UserService.getUserAddresses error:', error);
      throw error;
    }
  }

  // 添加用户地址
  static async addUserAddress(addressData: CreateAddressData): Promise<UserAddress> {
    try {
      // 如果设置为默认地址，先取消其他默认地址
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', addressData.user_id);
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert(addressData)
        .select()
        .single();

      if (error) {
        console.error('Error adding user address:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('UserService.addUserAddress error:', error);
      throw error;
    }
  }

  // 更新用户地址
  static async updateUserAddress(addressData: UpdateAddressData): Promise<UserAddress> {
    try {
      // 如果设置为默认地址，先取消其他默认地址
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', addressData.user_id);
      }

      const { id, ...updateData } = addressData;
      const { data, error } = await supabase
        .from('addresses')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user address:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('UserService.updateUserAddress error:', error);
      throw error;
    }
  }

  // 删除用户地址
  static async deleteUserAddress(addressId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        console.error('Error deleting user address:', error);
        throw error;
      }
    } catch (error) {
      console.error('UserService.deleteUserAddress error:', error);
      throw error;
    }
  }

  // 设置默认地址
  static async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    try {
      // 先取消所有默认地址
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // 设置新的默认地址
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) {
        console.error('Error setting default address:', error);
        throw error;
      }
    } catch (error) {
      console.error('UserService.setDefaultAddress error:', error);
      throw error;
    }
  }

  // 获取用户默认地址
  static async getDefaultAddress(userId: string): Promise<UserAddress | null> {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 是没有找到记录的错误
        console.error('Error fetching default address:', error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('UserService.getDefaultAddress error:', error);
      throw error;
    }
  }

  // 获取用户可用优惠券
  static async getUserCoupons(userId: string): Promise<Coupon[]> {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .lte('valid_from', new Date().toISOString())
        .gte('valid_until', new Date().toISOString())
        .or(`usage_limit.is.null,used_count.lt.usage_limit`);

      if (error) {
        console.error('Error fetching user coupons:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('UserService.getUserCoupons error:', error);
      throw error;
    }
  }

  // 验证优惠券
  static async validateCoupon(couponCode: string, orderAmount: number): Promise<{
    valid: boolean;
    coupon?: Coupon;
    discount?: number;
    error?: string;
  }> {
    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode)
        .eq('is_active', true)
        .single();

      if (error || !coupon) {
        return {
          valid: false,
          error: '优惠券不存在或已失效'
        };
      }

      // 检查有效期
      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validUntil = new Date(coupon.valid_until);

      if (now < validFrom || now > validUntil) {
        return {
          valid: false,
          error: '优惠券已过期或尚未生效'
        };
      }

      // 检查使用次数限制
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return {
          valid: false,
          error: '优惠券使用次数已达上限'
        };
      }

      // 检查最低订单金额
      if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
        return {
          valid: false,
          error: `订单金额需满${coupon.min_order_amount}元才能使用此优惠券`
        };
      }

      // 计算折扣金额
      let discount = 0;
      if (coupon.discount_type === 'percentage') {
        discount = orderAmount * (coupon.discount_value / 100);
      } else if (coupon.discount_type === 'fixed') {
        discount = coupon.discount_value;
      }

      // 检查最大折扣金额限制
      if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
        discount = coupon.max_discount_amount;
      }

      return {
        valid: true,
        coupon,
        discount
      };
    } catch (error) {
      console.error('UserService.validateCoupon error:', error);
      return {
        valid: false,
        error: '验证优惠券时发生错误'
      };
    }
  }

  // 使用优惠券
  static async useCoupon(couponId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_coupon_usage', {
        coupon_id: couponId
      });

      if (error) {
        console.error('Error using coupon:', error);
        throw error;
      }
    } catch (error) {
      console.error('UserService.useCoupon error:', error);
      throw error;
    }
  }

  // 创建用户（注册时使用）
  static async createUser(userData: {
    id: string; // 来自 Supabase Auth
    email: string;
    name: string;
    phone?: string;
  }): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('UserService.createUser error:', error);
      throw error;
    }
  }

  // 检查用户是否存在
  static async checkUserExists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user exists:', error);
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('UserService.checkUserExists error:', error);
      throw error;
    }
  }

  // 更新用户头像
  static async updateUserAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user avatar:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('UserService.updateUserAvatar error:', error);
      throw error;
    }
  }

  // 获取用户统计信息
  static async getUserStats(userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    favoriteProducts: number;
    reviewsCount: number;
  }> {
    try {
      // 获取订单统计
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('user_id', userId)
        .eq('status', 'completed');

      // 获取评论数量
      const { count: reviewsCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      return {
        totalOrders,
        totalSpent,
        favoriteProducts: 0, // 如果有收藏功能的话
        reviewsCount: reviewsCount || 0
      };
    } catch (error) {
      console.error('UserService.getUserStats error:', error);
      throw error;
    }
  }
}