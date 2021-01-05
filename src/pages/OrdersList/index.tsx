import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

import api from '../../services/api';

import OrderDetails from '../../pages/OrderDetails';
import { OrderStatus } from '../../components/OrderStatus';
import { Order } from '../../components/Orders';

import globalStyles, { colorPrimaryLight, colorPrimaryDark } from '../../assets/styles/global';

export default function OrdersList() {
    const navigation = useNavigation();

    const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([]);
    const [ordersList, setOrdersList] = useState<Order[]>([]);

    useEffect(() => {
        api.get('order-status').then(res => {
            setOrderStatus(res.data);
        })
            .catch(() => {

            });

        api.get('orders').then(res => {
            setOrdersList(res.data);
        })
            .catch(() => {

            });
    }, []);

    return (
        <View style={globalStyles.container}>
            <ScrollView style={globalStyles.containerMenu}>
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
                    orderStatus && ordersList && ordersList.map((order, index) => {
                        return <View key={index} style={globalStyles.containerItem}>
                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={{flex: 1}}>
                                            <BorderlessButton onPress={() => { navigation.navigate('OrderDetails', { id: order.id }); }}>
                                                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                    <View style={{flex: 0.7}}>
                                                        <Text style={{ color: '#8c8c8c' }}>{`Nº ${order.tracker}`}</Text>
                                                    </View>
                                                    <View style={{flex: 0.3}}>
                                                        <Text style={{ color: '#8c8c8c', textAlign: 'right' }}>{`R$ ${Number(order.total).toFixed(2).replace('.', ',')}`}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                                    <View style={globalStyles.colTitleButtonItem}>
                                                        <Text style={{ color: colorPrimaryLight }}>{`${order.orderStatus.title}`}</Text>
                                                    </View>
                                                    <View style={globalStyles.colTitleButtonItem}>
                                                        <Text style={{ color: '#8c8c8c', textAlign: 'right' }}>{format(new Date(order.ordered), 'dd/MM/yyyy hh:mm')}</Text>
                                                    </View>
                                                </View>
                                            </BorderlessButton>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </View>
                    })
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    containerMenu: {
        paddingHorizontal: 15,
    },

    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    menuColumn: {
        flex: 0.8,
    },

    menuDescriptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    menuDescriptionColumn: {
        flex: 1,
    },

    textsDescriptionMenu: {
        fontFamily: 'Nunito_300Light',
        fontSize: 14,
        color: '#8c8c8c'
    },

    menuIconColumn: {
        flex: 0.2,
        alignItems: 'flex-end',
    },

    fieldsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },

    fieldsColumn: {
        flex: 1,
    },

    buttonNewItem: {
        padding: 10,
        borderRadius: 5,
    },

    colTitleButtonItem: {
        flex: 0.9,
    },

    colIconButtonItem: {
        flex: 0.1,
    },

    containerItem: {
        marginVertical: 5,
        padding: 10,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 8
    },

    buttonTypeAddressCustomer: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#e8e8e8',
        alignItems: 'center',
    },

    buttonAction: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#cc0000',
        alignItems: 'center',
    },

    buttonConfirm: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ffcc00',
        alignItems: 'center',
    },

    fieldsLogIn: {
        marginVertical: 8,
    },

    footerButton: {
        backgroundColor: '#cc0000',
        borderRadius: 5,
        marginVertical: 15,
        height: 50,
        justifyContent: 'center'
    },

    footerButtonText: {
        color: '#ffffff',
        alignSelf: 'center',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
    },
});