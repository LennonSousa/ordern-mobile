import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';

import { CustomerContext } from '../../context/customerContext';
import Header from '../../components/PageHeader';
import { Order } from '../../components/Orders';
import OrderDetailsShimmer from '../../components/Shimmers/OrderDetails';
import OrderItems, { OrderItem } from '../../components/OrderItems';
import Input from '../../components/Interfaces/Inputs';
import InvalidFeedback from '../../components/Interfaces/InvalidFeedback';

import globalStyles, { colorPrimaryLight, colorHighLight } from '../../assets/styles/global';

interface OrderDetailsRouteParams {
    id: number;
}

export default function OrderDetails() {
    const route = useRoute();
    const navigation = useNavigation();
    const { customer } = useContext(CustomerContext);

    const params = route.params as OrderDetailsRouteParams;

    const [selectedOrder, setSelectedOrder] = useState<Order>();

    const [refreshing, setRefreshing] = React.useState(false);

    const validatiionSchema = Yup.object().shape({
        reasonCancellation: Yup.string().required('Obrigatório!')
    });

    useEffect(() => {
        if (params.id) {
            api.get(`orders/${params.id}`).then(res => {
                let order: Order = res.data;

                let orderItems: OrderItem[] = order.orderItems.filter(item => {
                    return !item.additional;
                });

                order = {
                    ...order, orderItems: orderItems.map(orderItem => {
                        return {
                            ...orderItem, additionals: order.orderItems.filter(item => {
                                return item.additional && item.additional_item === orderItem.additional_item
                            })
                        }
                    })
                }

                setSelectedOrder(order);
            })
                .catch(() => {

                });

            setRefreshing(false);
        }
    }, [params.id, refreshing]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setSelectedOrder(undefined);
    }, []);

    return (
        <>
            <Header title="Pedido" customGoBack={'OrdersList'} />
            {
                selectedOrder ? <ScrollView
                    style={globalStyles.container}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {
                        selectedOrder &&
                        <View style={{ marginBottom: 20 }}>
                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.menuColumn}>
                                            <Text style={
                                                [globalStyles.titlePrimaryLight,
                                                {
                                                    color: selectedOrder.orderStatus.order === 4 ? colorHighLight : colorPrimaryLight
                                                }]
                                            }>{selectedOrder.orderStatus.title}</Text>
                                        </View>
                                        <View style={globalStyles.menuIconColumn}>
                                            <Feather name="file-text" size={24} color={colorPrimaryLight} />
                                        </View>
                                    </View>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.menuColumn}>
                                            <Text style={globalStyles.textDescription}>{selectedOrder.orderStatus.description}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View>
                                <Text style={globalStyles.textsMenu}>Itens</Text>
                                {
                                    selectedOrder.orderItems.map(item => {
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
                                            <Text style={globalStyles.textsDescriptionMenu}>{`R$ ${Number(selectedOrder.sub_total).toFixed(2).replace('.', ',')}`}</Text>
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
                                            <Text style={globalStyles.textsDescriptionMenu}>{selectedOrder.address}</Text>
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
                                                {`R$ ${Number(selectedOrder.delivery_tax).toFixed(2).replace('.', ',')} (${selectedOrder.delivery_type})`}
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

                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.menuColumn}>
                                            <Text style={globalStyles.textsMenu}>Pagamento</Text>
                                        </View>
                                        <View style={globalStyles.menuIconColumn}>
                                            <Feather name="credit-card" size={24} color={colorPrimaryLight} />
                                        </View>
                                    </View>
                                    <View style={globalStyles.menuDescriptionColumn}>
                                        <Text style={globalStyles.textsDescriptionMenu}>
                                            {selectedOrder.payment}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }

                    {
                        customer && selectedOrder.orderStatus.order !== 4 && <Formik
                            initialValues={{
                                reasonCancellation: selectedOrder.reason_cancellation
                            }}
                            onSubmit={async values => {
                                try {
                                    await api.post('clients', {
                                    });

                                    navigation.navigate('Profile');
                                }
                                catch {

                                }

                            }}
                            validationSchema={validatiionSchema}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                                <View>
                                    <View style={globalStyles.fieldsRow}>
                                        <View style={globalStyles.fieldsColumn}>
                                            <Input
                                                style={globalStyles.fieldsLogIn}
                                                title='Motivo do cancelamento*'
                                                placeholder='Obrigatório'
                                                autoCapitalize='sentences'
                                                onChangeText={handleChange('reasonCancellation')}
                                                onBlur={handleBlur('reasonCancellation')}
                                                value={values.reasonCancellation}
                                            />
                                            <InvalidFeedback message={errors.reasonCancellation}></InvalidFeedback>
                                        </View>
                                    </View>
                                    {
                                        selectedOrder.orderStatus.order !== 5 && <View>
                                            <TouchableHighlight underlayColor='#cc0000' style={globalStyles.buttonLogIn} onPress={handleSubmit as any}>
                                                <Text style={globalStyles.footerButtonText}>Cancelar o pedido</Text>
                                            </TouchableHighlight>
                                        </View>
                                    }
                                </View>
                            )}
                        </Formik>
                    }
                </ScrollView> :
                    <OrderDetailsShimmer />
            }
        </>
    )
}

const styles = StyleSheet.create({
    modalView: {
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
    }
});