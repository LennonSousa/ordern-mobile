import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';
import { Customer } from '../components/Customer';

interface AuthContextData {
    customer: Customer | null;
    signed: boolean;
    loading: boolean;
    handleLogin(email: string, password: string): Promise<boolean>;
    handleLogout(): Promise<void>;
    handleCustomer(customer: Customer): void;
}

const CustomerContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            async () => {
                const storagedCustomer = await AsyncStorage.getItem('customer');
                const storagedToken = await AsyncStorage.getItem('token');

                if (storagedCustomer && storagedToken) {
                    api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`;

                    setCustomer(JSON.parse(storagedCustomer));
                    setSigned(true);
                }
                else {
                    setSigned(false);
                }
            }
        } catch (error) {
            console.log('error client authentication: ', error);
            setSigned(false);
        }

        setLoading(false);
    }, []);

    async function handleLogin(emailLogin: string, password: string) {
        try {
            const res = await api.post('clients/authenticate', {
                email: emailLogin,
                password
            });

            setCustomer(res.data);

            const { id, name, email, token } = res.data;

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            await AsyncStorage.setItem('customer', JSON.stringify(JSON.stringify({ id, name, email })));
            await AsyncStorage.setItem('token', token);

            setSigned(true);

            return true;
        }
        catch (error) {
            console.log('error get customer authentication', error);
            return false;
        }
    }

    async function handleLogout() {
        await AsyncStorage.clear();
        setSigned(false);
        setCustomer(null);
        api.defaults.headers.Authorization = undefined;
    }

    function handleCustomer(customer: Customer){
        setCustomer(customer);
    }

    return (
        <CustomerContext.Provider value={{ customer, signed, loading, handleLogin, handleLogout, handleCustomer }}>
            {children}
        </CustomerContext.Provider>
    );
}

export { CustomerContext, AuthProvider };