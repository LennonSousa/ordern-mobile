import React from 'react';
import { Text, View } from 'react-native';

export interface OrderItem {
    id: number;
    amount: number;
    name: string;
    value: number;
    additional: boolean;
    additional_item: number;
    additionals: OrderItem[];
}

interface OrderItemProps {
    orderItem: OrderItem;
}

export default function OrderItems({ orderItem }: OrderItemProps) {
    return (
        <View style={{ marginVertical: 5, marginHorizontal: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 0.2 }}>{orderItem.amount}</Text>
                <Text style={{ flex: 0.5 }}>{orderItem.name}</Text>
                <Text style={{ flex: 0.3 }}>{orderItem.value}</Text>
            </View>
            <View style={{ marginHorizontal: 15 }}>
                {
                    orderItem.additionals.map(additional => {
                        return <View key={additional.id} style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 0.2 }}>{additional.amount}</Text>
                            <Text style={{ flex: 0.5 }}>{additional.name}</Text>
                            <Text style={{ flex: 0.3 }}>{additional.value}</Text>
                        </View>
                    })
                }
            </View>
        </View>
    )
}