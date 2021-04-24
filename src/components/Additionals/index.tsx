import React from 'react';

import { ProductAdditional } from '../ProductAdditionals';

export interface Additional {
    id: string;
    title: string;
    code: string;
    paused: boolean;
    productAdditionals: ProductAdditional[];
}

export default function Additionals(){

}