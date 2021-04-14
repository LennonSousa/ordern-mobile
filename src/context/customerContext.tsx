import React, { createContext, useState } from 'react';

import { Customer } from '../components/Customer';

interface CustomerContextData {
    customer: Customer | null;
    handleCustomer(customer: Customer | null): void;
}

const CustomerContext = createContext<CustomerContextData>({} as CustomerContextData);

const CustomerProvider: React.FC = ({ children }) => {
    const [customer, setCustomer] = useState<Customer | null>(null);

    function handleCustomer(customer: Customer) {
        setCustomer(customer);
    }

    return (
        <CustomerContext.Provider value={{ customer, handleCustomer }}>
            {children}
        </CustomerContext.Provider>
    );
}

export { CustomerContext, CustomerProvider };