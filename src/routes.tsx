import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();

import Header from './components/PageHeader';
import LandingPage from './pages/LandingPage';
import ProductDetails from './pages/ProductDetails';
import CategoryAdditionals from './components/ProductCategories';
import Cart from './pages/Cart';

export default function Routes() {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f2f3f5' } }}>
                <Screen
                    name="LandingPage"
                    component={LandingPage}
                />

                <Screen
                    name="ProductDetails"
                    component={ProductDetails}
                    options={{
                        headerShown: true,
                        header: () => <Header title="Produto" />
                    }}
                />

                <Screen
                    name="CategoryAdditionals"
                    component={CategoryAdditionals}
                    options={{
                        headerShown: true,
                        header: () => <Header title="" showCancel={false} />
                    }}
                />

                <Screen
                    name="Cart"
                    component={Cart}
                    options={{
                        headerShown: true,
                        header: () => <Header title="Sacola" showCancel={true} />
                    }}
                />
            </Navigator>
        </NavigationContainer>
    )
}