import React, { createContext, useState } from 'react';

import { Store } from '../components/Store';
import { Highlight } from '../components/Highlights';

interface StoreContextData {
    store: Store | undefined;
    handleStore(storeItem: Store | undefined): void;
}

const StoreContext = createContext<StoreContextData>({} as StoreContextData);

const StoreProvider: React.FC = ({ children }) => {
    const [store, setStore] = useState<Store | undefined>();

    function handleStore(storeItem: Store) {
        if (!storeItem) {
            setStore(storeItem);
            return;
        }

        setStore({ ...storeItem, productsHighlights: handleHighlights(storeItem) });
    }

    return (
        <StoreContext.Provider value={{ store, handleStore }}>
            {children}
        </StoreContext.Provider>
    );
}

function handleHighlights(store: Store) {
    const highlightProducts: Highlight[] = [];

    store.productsHighlights.forEach(highlight => {
        store.categories.forEach(category => {
            const productFound = category.products.find(product => { return product.id === highlight.product.id })

            productFound && highlightProducts.push({ ...highlight, product: productFound });
        })
    });

    return highlightProducts;
}

export { StoreContext, StoreProvider };