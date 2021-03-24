import React from 'react';
import { View } from 'react-native';

import { OrderStatus } from '../OrderStatus';
import { OrderItem } from '../OrderItems';

export interface Order {
    id: number;
    tracker: string;
    client_id: number;
    client: string;
    ordered_at: Date;
    delivery_in: Date;
    placed_at: Date;
    delivered_at: Date;
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
    cancelled_at: Date;
    orderStatus: OrderStatus;
    orderItems: OrderItem[];
}

export default function Orders() {
    return <View></View>
}