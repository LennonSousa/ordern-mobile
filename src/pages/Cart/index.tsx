import React, { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CustomerContext } from '../../context/customerContext';
import { ContextOrdering } from '../../context/orderingContext';
import OrderItems from '../../components/OrderItems';
import Header from '../../components/PageHeader';
import PageFooter from '../../components/PageFooter';

import globalStyles, { colorPrimaryDark } from '../../assets/styles/global';
import emptyCart from '../../assets/images/empty-cart.png';

export default function Cart() {
    const { customer } = useContext(CustomerContext);
    const { order, handleOrder, handleTotalOrder } = useContext(ContextOrdering);
    const navigation = useNavigation();

    useEffect(() => {
        if (order) {
            handleTotalOrder(
                {
                    ...order,
                    delivery_tax: 0
                }
            );
        }
    }, []);

    function handleOrdertoShipment() {
        if (order) {
            handleOrder(
                {
                    ...order,
                    tracker: `${Date.now()}${order.total.toFixed(2).replace('.', '').replace(',', '')}`
                }
            );

            if (customer)
                navigation.navigate('Shipment');
            else
                navigation.navigate('Profile');
        }
    }

    return (
        <>
            <Header title="Sacola" showGoBack={false} showCancel={false} showClearBag={order ? true : false} />
            {
                order ? <ScrollView style={globalStyles.container}>
                    <View>
                        <Text style={globalStyles.titlePrimaryLight}>Itens</Text>
                        {
                            order.orderItems.map(item => {
                                return <OrderItems key={item.id} orderItem={item} />
                            })
                        }
                    </View>

                    <View style={globalStyles.row}>
                        <View style={globalStyles.column}>
                            <Text style={globalStyles.textsMenu}>{`Taxa de engreta: R$ ${Number(order.delivery_tax).toFixed(2).replace('.', ',')}`}</Text>
                        </View>
                    </View>
                </ScrollView> : <View style={globalStyles.container}>
                        <View style={[globalStyles.row, { marginVertical: 0 }]}>
                            <View style={[globalStyles.column, { alignItems: 'center' }]}>
                                <Image source={emptyCart} style={styles.imageEmptyCart} />
                            </View>
                        </View>
                        <View style={[globalStyles.row, { marginVertical: 0 }]}>
                            <View style={[globalStyles.column, { alignItems: 'center' }]}>
                                <Text style={globalStyles.titlePrimaryLight}>Sacola vazia!</Text>
                                <Text style={globalStyles.textDescription}>Aproveite e adicione items para comprar.</Text>
                            </View>
                        </View>
                    </View>

            }

            {
                order && <PageFooter>
                    <View style={{ flex: 0.5 }} >
                        <Text style={[globalStyles.textsMenu, { textAlign: 'center' }]}>{`Total: R$ ${order?.total.toFixed(2).replace('.', ',')}`}</Text>
                    </View>

                    <View style={{ flex: 0.5 }} >
                        <TouchableHighlight
                            underlayColor={colorPrimaryDark}
                            style={globalStyles.footerButton}
                            disabled={order ? false : true}
                            onPress={handleOrdertoShipment}
                        >
                            <Text style={globalStyles.footerButtonText}>Avançar</Text>
                        </TouchableHighlight>
                    </View>
                </PageFooter>
            }
        </>
    )
}

const styles = StyleSheet.create(
    {
        imageEmptyCart: {
            height: `${(22 * Dimensions.get('window').width) / 100}%`,
            resizeMode: 'contain'
        }
    }
)