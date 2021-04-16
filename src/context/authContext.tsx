import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as SecureStore from 'expo-secure-store';

import api from '../services/api';

import { Customer } from '../components/Customer';

interface AuthContextData {
    loading: boolean;
    signed: boolean;
    customer: Customer | undefined;
    handleCustomer(customer: Customer | undefined): void;
    handleLogin(email: string, password: string): Promise<boolean>;
    handleLogout(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [signed, setSigned] = useState(false);
    const [customer, setCustomer] = useState<Customer>();

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
                handleLogout();
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
                handleLogout();
            }
        }
    }

    useEffect(() => {
        try {
            //console.log('Auth provider useEffect...');
            trySignin();
        } catch (error) {
            //console.log('error customer authentication: ', error);
            handleLogout();
        }

        setLoading(false);
    }, []);

    async function handleLogin(emailLogin: string, password: string) {
        //console.log('Login...');

        try {
            const res = await api.post('customers/authenticate', {
                email: emailLogin,
                password,
            });

            if (res.status === 401) return false;

            const { customer, token } = res.data;

            handleCustomer(customer);

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

            //console.log('setSigned(true)');

            setSigned(true);

            return true;
        }
        catch (error) {
            console.log('error get customer authentication', error);
            return false;
        }
    }

    async function handleCustomer(customer: Customer | undefined) {
        setCustomer(customer);
    }

    async function handleLogout() {
        if (SecureStore.isAvailableAsync()) {
            await SecureStore.deleteItemAsync('emailLogin');
            await SecureStore.deleteItemAsync('password');
        }

        await AsyncStorage.clear();

        api.defaults.headers['Authorization'] = '';

        setSigned(false);
        setCustomer(undefined);

        api.defaults.headers.Authorization = undefined;
    }

    return (
        <AuthContext.Provider value={{ loading, signed, customer, handleCustomer, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };