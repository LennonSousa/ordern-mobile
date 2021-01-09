import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { CategoriesContext } from '../../context/categoriesContext';

export interface OrderItem {
    id: number;
    amount: number;
    name: string;
    value: number;
    additional: boolean;
    additional_id: number;
    additional_item: number;
    additionals: OrderItem[];
}

interface OrderItemProps {
    orderItem: OrderItem;
}

export default function OrderItems({ orderItem }: OrderItemProps) {
    const navigation = useNavigation();
    const { categories } = useContext(CategoriesContext);

    const priceProduct = orderItem.value;

    let totalAdditionals = 0;

    orderItem.additionals && orderItem.additionals.forEach(additional => {
        totalAdditionals = Number(totalAdditionals) + Number(additional.value);
    });

    const amountProduct = orderItem.amount;
    const subTotal = Number(priceProduct) + Number(totalAdditionals);

    const total = Number(subTotal) * Number(amountProduct);

    function handleNavigateToProductDetails(id: number) {
        if (categories) {
            categories.forEach(category => {
                category.products.forEach(product => {
                    if (product.id === id) {
                        navigation.navigate('ProductDetails', { product });
                    }
                })
            });
        }
    }

    return (
        <View style={styles.container}>
            <BorderlessButton onPress={() => { handleNavigateToProductDetails(orderItem.id) }}>
                <View style={styles.itemRow}>
                    <View style={styles.itemColumnAmount}>
                        <Text style={styles.itemAmountText}>{Number(orderItem.amount).toFixed(0)}</Text>
                    </View>

                    <View style={styles.itemColumnName}>
                        <Text style={styles.itemTexts}>{orderItem.name}</Text>
                    </View>

                    <View style={styles.itemColumnValue}>
                        <Text style={styles.itemValueTexts}>{`R$ ${Number(orderItem.value).toFixed(2).replace('.', ',')}`}</Text>
                    </View>
                </View>
            </BorderlessButton>
            <View style={styles.additionalContainer}>
                {
                    orderItem.additionals && orderItem.additionals.map(additional => {
                        return <View key={additional.id} style={styles.additionalRow}>
                            <View style={styles.additionalColumnAmount}>
                                <Text style={styles.additionalTextAmount}>{Number(additional.amount).toFixed(0)}</Text>
                            </View>

                            <View style={styles.additionalColumnName}>
                                <Text style={styles.additionalTexts}>{additional.name}</Text>
                            </View>

                            <View style={styles.additionalColumnValue}>
                                <Text style={styles.additionalTexts}>{`R$ ${Number(additional.value).toFixed(2).replace('.', ',')}`}</Text>
                            </View>
                        </View>
                    })
                }
            </View>

            <View style={styles.itemTotalContainer}>
                <Text style={styles.itemTotalText}>{`R$ ${Number(total).toFixed(2).replace('.', ',')}`}</Text>
            </View>
            {/* Divider*/}
            <View style={styles.divider}></View>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            marginVertical: 5,
            marginHorizontal: 10
        },

        divider: {
            borderTopColor: '#e6e6e6',
            borderTopWidth: 1,
            marginHorizontal: 15,
            marginVertical: 15
        },

        itemRow: {
            flexDirection: 'row',
        },

        itemColumnAmount: {
            flex: 0.1,
            backgroundColor: '#8c8c8c',
            borderRadius: 3,
            marginRight: 5,
        },

        itemColumnName: {
            flex: 0.7
        },

        itemColumnValue: {
            flex: 0.2
        },

        itemAmountText: {
            color: '#ffffff',
            textAlign: 'center',
        },

        itemTexts: {
            color: '#4d4d4d',
        },

        itemValueTexts: {
            color: '#4d4d4d',
            textAlign: 'center',
        },

        itemTotalContainer: {
            flexDirection: 'row',
            marginVertical: 5,
            justifyContent: 'flex-end'
        },

        itemTotalText: {
            flex: 0.2,
            color: '#ffffff',
            textAlign: 'center',
            backgroundColor: '#ff6666',
            borderRadius: 3,
        },

        additionalContainer: {
            marginLeft: 15
        },

        additionalRow: {
            flexDirection: 'row',
            marginVertical: 5,
            marginLeft: 8,
            alignItems: 'center'
        },

        additionalColumnAmount: {
            flex: 0.1,
            backgroundColor: '#e6e6e6',
            borderRadius: 3,
            marginRight: 5,
        },

        additionalColumnName: {
            flex: 0.7
        },

        additionalColumnValue: {
            flex: 0.2
        },

        additionalTextAmount: {
            textAlign: 'center',
            fontSize: 10,
            color: '#8c8c8c',
        },

        additionalTexts: {
            color: '#8c8c8c',
        },
    }
)