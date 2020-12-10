import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import api from '../services/api';

interface Client {
    id: number,
    name: string;
    email: string;
}

interface AuthContextData {
    client: Client | null;
    signed: boolean;
    loading: boolean;
    handleLogin(email: string, password: string): Promise<void>;
    handleLogout(): Promise<void>;
}

const ClientContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [client, setClient] = useState<Client | null>(null);
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async () => {
            try {
                // Retrieve the credentials
                const storagedUser = await SecureStore.getItemAsync('@PedidosEntergas01:user');
                const storagedToken = await SecureStore.getItemAsync('@PedidosEntergas01:token');

                if (storagedUser && storagedToken) {
                    api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`;

                    setClient(JSON.parse(storagedUser));
                    setSigned(true);
                } else {
                    setSigned(false);
                }
            } catch (error) {
                console.log("Keychain couldn't be accessed!", error);
            }
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

            setClient({ id, name, email });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            await SecureStore.setItemAsync('@PedidosEntergas01:user', JSON.stringify({ id, name, email })).then(async () => {
                await SecureStore.setItemAsync('@PedidosEntergas01:token', token).then(() => {
                    setSigned(true);
                });
            });
        }
        catch {

        }
    }

    async function handleLogout() {
        setSigned(false);
        api.defaults.headers.Authorization = undefined;
    }

    return (
        <ClientContext.Provider value={{ client: client, signed, loading, handleLogin, handleLogout }}>
            {children}
        </ClientContext.Provider>
    );
}

export { ClientContext, AuthProvider };