import React from 'react';

import { ProductAdditional } from '../ProductAdditionals';

export interface Additional {
    id: number;
    title: string;
    code: string;
    paused: boolean;
    productAdditionals: ProductAdditional[];
}

interface AdditionalProps {
    additional: Additional;
}

export default function Additionals(){

}