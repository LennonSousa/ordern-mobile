import React, { useContext } from 'react';
import { View, Text, TouchableHighlight, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { ContextOrdering } from '../../context/orderingContext';
import OrderItems from '../../components/OrderItems';
import PageFooter from '../../components/PageFooter';

import globalStyles, { colorPrimaryLight, colorPrimaryDark } from '../../assets/styles/global';

export default function OrderPreview() {
    const navigation = useNavigation();

    const { order } = useContext(ContextOrdering);

    return (
        <>
            {
                order && <ScrollView style={globalStyles.container}>
                    <View style={globalStyles.fieldsRow}>
                        <View style={globalStyles.fieldsColumn}>
                            <View style={globalStyles.menuRow}>
                                <View style={globalStyles.menuColumn}>
                                    <Text style={globalStyles.subTitlePrimary}>Revise o seu pedido</Text>
                                </View>
                                <View style={globalStyles.menuIconColumn}>
                                    <Feather name="file-text" size={24} color={colorPrimaryLight} />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={globalStyles.textsMenu}>Itens</Text>
                        {
                            order.orderItems.map(item => {
                                return <OrderItems key={item.id} orderItem={item} />
                            })
                        }
                    </View>

                    <View style={globalStyles.fieldsRow}>
                        <View style={globalStyles.fieldsColumn}>
                            <View style={globalStyles.menuRow}>
                                <View style={globalStyles.menuColumn}>
                                    <Text style={globalStyles.textsMenu}>Sub total</Text>
                                </View>
                                <View style={globalStyles.menuIconColumn}>
                                    <Feather name="tag" size={24} color={colorPrimaryLight} />
                                </View>
                            </View>
                            <View style={globalStyles.menuDescriptionRow}>
                                <View style={globalStyles.menuDescriptionColumn}>
                                    <Text style={globalStyles.textsDescriptionMenu}>{`R$ ${Number(order.sub_total).toFixed(2).replace('.', ',')}`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={globalStyles.fieldsRow}>
                        <View style={globalStyles.fieldsColumn}>
                            <View style={globalStyles.menuRow}>
                                <View style={globalStyles.menuColumn}>
                                    <Text style={globalStyles.textsMenu}>Entrega</Text>
                                </View>
                                <View style={globalStyles.menuIconColumn}>
                                    <Feather name="map" size={24} color={colorPrimaryLight} />
                                </View>
                            </View>
                            <View style={globalStyles.menuDescriptionRow}>
                                <View style={globalStyles.menuDescriptionColumn}>
                                    <Text style={globalStyles.textsDescriptionMenu}>{order.address}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={globalStyles.fieldsRow}>
                        <View style={globalStyles.fieldsColumn}>
                            <View style={globalStyles.menuRow}>
                                <View style={globalStyles.menuColumn}>
                                    <Text style={globalStyles.textsMenu}>Taxa de entrega</Text>
                                </View>
                                <View style={globalStyles.menuIconColumn}>
                                    <Feather name="truck" size={24} color={colorPrimaryLight} />
                                </View>
                            </View>
                            <View style={globalStyles.menuDescriptionRow}>
                                <View style={globalStyles.menuDescriptionColumn}>
                                    <Text
                                        style={globalStyles.textsDescriptionMenu}>
                                        {`R$ ${Number(order.delivery_tax).toFixed(2).replace('.', ',')} (${order.delivery_type})`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={globalStyles.fieldsRow}>
                        <View style={globalStyles.fieldsColumn}>
                            <View style={globalStyles.menuRow}>
                                <View style={globalStyles.menuColumn}>
                                    <Text style={globalStyles.textsMenu}>Tempo estimado</Text>
                                </View>
                                <View style={globalStyles.menuIconColumn}>
                                    <Feather name="watch" size={24} color={colorPrimaryLight} />
                                </View>
                            </View>
                            <View style={globalStyles.menuDescriptionColumn}>
                                <Text
                                    style={globalStyles.textsDescriptionMenu}>
                                    30 minutos
                                    </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
                            onPress={() => { navigation.navigate('Payment') }}
                        >
                            <Text style={globalStyles.footerButtonText}>Avançar</Text>
                        </TouchableHighlight>
                    </View>
                </PageFooter>
            }
        </>
    )
}