import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as SecureStore from 'expo-secure-store';

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

    async function trySignin() {
        //console.log('Recuperando login e senha...');

        if (SecureStore.isAvailableAsync()) {
            //console.log('SecureStore is availables.');

            const emailLogin = await SecureStore.getItemAsync('emailLogin');
            const password = await SecureStore.getItemAsync('password');

            //console.log('emailLogin && password', emailLogin, password);

            if (emailLogin && password) {
                handleLogin(emailLogin, password);
            }
            else {
                setSigned(false);
            }
        }
        else {
            const emailLogin = await AsyncStorage.getItem('emailLogin');
            const password = await AsyncStorage.getItem('password');

            //console.log('emailLogin && password', emailLogin, password);

            if (emailLogin && password) {
                handleLogin(emailLogin, password);
            }
            else {
                setSigned(false);
            }
        }
    }

    useEffect(() => {
        try {
            //console.log('Auth provider useEffect...');

            trySignin();
        } catch (error) {
            //console.log('error customer authentication: ', error);
            setSigned(false);
        }

        setLoading(false);
    }, []);

    async function handleLogin(emailLogin: string, password: string) {
        //console.log('Login...');

        try {
            const res = await api.post('customers/authenticate', {
                email: emailLogin,
                password
            });

            const { id, name, cpf, birth, phone, email, active, paused, created_at, address, payment, token } = res.data;

            handleCustomer(
                {
                    id,
                    name,
                    cpf,
                    birth,
                    phone,
                    active,
                    paused,
                    created_at,
                    email,
                    address,
                    payment
                }
            );

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            if (SecureStore.isAvailableAsync()) {
                //console.log('SecureStore is availables.');

                await SecureStore.setItemAsync('emailLogin', emailLogin);
                await SecureStore.setItemAsync('password', password);
            }
            else {
                await AsyncStorage.setItem('emailLogin', emailLogin);
                await AsyncStorage.setItem('password', password);
            }

            //console.log('Sucesso...');

            setSigned(true);

            return true;
        }
        catch (error) {
            //console.log('error get customer authentication', error);
            return false;
        }
    }

    async function handleLogout() {
        if (SecureStore.isAvailableAsync()) {
            await SecureStore.deleteItemAsync('emailLogin');
            await SecureStore.deleteItemAsync('password');
        }

        await AsyncStorage.clear();

        setSigned(false);
        handleCustomer(null);
        
        api.defaults.headers.Authorization = undefined;
    }

    return (
        <AuthContext.Provider value={{ signed, loading, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };