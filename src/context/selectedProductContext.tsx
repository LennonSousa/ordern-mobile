import React, { createContext, useState } from 'react';
import { ProductValue } from '../components/ProductValues';

interface SelectedAdditionals {
    id: number;
    title: string;
    price: number;
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
    price_one: boolean;
    price: number;
    values: ProductValue[];
    selectedValue: number | undefined;
    amount: number;
    total: number;
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
        const priceProduct = product.price;

        let totalAdditionals = 0;

        product.categoiesAdditional.forEach(category => {
            category.selectedAdditionals.forEach(additional => {
                totalAdditionals = Number(totalAdditionals) + Number(additional.price);
            })
        });

        const amountProduct = product.amount;
        const subTotal = Number(priceProduct) + Number(totalAdditionals);



        const total = Number(subTotal) * Number(amountProduct);

        setSelectedProduct({ ...product, total });
    }

    return (
        <ContextSelectedProduct.Provider value={{ selectedProduct, handleSelectedProduct }}>
            {children}
        </ContextSelectedProduct.Provider>
    );
}

export { ContextSelectedProduct, ProductSelectedProvider };