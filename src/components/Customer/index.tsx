import React from 'react';

import { CustomerAddress } from '../CustomerAddress';

export interface Customer {
    id: number;
    name: string;
    cpf: string;
    birth: Date;
    phone: string;
    email: string;
    active: boolean;
    paused: boolean;
    address: CustomerAddress[];
    payment: string[];
}