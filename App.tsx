import React from 'react';
import { Nunito_300Light, Nunito_300Light_Italic, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';

import Routes from './src/routes';

import { StoreProvider } from './src/context/storeContext';
import { OpenedDaysProvider } from './src/context/openedDaysContext';
import { HighlightsProvider } from './src/context/highlightsContext';
import { CategoriesProvider } from './src/context/categoriesContext';
import { AuthProvider } from './src/context/authContext';
import { OrderingProvider } from './src/context/orderingContext';
import { SelectedProductProvider } from './src/context/selectedProductContext';
import { CustomerPaymentsProvider } from './src/context/customerPaymentsContext';

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
    <StoreProvider>
      <OpenedDaysProvider>
        <HighlightsProvider>
          <CategoriesProvider>
            <AuthProvider>
              <OrderingProvider>
                <SelectedProductProvider>
                  <CustomerPaymentsProvider>
                    <Routes />
                  </CustomerPaymentsProvider>
                </SelectedProductProvider>
              </OrderingProvider>
            </AuthProvider>
          </CategoriesProvider>
        </HighlightsProvider>
      </OpenedDaysProvider>
    </StoreProvider>
  );
}