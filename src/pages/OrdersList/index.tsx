import React, { useContext } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

import api from '../../services/api';

import { AuthContext } from '../../context/authContext';
import OrdersListShimmer from '../../components/Shimmers/OrdersList';
import Header from '../../components/PageHeader';

import globalStyles, { colorPrimaryLight, colorHighLight } from '../../assets/styles/global';
import emptyOrderList from '../../assets/images/orders-list.png';
import orderListSignIn from '../../assets/images/orders-list-sign-in.png'
import ButtonListItem from '../../components/Interfaces/ButtonListItem';

export default function OrdersList() {
    const navigation = useNavigation();

    const { signed, customer, handleCustomer } = useContext(AuthContext);

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        if (!signed) {
            setRefreshing(false);
            return;
        }

        api.get(`customer/${customer?.id}`).then(res => {
            handleCustomer(res.data);
        }).catch(() => {
            setRefreshing(false);
            console.log('Orders list failed');
        }).finally(() => {
            setRefreshing(false);
        });
    }, [signed, customer]);

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
                        !refreshing ? (
                            customer && customer.orders.length > 0 ? customer.orders.map((order, index) => {
                                return <ButtonListItem key={index} onPress={() => { navigation.navigate('OrderDetails', { id: order.id }); }}>
                                    <View style={globalStyles.row}>
                                        <View style={{ flex: 1 }}>
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
                                                    <Text style={{ color: '#8c8c8c', textAlign: 'right' }}>{format(new Date(order.ordered_at), "dd/MM/yyyy' às 'HH:mm")}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </ButtonListItem>
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
                                    <Text style={globalStyles.buttonTextSignIn}>Entrar <Feather name="chevron-right" size={18} color={colorPrimaryLight} /></Text>
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
            height: '75%',
            resizeMode: 'contain'
        },
    });