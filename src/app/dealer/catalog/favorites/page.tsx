'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay } from '@mantine/core';
import { ProductFavoritesManager } from '@/components/dealer/ProductFavoritesManager';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter } from 'next/navigation';
import { generateMockProducts, MockProduct } from '@/lib/mockData/generators';

export interface FavoriteProduct {
  id: string;
  product: MockProduct;
  addedDate: Date;
  notes?: string;
  customListIds: string[];
}

export interface ProductList {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
  createdDate: Date;
  updatedDate: Date;
  isShared: boolean;
  sharedWith: string[];
  category?: string;
}

export default function DealerFavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([]);
  const [productLists, setProductLists] = useState<ProductList[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('dealerAuth');
    if (!auth) {
      router.push('/dealer/login');
      return;
    }

    // Load data
    const loadData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts = generateMockProducts(50);
      setProducts(mockProducts);
      
      // Load favorites from localStorage
      const savedFavorites = localStorage.getItem('dealerFavorites');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setFavoriteProducts(favorites.map((fav: any) => ({
          ...fav,
          addedDate: new Date(fav.addedDate)
        })));
      }

      // Load product lists from localStorage
      const savedLists = localStorage.getItem('dealerProductLists');
      if (savedLists) {
        const lists = JSON.parse(savedLists);
        setProductLists(lists.map((list: any) => ({
          ...list,
          createdDate: new Date(list.createdDate),
          updatedDate: new Date(list.updatedDate)
        })));
      }

      setUser({
        name: 'Mike Johnson',
        email: 'mike@abchvac.com',
        companyName: 'ABC HVAC Solutions',
        role: 'Owner',
      });

      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dealerAuth');
    localStorage.removeItem('dealerCart');
    localStorage.removeItem('dealerFavorites');
    localStorage.removeItem('dealerProductLists');
    router.push('/dealer/login');
  };

  const handleUpdateFavorites = (favorites: FavoriteProduct[]) => {
    setFavoriteProducts(favorites);
    localStorage.setItem('dealerFavorites', JSON.stringify(favorites));
  };

  const handleUpdateProductLists = (lists: ProductList[]) => {
    setProductLists(lists);
    localStorage.setItem('dealerProductLists', JSON.stringify(lists));
  };

  if (loading || !user) {
    return <LoadingOverlay visible />;
  }

  return (
    <DealerLayout>
      <Container size="xl">
        <ProductFavoritesManager
          products={products}
          favoriteProducts={favoriteProducts}
          productLists={productLists}
          onUpdateFavorites={handleUpdateFavorites}
          onUpdateProductLists={handleUpdateProductLists}
        />
      </Container>
    </DealerLayout>
  );
}