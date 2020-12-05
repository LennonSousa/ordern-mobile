import React from 'react';

export interface ProductValue {
    id: number;
    description: string;
    value: number;
    order: number;
    product: number;
}

interface ProductValueProps {
    productValue: ProductValue;
}

export default function ProductValues({ productValue }: ProductValueProps) {

}