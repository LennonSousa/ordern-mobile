import React, { createContext, useState } from 'react';

import { Order } from '../components/Orders';

interface OrdersContextData {
    orders: Order[] | undefined;
    handleOrders(orders: Order[] | undefined): void;
}

const OrdersContext = createContext<OrdersContextData>({} as OrdersContextData);

const OrdersProvider: React.FC = ({ children }) => {
    const [orders, setOrders] = useState<Order[] | undefined>([]);

    function handleOrders(orders: Order[]) {
        setOrders(orders);
    }

    return (
        <OrdersContext.Provider value={{ orders, handleOrders }}>
            {children}
        </OrdersContext.Provider>
    );
}

export { OrdersContext, OrdersProvider };