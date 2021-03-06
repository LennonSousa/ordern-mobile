import React from 'react';
import { View } from 'react-native';

import { OrderStatus } from '../OrderStatus';
import { OrderItem } from '../OrderItems';

export interface Order {
    id: number;
    tracker: string;
    client_id: number;
    client: string;
    ordered: Date;
    delivery: Date;
    delivered: Date;
    sub_total: number;
    cupom: string;
    delivery_tax: number;
    delivery_type: string;
    discount: number;
    fee: number;
    total: number;
    payment: string | number;
    payment_type: string;
    paid: boolean;
    address: string;
    reason_cancellation: string;
    orderStatus: OrderStatus;
    orderItems: OrderItem[];
}

export default function Orders() {
    return <View></View>
}