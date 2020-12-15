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
}

const CustomerContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [client, setClient] = useState<Customer | null>(null);
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            async () => {
                const storagedUser = await AsyncStorage.getItem('client');
                const storagedToken = await AsyncStorage.getItem('token');

                if (storagedUser && storagedToken) {
                    api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`;

                    setClient(JSON.parse(storagedToken));
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

            const { id, name, email, token } = res.data;

            setClient({
                id,
                name,
                cpf: '',
                birth: new Date(),
                phone: '',
                email,
                address: []
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            await AsyncStorage.setItem('client', JSON.stringify(JSON.stringify({ id, name, email })));
            await AsyncStorage.setItem('token', token);

            setSigned(true);

            return true;
        }
        catch (error) {
            console.log('error get client authentication', error);
            return false;
        }
    }

    async function handleLogout() {
        await AsyncStorage.clear();
        setSigned(false);
        setClient(null);
        api.defaults.headers.Authorization = undefined;
    }

    return (
        <CustomerContext.Provider value={{ customer: client, signed, loading, handleLogin, handleLogout }}>
            {children}
        </CustomerContext.Provider>
    );
}

export { CustomerContext, AuthProvider };