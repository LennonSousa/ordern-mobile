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
        let subTotalOrder = 0;

        order.orderItems.forEach(item => {
            const priceProduct = item.value;

            let totalAdditionals = 0;

            item.orderItemAdditionals.forEach(additional => {
                totalAdditionals = Number(totalAdditionals) + Number(additional.value);
            });

            const amountProduct = item.amount;
            const subTotalItem = Number(priceProduct) + Number(totalAdditionals);

            const total = Number(subTotalItem) * Number(amountProduct);

            totalOrder = totalOrder + total;
        });

        subTotalOrder = totalOrder;

        totalOrder = totalOrder + Number(order.delivery_tax);

        setOrder({ ...order, sub_total: subTotalOrder, total: totalOrder });
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