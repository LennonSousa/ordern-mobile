import React from 'react';
import { Nunito_300Light, Nunito_300Light_Italic, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';

import Routes from './src/routes';

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
    <ProductSelectedProvider>
      <Routes />
    </ProductSelectedProvider>
  );
}