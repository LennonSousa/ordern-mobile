import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Feather } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import { ContextOrdering } from './context/orderingContext';

import Header from './components/PageHeader';
import LandingPage from './pages/LandingPage';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Shipment from './pages/Shipment';
import OrderReview from './pages/OrderPreview';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import CategoryAdditionals from './components/ProductCategories';
import CustomerNew from './pages/Profile/CustomerNew';
import CreateCustomer from './pages/Profile/CustomerNew/create';

import CustomerNewReset from './pages/Profile/CustomerReset/index'
import CustomerReset from './pages/Profile/CustomerReset/reset'

import CustomerUpdate from './pages/Profile/UpdateCustomer';
import OrdersList from './pages/OrdersList';
import AddressCustomer from './pages/Profile/AddressCustomer';
import PaymentsCustomer from './pages/Profile/PaymentsCustomer';
import OrderDetails from './pages/OrderDetails';

import PrivacyTerms from './pages/PricacyTerms';
import { StatusBar } from 'react-native';

function HomeTabs() {
    const { order } = useContext(ContextOrdering);
    const [amountOrderItems, setAmountOrderItems] = useState(0);

    useEffect(() => {
        if (order) {
            let totalAmount = 0;
            order.orderItems.forEach(item => {
                totalAmount = totalAmount + item.amount;
            });

            setAmountOrderItems(totalAmount);
        }
    }, [order]);

    return (
        <Tab.Navigator tabBarOptions={{ activeTintColor: '#fe3807', keyboardHidesTabBar: true }}>
            <Tab.Screen
                name="LandingPage"
                component={LandingPage}
                options={{
                    tabBarLabel: 'Início',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={size} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Cart"
                component={Cart}
                options={{
                    tabBarLabel: 'Sacola',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="shopping-bag" size={size} color={color} />
                    ),
                    tabBarBadge: order ? amountOrderItems : undefined,
                }}
            />

            <Tab.Screen
                name="OrdersList"
                component={OrdersList}
                options={{
                    tabBarLabel: 'Pedidos',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="file-text" size={size} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={size} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

export default function Routes() {
    return (
        <>
            <StatusBar
                animated
                barStyle="dark-content"
                translucent
                backgroundColor="transparent"
            />

            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f2f3f5' } }}>
                    <Stack.Screen
                        name="HomeTabs"
                        component={HomeTabs}
                    />

                    <Stack.Screen
                        name="ProductDetails"
                        component={ProductDetails}
                    />

                    <Stack.Screen
                        name="Search"
                        component={Search}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Buscar" showGoBack={false} />
                        }}
                    />

                    <Stack.Screen
                        name="CategoryAdditionals"
                        component={CategoryAdditionals}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="" showCancel={false} />
                        }}
                    />

                    <Stack.Screen
                        name="CustomerNew"
                        component={CustomerNew}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Vamos começar!" showCancel={false} />
                        }}
                    />

                    <Stack.Screen
                        name="CreateCustomer"
                        component={CreateCustomer}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Criar o seu cadastro" showCancel={false} />
                        }}
                    />

                    <Stack.Screen
                        name="CustomerNewReset"
                        component={CustomerNewReset}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Vamos começar!" showCancel={false} />
                        }}
                    />

                    <Stack.Screen
                        name="CustomerReset"
                        component={CustomerReset}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Redefinir senha" showCancel={false} />
                        }}
                    />

                    <Stack.Screen
                        name="CustomerUpdate"
                        component={CustomerUpdate}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Suas informações" showCancel={false} />
                        }}
                    />

                    <Stack.Screen
                        name="AddressCustomer"
                        component={AddressCustomer}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Seus endereços" showCancel={true} />
                        }}
                    />

                    <Stack.Screen
                        name="PaymentsCustomer"
                        component={PaymentsCustomer}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Formas de pagamento" showCancel={true} />
                        }}
                    />

                    <Stack.Screen
                        name="Shipment"
                        component={Shipment}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Envio" showCancel={true} />
                        }}
                    />

                    <Stack.Screen
                        name="OrderReview"
                        component={OrderReview}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Pedido" showCancel={true} />
                        }}
                    />

                    <Stack.Screen
                        name="Payment"
                        component={Payment}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Pagamento" showCancel={true} />
                        }}
                    />

                    <Stack.Screen
                        name="OrderDetails"
                        component={OrderDetails}
                        options={{
                            headerShown: true,
                            header: () => <Header notchPaddingTop={getStatusBarHeight()} title="Pedido" customGoBack={'OrdersList'} />
                        }}
                    />

                    <Stack.Screen
                        name="PrivacyTerms"
                        component={PrivacyTerms}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}