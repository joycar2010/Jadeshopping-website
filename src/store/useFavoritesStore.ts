import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface FavoritesState {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (item) => {
        const { favorites } = get();
        if (!favorites.find(fav => fav.id === item.id)) {
          set({ favorites: [...favorites, item] });
        }
      },
      
      removeFavorite: (id) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(item => item.id !== id) });
      },
      
      isFavorite: (id) => {
        const { favorites } = get();
        return favorites.some(item => item.id === id);
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);