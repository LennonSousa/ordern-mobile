import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';
import { CustomerContext } from '../context/customerContext';

interface AuthContextData {
    signed: boolean;
    loading: boolean;
    handleLogin(email: string, password: string): Promise<boolean>;
    handleLogout(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const { handleCustomer } = useContext(CustomerContext);
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            async () => {
                const storagedCustomer = await AsyncStorage.getItem('customer');
                const storagedToken = await AsyncStorage.getItem('token');

                if (storagedCustomer && storagedToken) {
                    api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`;

                    handleCustomer(JSON.parse(storagedCustomer));
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
            const res = await api.post('customer/authenticate', {
                email: emailLogin,
                password
            });

            const { id, name, cpf, birth, phone, email, active, paused, address, payment, token } = res.data;

            handleCustomer(
                {
                    id,
                    name,
                    cpf,
                    birth,
                    phone,
                    active,
                    paused,
                    email,
                    address,
                    payment
                }
            );

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
        api.defaults.headers.Authorization = undefined;
    }

    return (
        <AuthContext.Provider value={{ signed, loading, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };