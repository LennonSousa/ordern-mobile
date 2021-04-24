import React, { createContext, useState } from 'react';

import { Store } from '../components/Store';

interface StoreContextData {
    store: Store | undefined;
    handleStore(storeItem: Store | undefined): void;
}

const StoreContext = createContext<StoreContextData>({} as StoreContextData);

const StoreProvider: React.FC = ({ children }) => {
    const [store, setStore] = useState<Store | undefined>();

    function handleStore(storeItem: Store) {
        setStore(storeItem);
    }

    return (
        <StoreContext.Provider value={{ store, handleStore }}>
            {children}
        </StoreContext.Provider>
    );
}

export { StoreContext, StoreProvider };