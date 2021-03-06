import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

import api from '../../services/api';

import { AuthContext } from '../../context/authContext';
import { CustomerContext } from '../../context/customerContext';
import { Order } from '../../components/Orders';
import OrdersListShimmer from '../../components/Shimmers/OrdersList';
import Header from '../../components/PageHeader';

import globalStyles, { colorPrimaryLight, colorHighLight } from '../../assets/styles/global';
import emptyOrderList from '../../assets/images/orders-list.png';
import orderListSignIn from '../../assets/images/orders-list-sign-in.png'

export default function OrdersList() {
    const navigation = useNavigation();

    const { signed } = useContext(AuthContext);
    const { customer } = useContext(CustomerContext);

    const [ordersList, setOrdersList] = useState<Order[]>();

    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        if (customer) {
            setOrdersList(undefined);

            api.get(`customer/orders/${customer.id}`).then(res => {
                setOrdersList(res.data);
            })
                .catch(() => {
                    setOrdersList(undefined);
                });
        }
    }, [customer]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setOrdersList(undefined);
    }, []);

    useEffect(() => {
        if (customer && refreshing) {
            api.get(`customer/orders/${customer.id}`).then(res => {
                setOrdersList(res.data);
            })
                .catch(() => {
                    setOrdersList(undefined);
                });

            setRefreshing(false);
        }
    }, [refreshing]);

    return (
        <>
            <Header title="Pedidos" showCancel={false} showGoBack={false} customGoBack={'Profile'} />
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
                    signed ? (
                        ordersList ? (
                            ordersList.length > 0 ? ordersList.map((order, index) => {
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
                            ) : <View style={globalStyles.container}>
                                <View style={[globalStyles.row, { marginVertical: 0, height: 250 }]}>
                                    <View style={[globalStyles.column, { alignItems: 'center' }]}>
                                        <Image source={emptyOrderList} style={styles.imageContent} />
                                    </View>
                                </View>
                                <View style={[globalStyles.row, { marginVertical: 0 }]}>
                                    <View style={[globalStyles.column, { alignItems: 'center' }]}>
                                        <Text style={globalStyles.titlePrimaryLight}>Ainda sem pedidos?</Text>
                                        <Text style={globalStyles.textDescription}>Não perca tempo, faça o seu primeiro pedido.</Text>
                                    </View>
                                </View>
                            </View>
                        ) :
                            <OrdersListShimmer />
                    ) : <View style={globalStyles.container}>
                        <View style={[globalStyles.row, { marginVertical: 0, height: 250 }]}>
                            <View style={[globalStyles.column, { alignItems: 'center' }]}>
                                <Image source={orderListSignIn} style={styles.imageContent} />
                            </View>
                        </View>
                        <View style={[globalStyles.row, { marginVertical: 0 }]}>
                            <View style={[globalStyles.column, { alignItems: 'center' }]}>
                                <Text style={globalStyles.titlePrimaryLight}>Entre para continuar.</Text>
                                <Text style={globalStyles.textDescription}>Entre com a sua conta no aplicativo.</Text>
                            </View>
                        </View>

                        <View style={globalStyles.fieldsRow}>
                            <View style={globalStyles.fieldsColumn}>
                                <BorderlessButton onPress={() => { navigation.navigate('Profile') }}>
                                    <Text style={globalStyles.buttonTextSignIn}>Entrar</Text>
                                </BorderlessButton>
                            </View>
                        </View>
                    </View>
                }
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create(
    {
        imageContent: {
            height: '90%',
            resizeMode: 'contain'
        },
    });