import React, { createContext, useState } from 'react';
import { Order } from '../components/Orders';

interface orderingContextData {
    order: Order | undefined;
    handleOrder(product: Order): void;
}

const ContextOrdering = createContext<orderingContextData>({} as orderingContextData);

const OrderingProvider: React.FC = ({ children }) => {
    const [order, setOrder] = useState<Order>();

    function handleOrder(order: Order) {
        setOrder(order);
    }

    return (
        <ContextOrdering.Provider value={{ order, handleOrder }}>
            {children}
        </ContextOrdering.Provider>
    );
}

export { ContextOrdering, OrderingProvider };