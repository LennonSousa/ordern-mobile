import React, { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CustomerContext } from '../../context/customerContext';
import { ContextOrdering } from '../../context/orderingContext';
import OrderItems from '../../components/OrderItems';
import Header from '../../components/PageHeader';
import PageFooter from '../../components/PageFooter';
import globalStyles, { colorPrimaryDark } from '../../assets/styles/global';

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
            <Header title="Sacola" showCancel={false} showClearBag={order ? true : false} />
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
                </ScrollView> :
                    <Text>Sacola vaiza!</Text>
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
        container: {
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
        },

        divider: {
            borderTopColor: '#e6e6e6',
            borderTopWidth: 1,
            marginHorizontal: 5,
            marginVertical: 15
        },

        fieldsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 15,
        },

        fieldsColumn: {
            flex: 1,
        },

        menuRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        menuColumn: {
            flex: 0.8,
        },

        menuIconColumn: {
            flex: 0.2,
            alignItems: 'flex-end',
        },

        textsMenu: {
            fontFamily: 'Nunito_600SemiBold',
            fontSize: 22,
            color: '#262626'
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

        titles: {
            fontFamily: 'Nunito_300Light',
            fontSize: 18,
            color: '#8c8c8c',
            marginVertical: 10,
        },

        totalRow: {
            flexDirection: 'row'
        },

        totalColumnText: {
            flex: 0.5,
            marginVertical: 5,
        },

        totalColumnValue: {
            flex: 0.5,
            marginVertical: 5,
        },

        totalSubTitleText: {
            fontFamily: 'Nunito_300Light',
            fontSize: 16,
            color: '#8c8c8c',
        },

        totalSubTitleValue: {
            fontFamily: 'Nunito_300Light',
            fontSize: 16,
            color: '#8c8c8c',
            textAlign: 'right',
        },

        totalTitleText: {
            fontFamily: 'Nunito_600SemiBold',
            fontSize: 18,
            color: '#595959',
        },

        totalTitleValue: {
            fontFamily: 'Nunito_600SemiBold',
            fontSize: 18,
            color: '#595959',
            textAlign: 'right',
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
    }
)