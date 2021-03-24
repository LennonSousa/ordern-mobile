import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, TouchableHighlight, ScrollView, RefreshControl } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import br from 'date-fns/locale/pt-BR';

import api from '../../services/api';

import { CustomerContext } from '../../context/customerContext';
import { OrdersContext } from '../../context/ordersContext';
import { Order } from '../../components/Orders';
import OrderDetailsShimmer from '../../components/Shimmers/OrderDetails';
import OrderItems from '../../components/OrderItems';
import Input from '../../components/Interfaces/Inputs';
import InvalidFeedback from '../../components/Interfaces/InvalidFeedback';
import WaitingModal, { statusModal } from '../../components/Interfaces/WaitingModal';

import globalStyles, { colorPrimaryLight, colorSecundaryDark, colorHighLight, colorTextMenuDescription } from '../../assets/styles/global';
import { OrderStatus } from '../../components/OrderStatus';

interface OrderDetailsRouteParams {
    id: number;
}

export default function OrderDetails() {
    const route = useRoute();
    const { customer } = useContext(CustomerContext);
    const { orders, handleOrders } = useContext(OrdersContext);

    const params = route.params as OrderDetailsRouteParams;

    const [selectedOrder, setSelectedOrder] = useState<Order>();

    const [refreshing, setRefreshing] = React.useState(true);

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    const validatiionSchema = Yup.object().shape({
        reasonCancellation: Yup.string().required('Obrigatório!')
    });

    useEffect(() => {
        if (customer && orders && params.id) {
            orders.map(order => {
                if (order.id === params.id) {
                    setSelectedOrder(order);
                }
            });

            setRefreshing(false);
        }
        else
            setRefreshing(false);

    }, [customer, orders, params.id]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        if (customer) {
            api.get(`customer/orders/${customer.id}`).then(res => {

                const ordersList: Order[] = res.data;

                ordersList.map(order => {
                    if (order.id === params.id) {
                        setSelectedOrder(order);
                    }
                });

                handleOrders(res.data);
                setRefreshing(false);
            })
                .catch(() => {
                    setRefreshing(false);
                });
        }
    }, []);

    return (
        <>
            {
                !refreshing ? <ScrollView
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
                                            <Text style={globalStyles.textsMenu}>Número do pedido</Text>
                                        </View>
                                    </View>
                                    <View style={globalStyles.menuDescriptionRow}>
                                        <View style={globalStyles.menuDescriptionColumn}>
                                            <Text style={globalStyles.textsDescriptionMenu}>{selectedOrder.tracker}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.menuColumn}>
                                            <Text style={globalStyles.textsMenu}>Pedido em:</Text>
                                        </View>
                                    </View>
                                    <View style={globalStyles.menuDescriptionRow}>
                                        <View style={globalStyles.menuDescriptionColumn}>
                                            <Text style={globalStyles.textsDescriptionMenu}>{format(new Date(selectedOrder.ordered_at), 'PPPpp', { locale: br })}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

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

                            <View style={globalStyles.fieldsRow}>
                                <View style={{ flex: 1 }}>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Feather
                                                style={{ textAlign: 'center' }}
                                                name="loader"
                                                size={20}
                                                color={
                                                    selectedOrder.orderStatus.order > 0 && selectedOrder.orderStatus.order !== 6 ? colorPrimaryLight : colorSecundaryDark
                                                }
                                            />
                                        </View>
                                    </View>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Text style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 12 }]}>Aceitar</Text>
                                        </View>
                                    </View>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Text style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 10 }]}> </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Feather
                                                style={{ textAlign: 'center' }}
                                                name="minus" size={20}
                                                color={
                                                    selectedOrder.orderStatus.order >= 1 && selectedOrder.orderStatus.order !== 6 ? colorPrimaryLight : colorSecundaryDark
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Feather
                                                style={{ textAlign: 'center' }}
                                                name="clock"
                                                size={20}
                                                color={
                                                    selectedOrder.orderStatus.order >= 1 && selectedOrder.orderStatus.order !== 6 ? colorPrimaryLight : colorSecundaryDark
                                                }
                                            />
                                        </View>
                                    </View>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Text style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 12 }]}>Preparo</Text>
                                        </View>
                                    </View>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Text style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 10 }]}> </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Feather
                                                style={{ textAlign: 'center' }}
                                                name="minus"
                                                size={20}
                                                color={
                                                    selectedOrder.orderStatus.order >= 2 && selectedOrder.orderStatus.order !== 6 ? colorPrimaryLight : colorSecundaryDark
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Feather
                                                style={{ textAlign: 'center' }}
                                                name="truck"
                                                size={20}
                                                color={
                                                    selectedOrder.orderStatus.order >= 2 && selectedOrder.orderStatus.order !== 6 ? colorPrimaryLight : colorSecundaryDark
                                                }
                                            />
                                        </View>
                                    </View>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Text style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 12 }]}>
                                                {
                                                    selectedOrder.delivery_type === 'pickup' ? "Retirar" : "Entrega"
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            {
                                                selectedOrder.orderStatus.order >= 1 ? selectedOrder.orderStatus.order !== 6 &&
                                                    <Text
                                                        style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 10 }]}>
                                                        {
                                                            format(new Date(selectedOrder.placed_at), 'HH:mm')
                                                        }
                                                    </Text> :
                                                    <Text style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 10 }]}> </Text>
                                            }
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Feather
                                                style={{ textAlign: 'center' }}
                                                name="minus" size={20}
                                                color={
                                                    selectedOrder.orderStatus.order === 4 ? colorPrimaryLight : colorSecundaryDark
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Feather
                                                style={{ textAlign: 'center' }}
                                                name="check-circle"
                                                size={20}
                                                color={
                                                    selectedOrder.orderStatus.order === 4 ? colorHighLight : colorSecundaryDark
                                                }
                                            />
                                        </View>
                                    </View>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Text style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 12 }]}>Entregue</Text>
                                        </View>
                                    </View>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            {
                                                selectedOrder.orderStatus.order === 4 ?
                                                    <Text
                                                        style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 10 }]}>
                                                        {
                                                            format(new Date(selectedOrder.delivered_at), 'HH:mm')
                                                        }
                                                    </Text> :
                                                    <Text style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 10 }]}> </Text>
                                            }
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
                                                style={
                                                    {
                                                        fontFamily: selectedOrder.delivery_tax <= 0 ? 'Nunito_600SemiBold' : 'Nunito_300Light',
                                                        fontSize: 14,
                                                        color: selectedOrder.delivery_tax <= 0 ? colorHighLight : colorTextMenuDescription
                                                    }
                                                }
                                            >
                                                {
                                                    selectedOrder.delivery_tax <= 0 ? "Grátis" :
                                                        `R$ ${Number(selectedOrder.delivery_tax).toFixed(2).replace('.', ',')} ${selectedOrder.delivery_type !== "pickup" ? `(${selectedOrder.delivery_type})` : ""}`
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.menuColumn}>
                                            <Text style={globalStyles.textsMenu}>Total</Text>
                                        </View>
                                        <View style={globalStyles.menuIconColumn}>
                                            <Feather name="dollar-sign" size={24} color={colorPrimaryLight} />
                                        </View>
                                    </View>
                                    <View style={globalStyles.menuDescriptionRow}>
                                        <View style={globalStyles.menuDescriptionColumn}>
                                            <Text
                                                style={globalStyles.textsDescriptionMenu}>
                                                {`R$ ${Number(selectedOrder.total).toFixed(2).replace('.', ',')}`}
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
                        customer && selectedOrder && selectedOrder.orderStatus.order !== 4 && <Formik
                            initialValues={{
                                reasonCancellation: selectedOrder.reason_cancellation
                            }}
                            onSubmit={async values => {
                                setModalWaiting("waiting");

                                try {
                                    const res = await api.get('order-status');

                                    const orderStatus: OrderStatus[] = res.data;

                                    const statusToSave = orderStatus.find(item => { return item.order === 5 });

                                    if (statusToSave) {
                                        await api.put(`orders/${selectedOrder.id}`,
                                            {
                                                client: selectedOrder.client,
                                                reason_cancellation: `${values.reasonCancellation} (Cancelado pelo cliente).`,
                                                orderStatus: statusToSave.id,
                                            });
                                    }

                                    setModalWaiting("hidden");

                                    setRefreshing(true);
                                }
                                catch {
                                    setModalWaiting("error");
                                    setErrorMessage("Desculpe, ocorreu um erro com a sua solicitação.");
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
                                                editable={selectedOrder.orderStatus.order !== 5 ? true : false}
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

                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <WaitingModal message={errorMessage} status={modalWaiting} />
                    </View>
                </ScrollView> :
                    <OrderDetailsShimmer />
            }
        </>
    )
}