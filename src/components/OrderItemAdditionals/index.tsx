import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface OrderItemAdditional {
    id: number;
    amount: number;
    name: string;
    value: number;
    additional_id: number;
}

interface OrderItemAdditionalProps {
    orderItemAdditional: OrderItemAdditional;
}

export default function OrderItemAdditionals({ orderItemAdditional }: OrderItemAdditionalProps) {
    return (
        <View key={orderItemAdditional.id} style={styles.additionalRow}>
            <View style={styles.additionalColumnAmount}>
                <Text style={styles.additionalTextAmount}>{Number(orderItemAdditional.amount).toFixed(0)}</Text>
            </View>

            <View style={styles.additionalColumnName}>
                <Text style={styles.additionalTexts}>{orderItemAdditional.name}</Text>
            </View>

            <View style={styles.additionalColumnValue}>
                <Text style={styles.additionalTexts}>{`R$ ${Number(orderItemAdditional.value).toFixed(2).replace('.', ',')}`}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create(
    {
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