import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, FavoriteState } from '../types';

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (product: Product) => {
        const { favorites } = get();
        const existingIndex = favorites.findIndex(fav => fav.id === product.id);
        
        if (existingIndex === -1) {
          set({
            favorites: [...favorites, { ...product, addedAt: new Date().toISOString() }]
          });
        }
      },
      
      removeFavorite: (productId: string) => {
        set(state => ({
          favorites: state.favorites.filter(fav => fav.id !== productId)
        }));
      },
      
      isFavorite: (productId: string) => {
        const { favorites } = get();
        return favorites.some(fav => fav.id === productId);
      },
      
      toggleFavorite: (product: Product) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        
        if (isFavorite(product.id)) {
          removeFavorite(product.id);
        } else {
          addFavorite(product);
        }
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
      
      getFavoritesByCategory: (category: string) => {
        const { favorites } = get();
        return category === 'all' 
          ? favorites 
          : favorites.filter(fav => fav.category === category);
      },
      
      getFavoritesCount: () => {
        const { favorites } = get();
        return favorites.length;
      }
    }),
    {
      name: 'favorite-storage',
      version: 1
    }
  )
);