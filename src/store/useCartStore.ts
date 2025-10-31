import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartState, Product } from '../types';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      
      addToCart: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.productId === product.id);
        
        let newItems: CartItem[];
        
        if (existingItem) {
          // 如果商品已存在，增加数量
          newItems = items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // 如果商品不存在，添加新商品
          const newItem: CartItem = {
            id: `cart_${product.id}_${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            description: product.description,
            stock: product.stock,
            quantity
          };
          newItems = [...items, newItem];
        }
        
        // 计算总数量和总金额
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        set({ items: newItems, totalItems, totalAmount });
      },
      
      removeItem: (productId: string) => {
        const { items } = get();
        const newItems = items.filter(item => item.productId !== productId);
        
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        set({ items: newItems, totalItems, totalAmount });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const { items } = get();
        
        if (quantity <= 0) {
          // 如果数量为0或负数，移除商品
          get().removeItem(productId);
          return;
        }
        
        const newItems = items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );
        
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        set({ items: newItems, totalItems, totalAmount });
      },
      
      clearCart: () => {
        set({ items: [], totalItems: 0, totalAmount: 0 });
      },
      
      getTotalItems: () => {
        const { totalItems } = get();
        return totalItems;
      },
      
      getTotalPrice: () => {
        const { totalAmount } = get();
        return totalAmount;
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount
      })
    }
  )
);