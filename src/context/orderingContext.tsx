import React, { createContext, useState } from 'react';
import { Order } from '../components/Orders';

interface orderingContextData {
    order: Order | undefined;
    handleOrder(order: Order): void;
    handleTotalOrder(product: Order): void;
    handleClearOrder(): void;
}

const ContextOrdering = createContext<orderingContextData>({} as orderingContextData);

const OrderingProvider: React.FC = ({ children }) => {
    const [order, setOrder] = useState<Order>();

    function handleOrder(order: Order) {
        setOrder(order);
    }

    function handleTotalOrder(order: Order) {
        let totalOrder = 0;

        order.orderItems.forEach(item => {
            const priceProduct = item.value;

            let totalAdditionals = 0;

            item.additionals.forEach(additional => {
                totalAdditionals = Number(totalAdditionals) + Number(additional.value);
            });

            const amountProduct = item.amount;
            const subTotal = Number(priceProduct) + Number(totalAdditionals);



            const total = Number(subTotal) * Number(amountProduct);

            totalOrder = totalOrder + total;
        });

        setOrder({ ...order, total: totalOrder });
    }

    function handleClearOrder() {
        setOrder(undefined);
    }

    return (
        <ContextOrdering.Provider value={{ order, handleOrder, handleTotalOrder, handleClearOrder }}>
            {children}
        </ContextOrdering.Provider>
    );
}

export { ContextOrdering, OrderingProvider };