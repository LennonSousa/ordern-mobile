import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView } from 'react-native';
import { BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../../services/api';

import { CustomerContext } from '../../../context/customerContext';
import { CustomerPayment } from '../../../components/CustomerPayments';
import Input from '../../../components/Interfaces/Inputs';
import InvalidFeedback from '../../../components/Interfaces/InvalidFeedback';

export default function PaymentsCustomer() {
    const { customer, handleCustomer } = useContext(CustomerContext);

    // Customer address
    const [selectedCustomerPayment, setSelectedCustomerPayment] = useState<CustomerPayment | null>();

    const [containerNewPayment, setContainerNewPayment] = useState(false);
    const [buttonDeletePayment, setButtonDeletePayment] = useState(true);

    const validatiionSchema = Yup.object().shape({
        card_number: Yup.string().required('Obrigatório!').max(16, 'Deve conter no máximo 16 caracteres!'),
        valid: Yup.string().required('Obigatório!'),
        name: Yup.string().required('Obigatório!'),
        cpf: Yup.string().required('Obigatório!')
    });

    function handleAddressCustomer(id: number) {
        if (customer) {
            customer.payment.forEach(payment => {
                if (payment.id === id) {
                    setSelectedCustomerPayment(payment);

                    setButtonDeletePayment(true);

                    setContainerNewPayment(true);
                }
            })
        }
    }

    async function handleDeleteAddress(id: number) {
        try {
            if (customer) {
                await api.delete(`customer/payments/${id}`);

                const res = await api.get(`customer/${customer.id}`);

                handleCustomer(res.data);

                setContainerNewPayment(false);
                setSelectedCustomerPayment(null);
                setButtonDeletePayment(true);
            }
        }
        catch {

        }
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.containerMenu}>
                <View style={styles.fieldsRow}>
                    <View style={styles.fieldsColumn}>
                        <View style={styles.menuRow}>
                            <View style={styles.menuColumn}>
                                <Text>Formas de pagamento</Text>
                            </View>
                            <View style={styles.menuIconColumn}>
                                <TouchableHighlight
                                    style={styles.buttonNewItem}
                                    underlayColor="#e8e8e8"
                                    onPress={() => {
                                        setSelectedCustomerPayment(null);
                                        setButtonDeletePayment(true);
                                        setContainerNewPayment(!containerNewPayment);
                                    }}
                                >
                                    <View>
                                        <Feather name={containerNewPayment ? "x" : "plus"} size={24} color="#cc0000" />
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={styles.menuDescriptionRow}>
                            <View style={styles.menuDescriptionColumn}>
                                <Text style={styles.textsDescriptionMenu}>Seus cartões para pagamento.</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {
                    containerNewPayment && <Formik
                        initialValues={{
                            card_number: selectedCustomerPayment ? selectedCustomerPayment.card_number : '',
                            valid: selectedCustomerPayment ? selectedCustomerPayment.valid : '',
                            name: selectedCustomerPayment ? selectedCustomerPayment.name : '',
                            cpf: selectedCustomerPayment ? selectedCustomerPayment.cpf : ''
                        }}
                        onSubmit={async values => {
                            if (customer) {
                                try {
                                    if (selectedCustomerPayment) {
                                        await api.put(`customer/payments/${selectedCustomerPayment.id}`, {
                                            "card_number": values.card_number,
                                            "valid": values.valid,
                                            "name": values.name,
                                            "cpf": values.cpf,
                                            "client": customer.id
                                        });
                                    }
                                    else {
                                        await api.post('customer/payments', {
                                            "card_number": values.card_number,
                                            "valid": values.valid,
                                            "name": values.name,
                                            "cpf": values.cpf,
                                            "client": customer.id
                                        });
                                    }

                                    const res = await api.get(`customer/${customer.id}`);

                                    handleCustomer(res.data);

                                    setContainerNewPayment(false);
                                    setSelectedCustomerPayment(null);
                                }
                                catch {

                                }
                            }
                        }}
                        validationSchema={validatiionSchema}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                            <View style={styles.containerItem}>
                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <View style={styles.menuRow}>
                                            <View style={styles.menuColumn}>
                                                <Text>Criar um método de pagamento</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Número do cartão'
                                            placeholder='Somente números'
                                            textContentType='creditCardNumber'
                                            keyboardType='numeric'
                                            onBlur={handleBlur('card_number')}
                                            onChangeText={e => {setFieldValue('card_number', e)}}
                                            value={values.card_number}
                                        />
                                        <InvalidFeedback message={errors.card_number}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Validade'
                                            keyboardType='numeric'
                                            onChangeText={handleChange('valid')}
                                            onBlur={handleBlur('valid')}
                                            value={values.valid}
                                        />
                                        <InvalidFeedback message={errors.valid}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Nome'
                                            textContentType='name'
                                            keyboardType='default'
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur('name')}
                                            value={values.name}
                                        />
                                        <InvalidFeedback message={errors.name}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='CPF'
                                            keyboardType='numeric'
                                            onChangeText={handleChange('cpf')}
                                            onBlur={handleBlur('cpf')}
                                            value={values.cpf}
                                        />
                                        <InvalidFeedback message={errors.cpf}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ width: '30%' }}>
                                                <TouchableOpacity style={styles.buttonAction} onPress={handleSubmit as any}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Feather name="check" size={24} color="#ffffff" />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ width: '30%' }}>
                                                {
                                                    selectedCustomerPayment && buttonDeletePayment ? <TouchableOpacity style={styles.buttonAction} onPress={() => { setButtonDeletePayment(false) }}>
                                                        <View style={{ alignItems: 'center' }}>
                                                            <Feather name="trash-2" size={24} color="#ffffff" />
                                                        </View>
                                                    </TouchableOpacity> :
                                                        selectedCustomerPayment && <TouchableOpacity
                                                            style={styles.buttonConfirm}
                                                            onPress={() => { selectedCustomerPayment && handleDeleteAddress(selectedCustomerPayment.id) }}
                                                        >
                                                            <View style={{ alignItems: 'center' }}>
                                                                <Feather name="info" size={24} color="#ffffff" />
                                                            </View>
                                                        </TouchableOpacity>
                                                }
                                            </View>

                                            <View style={{ width: '30%' }}>
                                                <TouchableOpacity style={styles.buttonAction} onPress={() => {
                                                    setContainerNewPayment(false);
                                                    setSelectedCustomerPayment(null);
                                                }}
                                                >
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Feather name="x" size={24} color="#ffffff" />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    </Formik>
                }

                {
                    customer && customer.payment && customer.payment.map((payment, index) => {
                        return <View key={index} style={styles.containerItem}>
                            <View style={styles.fieldsRow}>
                                <View style={styles.fieldsColumn}>
                                    <View style={styles.menuRow}>
                                        <View style={styles.colTitleButtonItem}>
                                            <BorderlessButton onPress={() => { handleAddressCustomer(payment.id) }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={styles.colTitleButtonItem}>
                                                        <Text style={{ color: '#8c8c8c' }}>{`${payment.card_number} - ${payment.valid}`}</Text>
                                                    </View>
                                                    <View style={styles.colIconButtonItem}>
                                                        <Feather name="chevron-right" size={24} color="#cc0000" />
                                                    </View>
                                                </View>
                                            </BorderlessButton>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </View>
                    })
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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

    menuIconColumn: {
        flex: 0.2,
        alignItems: 'flex-end',
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

    colTitleButtonItem: {
        flex: 0.9,
    },

    colIconButtonItem: {
        flex: 0.1,
    },

    containerItem: {
        marginVertical: 5,
        padding: 10,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 8
    },

    buttonTypeAddressCustomer: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#e8e8e8',
        alignItems: 'center',
    },

    buttonAction: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#cc0000',
        alignItems: 'center',
    },

    buttonConfirm: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ffcc00',
        alignItems: 'center',
    },

    fieldsLogIn: {
        marginVertical: 8,
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