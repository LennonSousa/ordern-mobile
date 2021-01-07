import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

import api from '../../services/api';

import { CustomerContext } from '../../context/customerContext';
import { Order } from '../../components/Orders';
import OrdersListShimmer from '../../components/Shimmers/OrdersList';

import globalStyles, { colorPrimaryLight, colorHighLight } from '../../assets/styles/global';
import Header from '../../components/PageHeader';

export default function OrdersList() {
    const navigation = useNavigation();
    const { customer } = useContext(CustomerContext);

    const [ordersList, setOrdersList] = useState<Order[]>();

    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        if (customer) {
            const unsubscribe = navigation.addListener('focus', () => {
                setOrdersList(undefined);

                api.get(`customer/orders/${customer.id}`).then(res => {
                    setOrdersList(res.data);
                })
                    .catch(() => {

                    });
            });

            return unsubscribe;
        }
    }, [navigation]);

    useEffect(() => {
        if (customer && refreshing) {
            api.get(`customer/orders/${customer.id}`).then(res => {
                setOrdersList(res.data);
            })
                .catch(() => {

                });

            setRefreshing(false);
        }
    }, [refreshing]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setOrdersList(undefined);
    }, []);

    return (
        <>
            <Header title="Pedido" customGoBack={'Profile'} />
            <ScrollView
                style={globalStyles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={globalStyles.fieldsRow}>
                    <View style={globalStyles.fieldsColumn}>
                        <View style={globalStyles.menuRow}>
                            <View style={globalStyles.menuColumn}>
                                <Text style={globalStyles.textsDescriptionMenu}>Seus pedidos feitos no aplicativo</Text>
                            </View>
                            <View style={globalStyles.menuIconColumn}>
                                <View>
                                    <Feather name="shopping-bag" size={24} color="#cc0000" />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {
                    ordersList ? ordersList.map((order, index) => {
                        return <View key={index} style={globalStyles.containerItem}>
                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={{ flex: 1 }}>
                                            <BorderlessButton onPress={() => { navigation.navigate('OrderDetails', { id: order.id }); }}>
                                                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                    <View style={{ flex: 0.7 }}>
                                                        <Text style={{ color: '#8c8c8c' }}>{`Nº ${order.tracker}`}</Text>
                                                    </View>
                                                    <View style={{ flex: 0.3 }}>
                                                        <Text style={{ color: '#8c8c8c', textAlign: 'right' }}>{`R$ ${Number(order.total).toFixed(2).replace('.', ',')}`}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                                    <View style={globalStyles.colTitleButtonItem}>
                                                        <Text style={{ color: order.orderStatus.order === 4 ? colorHighLight : colorPrimaryLight }}>{`${order.orderStatus.title}`}</Text>
                                                    </View>
                                                    <View style={globalStyles.colTitleButtonItem}>
                                                        <Text style={{ color: '#8c8c8c', textAlign: 'right' }}>{format(new Date(order.ordered), "dd/MM/yyyy' às 'HH:mm")}</Text>
                                                    </View>
                                                </View>
                                            </BorderlessButton>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    ) :
                        <OrdersListShimmer />
                }
            </ScrollView>
        </>
    )
}