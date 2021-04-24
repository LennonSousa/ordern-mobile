import { OrderStatus } from '../OrderStatus';
import { OrderItem } from '../OrderItems';

export interface Order {
    id: string;
    tracker: string;
    customer_id: string;
    customer: string;
    ordered_at: Date;
    delivery_in: Date;
    placed_at: Date;
    delivered_at: Date;
    sub_total: number;
    cupom: string;
    delivery_tax: number;
    delivery_type: string;
    delivery_estimated: number;
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