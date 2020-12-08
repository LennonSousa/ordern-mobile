import React, { createContext, useState } from 'react';

interface SelectedAdditionals {
    id: number;
    title: string;
    enabled: boolean;
}

interface CategoriesAdditional {
    id: number;
    min: number;
    max: number;
    selectedAdditionals: SelectedAdditionals[];
}

export interface SelectedProduct {
    id: number;
    price: number;
    categoiesAdditional: CategoriesAdditional[];
}

interface SelectedProductContextData {
    selectedProduct: SelectedProduct | undefined;
    handleSelectedProduct(product: SelectedProduct): void;
}

const ContextSelectedProduct = createContext<SelectedProductContextData>({} as SelectedProductContextData);

const ProductSelectedProvider: React.FC = ({ children }) => {
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct>();

    function handleSelectedProduct(product: SelectedProduct) {
        setSelectedProduct(product);
    }

    return (
        <ContextSelectedProduct.Provider value={{ selectedProduct, handleSelectedProduct }}>
            {children}
        </ContextSelectedProduct.Provider>
    );
}

export { ContextSelectedProduct, ProductSelectedProvider };