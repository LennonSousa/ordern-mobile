import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import { ContextOrdering } from './context/orderingContext';

import Header from './components/PageHeader';
import LandingPage from './pages/LandingPage';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import CategoryAdditionals from './components/ProductCategories';
import NewCustomer from './pages/Profile/NewCustomer';
import CreateCustomer from './pages/Profile/NewCustomer/create';
import CustomerUpdate from './pages/Profile/UpdateCustomer';
import AddressCustomer from './pages/Profile/AddressCustomer';
import PaymentsCustomer from './pages/Profile/PaymentsCustomer';

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
                    tabBarBadge: amountOrderItems > 0 ? amountOrderItems : undefined,
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
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f2f3f5' } }}>
                <Stack.Screen
                    name="HomeTabs"
                    component={HomeTabs}
                />

                <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetails}
                    options={{
                        headerShown: true,
                        header: () => <Header title="Produto" />
                    }}
                />

                <Stack.Screen
                    name="CategoryAdditionals"
                    component={CategoryAdditionals}
                    options={{
                        headerShown: true,
                        header: () => <Header title="" showCancel={false} />
                    }}
                />

                <Stack.Screen
                    name="NewCustomer"
                    component={NewCustomer}
                    options={{
                        headerShown: true,
                        header: () => <Header title="Vamos começar!" showCancel={false} />
                    }}
                />

                <Stack.Screen
                    name="CustomerUpdate"
                    component={CustomerUpdate}
                    options={{
                        headerShown: true,
                        header: () => <Header title="Suas informações" showCancel={false} />
                    }}
                />

                <Stack.Screen
                    name="CreateCustomer"
                    component={CreateCustomer}
                    options={{
                        headerShown: true,
                        header: () => <Header title="Criar conta" showCancel={true} />
                    }}
                />

                <Stack.Screen
                    name="AddressCustomer"
                    component={AddressCustomer}
                    options={{
                        headerShown: true,
                        header: () => <Header title="Seus endereços" showCancel={true} />
                    }}
                />

                <Stack.Screen
                    name="PaymentsCustomer"
                    component={PaymentsCustomer}
                    options={{
                        headerShown: true,
                        header: () => <Header title="Formas de pagamento" showCancel={true} />
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}