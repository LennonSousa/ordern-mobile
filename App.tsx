import React from 'react';
import { Nunito_300Light, Nunito_300Light_Italic, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';

import Routes from './src/routes';

import { RestaurantProvider } from './src/context/restaurantContext';
import { CategoriesProvider } from './src/context/categoriesContext';
import { AuthProvider } from './src/context/authContext';
import { CustomerProvider } from './src/context/customerContext';

import { OrderingProvider } from './src/context/orderingContext';
import { SelectedProductProvider } from './src/context/selectedProductContext';

export default function App() {
  const [fonstLoaded] = useFonts({
    Nunito_300Light,
    Nunito_300Light_Italic,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold
  });

  if (!fonstLoaded) {
    return null;
  }

  return (
    <RestaurantProvider>
      <CategoriesProvider>
        <CustomerProvider>
          <AuthProvider>
            <OrderingProvider>
              <SelectedProductProvider>
                <Routes />
              </SelectedProductProvider>
            </OrderingProvider>
          </AuthProvider>
        </CustomerProvider>
      </CategoriesProvider>
    </RestaurantProvider>
  );
}