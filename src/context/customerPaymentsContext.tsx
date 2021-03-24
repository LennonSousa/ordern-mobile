import React, { createContext, useState } from 'react';

import { CustomerPayment } from '../components/CustomerPayments';

interface CustomerPaymentsContextData {
    customerPayments: CustomerPayment[];
    handleCustomerPayments(customerPayments: CustomerPayment[]): void;
}

const CustomerPaymentsContext = createContext<CustomerPaymentsContextData>({} as CustomerPaymentsContextData);

const CustomerPaymentsProvider: React.FC = ({ children }) => {
    const [customerPayments, setCustomerPayments] = useState<CustomerPayment[]>([]);

    function handleCustomerPayments(customerPayments: CustomerPayment[]) {
        setCustomerPayments(customerPayments);
    }

    return (
        <CustomerPaymentsContext.Provider value={{ customerPayments, handleCustomerPayments }}>
            {children}
        </CustomerPaymentsContext.Provider>
    );
}

export { CustomerPaymentsContext, CustomerPaymentsProvider };