import React from 'react';

export interface ProductAvailable {
    id: number;
    week_day: number;
    available: boolean;
    all_day: boolean;
    shift_01: boolean;
    shift_01_from: number;
    shift_01_to: number;
    shift_02: boolean;
    shift_02_from: number;
    shift_02_to: number;
    product_id: number;
}

interface ProductAvailableProps {
    productAvailable: ProductAvailable;
}

export default function ProductAvailables({ productAvailable }: ProductAvailableProps) {

}