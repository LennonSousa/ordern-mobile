import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';

import { CustomerContext } from '../../context/customerContext';
import { OrderStatus } from '../../components/OrderStatus';
import { Order } from '../../components/Orders';
import OrderItems from '../../components/OrderItems';
import Input from '../../components/Interfaces/Inputs';
import InvalidFeedback from '../../components/Interfaces/InvalidFeedback';

import globalStyles, { colorPrimaryLight } from '../../assets/styles/global';

interface OrderDetailsRouteParams {
    id: number;
}

export default function OrderDetails() {
    const route = useRoute();
    const navigation = useNavigation();
    const { customer } = useContext(CustomerContext);

    const params = route.params as OrderDetailsRouteParams;

    const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order>();

    const validatiionSchema = Yup.object().shape({
        reasonCancellation: Yup.string().required('Obrigatório!')
    });

    useEffect(() => {
        if (params.id) {
            api.get('order-status').then(res => {
                setOrderStatus(res.data);
            })
                .catch(() => {

                });

            api.get(`orders/${params.id}`).then(res => {
                setSelectedOrder(res.data);
            })
                .catch(() => {

                });
        }
    }, [params.id]);

    return (
        <ScrollView style={globalStyles.container}>
            {
                selectedOrder && <><View style={globalStyles.fieldsRow}>
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
                </>
            }

            <View style={styles.container}>
                {
                    customer && <Formik
                        initialValues={{
                            reasonCancellation: ''
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
                            <ScrollView style={styles.containerMenu}>
                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <View style={styles.menuRow}>
                                            <View style={styles.menuColumn}>
                                                <Text>Informações pessoais</Text>
                                            </View>
                                            <View style={styles.menuIconColumn}>
                                                <Feather name="smile" size={24} color={colorPrimaryLight} />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
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
                                <View>
                                    <TouchableHighlight underlayColor='#cc0000' style={styles.buttonLogIn} onPress={handleSubmit as any}>
                                        <Text style={styles.footerButtonText}>Cancelar</Text>
                                    </TouchableHighlight>
                                </View>
                            </ScrollView>
                        )}
                    </Formik>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    divider: {
        borderTopColor: '#e6e6e6',
        borderTopWidth: 1,
        marginHorizontal: 15,
        marginVertical: 15
    },

    containerLogIn: {
        paddingHorizontal: 15,
    },

    containerMenu: {
        paddingHorizontal: 15,
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
        fontSize: 16,
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

    fieldsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },

    fieldsColumn: {
        flex: 1,
    },

    buttonNewItem: {
        padding: 10,
        borderRadius: 5,
    },

    containerItem: {
        marginVertical: 5,
        padding: 10,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 8
    },

    colTitleButtonItem: {
        flex: 0.9,
    },

    colIconButtonItem: {
        flex: 0.1,
    },

    fieldsLogIn: {
        marginVertical: 8,
    },

    buttonLogIn: {
        backgroundColor: '#fe3807',
        borderRadius: 5,
        marginVertical: 15,
        height: 50,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        padding: 20,
    },

    buttonTextLogIn: {
        color: '#ffffff',
        alignSelf: 'center',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
    },

    buttonTextSignIn: {
        color: '#fe3807',
        alignSelf: 'center',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
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
});