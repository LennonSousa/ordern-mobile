import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TouchableHighlight } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import { ContextOrdering } from '../../context/orderingContext';
import ItemAdditional, { OrderItemAdditional } from '../OrderItemAdditionals';

import globalStyles, { colorPrimaryLight, colorPrimaryDark } from '../../assets/styles/global';

export interface OrderItem {
    id: number;
    amount: number;
    name: string;
    value: number;
    product_id: number;
    orderItemAdditionals: OrderItemAdditional[];
}

interface OrderItemProps {
    orderItem: OrderItem;
}

export default function OrderItems({ orderItem }: OrderItemProps) {
    const { order, handleTotalOrder, handleClearOrder } = useContext(ContextOrdering);

    const [modalEdit, setModalEdit] = useState(false);

    const priceProduct = orderItem.value;

    let totalAdditionals = 0;

    orderItem.orderItemAdditionals && orderItem.orderItemAdditionals.forEach(additional => {
        totalAdditionals = Number(totalAdditionals) + Number(additional.value);
    });

    const amountProduct = orderItem.amount;
    const subTotal = Number(priceProduct) + Number(totalAdditionals);

    const total = Number(subTotal) * Number(amountProduct);

    function handleAmount(operation: string) {
        if (order) {
            handleTotalOrder(
                {
                    ...order, orderItems: order.orderItems.map(item => {
                        if (item.id === orderItem.id) {
                            if (operation === "plus")
                                return {
                                    ...item, amount: item.amount + 1
                                };
                            else if (operation === "minus" && item.amount !== 0)
                                return {
                                    ...item, amount: item.amount - 1
                                };
                        }

                        return item;
                    })
                }
            );
        }
    }

    function handleAmountRemoveItem() {
        if (order) {
            if (order.orderItems.length === 1)
                handleClearOrder();
            else {
                const newItemnsToOrder = order.orderItems.filter(item => { return item.id !== orderItem.id; });

                handleTotalOrder(
                    {
                        ...order, orderItems: newItemnsToOrder.map((item, index) => {

                            return { ...item, id: index };
                        })
                    }
                );
            }

            setModalEdit(false);
        }
    }

    return (
        <View style={globalStyles.container}>
            <BorderlessButton onPress={() => { setModalEdit(true) }}>
                <View>
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

                    <View style={styles.additionalContainer}>
                        {
                            orderItem.orderItemAdditionals && orderItem.orderItemAdditionals.map((additional, index) => {
                                return <ItemAdditional key={index} orderItemAdditional={additional} />
                            })
                        }
                    </View>

                    <View style={styles.itemTotalContainer}>
                        <Text style={styles.itemTotalText}>{`R$ ${Number(total).toFixed(2).replace('.', ',')}`}</Text>
                    </View>
                </View>
            </BorderlessButton>

            {/* Divider*/}
            <View style={globalStyles.divider}></View>

            { /* Modal to edit product amount */}
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalEdit}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flex: 1 }}>
                                <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                                    <Text style={[globalStyles.subTitlePrimary, { flex: 1, textAlign: 'center' }]}>{orderItem.name}</Text>
                                </View>

                                <View style={{ marginVertical: 10, flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() => { handleAmount("minus") }}
                                        disabled={
                                            orderItem.amount > 0 ? false : true
                                        }
                                        style={{ flex: 0.3 }}
                                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                                    >
                                        <Feather name="minus" style={styles.iconButtons} />
                                    </TouchableOpacity>


                                    <Text style={[styles.iconButtons, { flex: 0.4 }]}>{orderItem.amount}</Text>

                                    <TouchableOpacity
                                        style={{ flex: 0.3 }}
                                        onPress={() => { handleAmount("plus") }}
                                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                                    >
                                        <Feather name="plus" style={styles.iconButtons} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                    <Text style={[globalStyles.titlePrimaryLight, { flex: 1, textAlign: 'center' }]}>{`R$ ${Number(total).toFixed(2).replace('.', ',')}`}</Text>
                                </View>

                                {
                                    orderItem.amount === 0 && <View style={{ marginTop: 5, flexDirection: 'row' }}>
                                        <TouchableHighlight
                                            underlayColor={colorPrimaryDark}
                                            style={[globalStyles.footerButton, { flex: 1 }]}
                                            onPress={handleAmountRemoveItem}
                                        >
                                            <Text style={globalStyles.footerButtonText}>Remover</Text>
                                        </TouchableHighlight>
                                    </View>
                                }

                                {
                                    orderItem.amount > 0 && <View style={{ marginTop: 5, flexDirection: 'row' }}>
                                        <TouchableHighlight
                                            underlayColor={colorPrimaryDark}
                                            style={[globalStyles.footerButton, { flex: 1 }]}
                                            onPress={() => setModalEdit(false)}
                                        >
                                            <Text style={globalStyles.footerButtonText}>Pronto</Text>
                                        </TouchableHighlight>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

const styles = StyleSheet.create(
    {
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
            color: colorPrimaryLight,
            textAlign: 'center',
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

        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },

        modalView: {
            flexDirection: 'row',
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        },

        footerContainerAmount: {
            flex: 1,
            borderColor: '#d9d9d9',
            borderWidth: 1,
            borderRadius: 5
        },

        footerContainerAmountRow: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
        },

        iconButtons: {
            fontFamily: 'Nunito_300Light',
            fontSize: 22,
            color: '#8c8c8c',
            textAlign: 'center'
        },
    }
)