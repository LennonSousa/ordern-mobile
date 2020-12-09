import React, { useContext } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { ContextOrdering } from '../../context/orderingContext';
import OrderItems from '../../components/OrderItems';

export default function Cart() {
    const { order } = useContext(ContextOrdering);

    return (
        <View>
            {
                order ? <ScrollView>
                    <View>
                        <Text>Entrega</Text>
                    </View>
                    <View>
                        {
                            order.orderItems.map(item => {
                                return <OrderItems key={item.id} orderItem={item} />
                            })
                        }
                    </View>
                </ScrollView> :
                    <Text>Sacola vaiza!</Text>
            }
        </View>
    )
}