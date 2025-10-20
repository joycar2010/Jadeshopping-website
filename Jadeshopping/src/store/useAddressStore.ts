import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address, AddressState } from '../types';

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      defaultAddress: null,
      
      addAddress: (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
        const { addresses } = get();
        
        // 如果设置为默认地址，先取消其他默认地址
        if (addressData.isDefault) {
          set({
            addresses: addresses.map(addr => ({ ...addr, isDefault: false }))
          });
        }
        
        const newAddress: Address = {
          ...addressData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set(state => ({
          addresses: [...state.addresses, newAddress]
        }));
      },
      
      updateAddress: (addressId: string, addressData: Partial<Omit<Address, 'id' | 'createdAt' | 'updatedAt'>>) => {
        const { addresses } = get();
        
        // 如果设置为默认地址，先取消其他默认地址
        if (addressData.isDefault) {
          set({
            addresses: addresses.map(addr => ({ ...addr, isDefault: false }))
          });
        }
        
        set(state => ({
          addresses: state.addresses.map(addr =>
            addr.id === addressId
              ? { ...addr, ...addressData, updatedAt: new Date().toISOString() }
              : addr
          )
        }));
      },
      
      removeAddress: (addressId: string) => {
        set(state => ({
          addresses: state.addresses.filter(addr => addr.id !== addressId)
        }));
      },
      
      setDefaultAddress: (addressId: string) => {
        set(state => ({
          addresses: state.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId,
            updatedAt: addr.id === addressId ? new Date().toISOString() : addr.updatedAt
          }))
        }));
      },
      
      getDefaultAddress: () => {
        const { addresses } = get();
        return addresses.find(addr => addr.isDefault) || null;
      },
      
      getAddressById: (addressId: string) => {
        const { addresses } = get();
        return addresses.find(addr => addr.id === addressId) || null;
      },
      
      getAddressesByUserId: (userId: string) => {
        const { addresses } = get();
        return addresses.filter(addr => addr.userId === userId);
      }
    }),
    {
      name: 'address-storage',
      version: 1
    }
  )
);