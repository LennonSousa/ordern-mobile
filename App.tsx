import React from 'react';
import { Nunito_300Light, Nunito_300Light_Italic, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';

import Routes from './src/routes';
import { CategoriesProvider } from './src/context/categoriesContext';
import { AuthProvider } from './src/context/authContext';
import { CustomerProvider } from './src/context/customerContext';

import { OrderingProvider } from './src/context/orderingContext';
import { ProductSelectedProvider } from './src/context/selectedProductContext';

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
    <CategoriesProvider>
      <CustomerProvider>
        <AuthProvider>
          <OrderingProvider>
            <ProductSelectedProvider>
              <Routes />
            </ProductSelectedProvider>
          </OrderingProvider>
        </AuthProvider>
      </CustomerProvider>
    </CategoriesProvider>
  );
}