import React, { useContext, useState, useRef, LegacyRef } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import creditCardType, {
    getTypeInfo,
    types as CardType,
} from "credit-card-type";

import api from '../../../services/api';

import { AuthContext } from '../../../context/authContext';
import { CustomerPayment } from '../../../components/CustomerPayments';
import Input from '../../../components/Interfaces/Inputs';
import InvalidFeedback from '../../../components/Interfaces/InvalidFeedback';
import WaitingModal, { statusModal } from '../../../components/Interfaces/WaitingModal';
import ButtonListItem from '../../../components/Interfaces/ButtonListItem';
import Button from '../../../components/Interfaces/Button';

import globalStyles from '../../../assets/styles/global';

const validatiionSchema = Yup.object().shape({
    card_number: Yup.string().required('Obrigatório!').max(16, 'Deve conter no máximo 16 caracteres!'),
    exp_month: Yup.string().required('Obigatório!').min(2, 'Mês inválido!'),
    exp_year: Yup.string().required('Obrigatório!').min(4, 'Ano inválido!'),
    name: Yup.string().required('Obigatório!'),
    cpf: Yup.string().required('Obigatório!')
});

export default function PaymentsCustomer() {
    const { customer, handleCustomer } = useContext(AuthContext);

    // Customer payments
    const [selectedCustomerPayment, setSelectedCustomerPayment] = useState<CustomerPayment | null>();

    const [containerNewPayment, setContainerNewPayment] = useState(false);
    const [buttonDeletePayment, setButtonDeletePayment] = useState(true);

    const expMonthtRef: LegacyRef<TextInput> = useRef<TextInput>(null);
    const expYearRef: LegacyRef<TextInput> = useRef<TextInput>(null);
    const nameRef: LegacyRef<TextInput> = useRef<TextInput>(null);
    const cpfRef: LegacyRef<TextInput> = useRef<TextInput>(null);

    const [fieldsFormTouched, setFieldsFormTouched] = useState(false);

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    function handleCustomerPayment(id: number) {
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

    async function handleDeletePayment(id: number) {
        try {
            if (customer) {
                setModalWaiting("waiting");

                await api.delete(`customer/payments/${id}`);

                const res = await api.get(`customer/${customer.id}`);

                handleCustomer(res.data);

                setContainerNewPayment(false);
                setSelectedCustomerPayment(null);
                setButtonDeletePayment(true);

                setModalWaiting("hidden");
            }
        }
        catch {
            setModalWaiting("error");
            setErrorMessage("Algo deu errado com a sua solicitação.");
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
                            card_number: selectedCustomerPayment ? `************${selectedCustomerPayment.card_number}` : '',
                            brand: selectedCustomerPayment ? selectedCustomerPayment.brand : '',
                            exp_month: selectedCustomerPayment ? selectedCustomerPayment.exp_month : '',
                            exp_year: selectedCustomerPayment ? selectedCustomerPayment.exp_year : '',
                            name: selectedCustomerPayment ? selectedCustomerPayment.name : '',
                            cpf: selectedCustomerPayment ? selectedCustomerPayment.cpf : ''
                        }}
                        onSubmit={async values => {
                            if (customer) {
                                try {
                                    setModalWaiting("waiting");

                                    if (selectedCustomerPayment) {
                                        await api.put(`customer/payments/${selectedCustomerPayment.id}`, {
                                            card_number: values.card_number,
                                            brand: values.brand,
                                            exp_month: values.exp_month,
                                            exp_year: values.exp_year,
                                            name: values.name,
                                            cpf: values.cpf,
                                            customer: customer.id
                                        });
                                    }
                                    else {
                                        await api.post('customer/payments', {
                                            card_number: values.card_number,
                                            brand: values.brand,
                                            exp_month: values.exp_month,
                                            exp_year: values.exp_year,
                                            name: values.name,
                                            cpf: values.cpf,
                                            customer: customer.id
                                        });
                                    }

                                    const res = await api.get(`customer/${customer.id}`);

                                    handleCustomer(res.data);

                                    setContainerNewPayment(false);
                                    setSelectedCustomerPayment(null);
                                    setFieldsFormTouched(false);

                                    setModalWaiting("hidden");
                                }
                                catch {
                                    setModalWaiting("error");
                                    setErrorMessage("Algo deu errado com a sua solicitação.");
                                }
                            }
                        }}
                        validationSchema={validatiionSchema}
                    >
                        {({ handleBlur, handleSubmit, values, errors, setFieldValue, isValid, touched }) => (
                            <View style={globalStyles.containerItem}>
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
                                    <View style={{ flex: 1 }}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Número do cartão'
                                            placeholder='Somente números'
                                            textContentType='creditCardNumber'
                                            keyboardType='numeric'
                                            onBlur={() => {
                                                handleBlur('card_number');
                                                setFieldValue('brand', values.card_number.length >= 15 ? creditCardType(values.card_number).length !== 0 ? (creditCardType(values.card_number)[0].niceType) : '' : '');
                                            }}
                                            onChangeText={e => {
                                                setFieldValue('card_number', e, false);
                                                setFieldValue('brand', values.card_number.length >= 15 ? creditCardType(values.card_number).length !== 0 ? (creditCardType(values.card_number)[0].niceType) : '' : '');
                                                setFieldsFormTouched(true);
                                            }}
                                            value={values.card_number}
                                            returnKeyType='next'
                                            onSubmitEditing={() => expMonthtRef?.current?.focus()}
                                            blurOnSubmit={false}
                                        />
                                        <View style={styles.fieldsRow}>
                                            <View style={{ flex: 0.5 }}>
                                                <InvalidFeedback message={touched.card_number ? errors.card_number : ''}></InvalidFeedback>
                                            </View>
                                            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                                                <InvalidFeedback message={values.brand}></InvalidFeedback>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={{ flex: 0.3 }}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Mês'
                                            placeholder='xx'
                                            keyboardType='numeric'
                                            maxLength={2}
                                            onChangeText={(e) => { setFieldValue('exp_month', e, false); setFieldsFormTouched(true); }}
                                            onBlur={handleBlur('exp_month')}
                                            value={values.exp_month}
                                            returnKeyType='next'
                                            onSubmitEditing={() => expYearRef?.current?.focus()}
                                            blurOnSubmit={false}
                                            ref={expMonthtRef}
                                        />
                                        <InvalidFeedback message={touched.exp_month ? errors.exp_month : ''}></InvalidFeedback>
                                    </View>
                                    <View style={{ flex: 0.3, marginHorizontal: 10 }}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Ano'
                                            placeholder='xxxx'
                                            keyboardType='numeric'
                                            maxLength={4}
                                            onChangeText={(e) => { setFieldValue('exp_year', e, false); setFieldsFormTouched(true); }}
                                            onBlur={handleBlur('exp_year')}
                                            value={values.exp_year}
                                            returnKeyType='next'
                                            onSubmitEditing={() => nameRef?.current?.focus()}
                                            blurOnSubmit={false}
                                            ref={expYearRef}
                                        />
                                        <InvalidFeedback message={touched.exp_year ? errors.exp_year : ''}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Nome'
                                            textContentType='name'
                                            keyboardType='default'
                                            onChangeText={(e) => { setFieldValue('name', e, false); setFieldsFormTouched(true); }}
                                            onBlur={handleBlur('name')}
                                            value={values.name}
                                            returnKeyType='next'
                                            onSubmitEditing={() => cpfRef?.current?.focus()}
                                            blurOnSubmit={false}
                                            ref={nameRef}
                                        />
                                        {touched.name && <InvalidFeedback message={errors.name}></InvalidFeedback>}
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='CPF'
                                            keyboardType='numeric'
                                            onChangeText={(e) => { setFieldValue('cpf', e, false); setFieldsFormTouched(true); }}
                                            onBlur={handleBlur('cpf')}
                                            value={values.cpf}
                                            returnKeyType='go'
                                            onSubmitEditing={handleSubmit as any}
                                            ref={cpfRef}
                                        />
                                        {touched.cpf && <InvalidFeedback message={errors.cpf}></InvalidFeedback>}
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ width: '30%' }}>
                                                <Button disabled={fieldsFormTouched && isValid ? false : true} onPress={handleSubmit as any} >
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Feather name="check" size={24} color="#ffffff" />
                                                    </View>
                                                </Button>
                                            </View>

                                            <View style={{ width: '30%' }}>
                                                {
                                                    selectedCustomerPayment && buttonDeletePayment ? <Button onPress={() => { setButtonDeletePayment(false) }} >
                                                        <View style={{ alignItems: 'center' }}>
                                                            <Feather name="trash-2" size={24} color="#ffffff" />
                                                        </View>
                                                    </Button> : selectedCustomerPayment && <Button
                                                        style={globalStyles.buttonConfirm}
                                                        onPress={() => { selectedCustomerPayment && handleDeletePayment(selectedCustomerPayment.id) }}
                                                    >
                                                        <View style={{ alignItems: 'center' }}>
                                                            <Feather name="info" size={24} color="#ffffff" />
                                                        </View>
                                                    </Button>
                                                }
                                            </View>

                                            <View style={{ width: '30%' }}>
                                                <Button onPress={() => {
                                                    setContainerNewPayment(false);
                                                    setSelectedCustomerPayment(null);
                                                }} >
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Feather name="x" size={24} color="#ffffff" />
                                                    </View>
                                                </Button>
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
                        return <ButtonListItem key={index} onPress={() => { handleCustomerPayment(payment.id) }}>
                            <View style={globalStyles.row}>
                                <View style={globalStyles.colTitleButtonItem}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={globalStyles.colTitleButtonItem}>
                                            <Text style={{ color: '#8c8c8c' }}>{`****${payment.card_number.slice(payment.card_number.length - 4)} - ${payment.brand}`}</Text>
                                        </View>
                                        <View style={globalStyles.colIconButtonItem}>
                                            <Feather name="chevron-right" size={24} color="#cc0000" />
                                        </View>
                                    </View>
                                </View>

                            </View>
                        </ButtonListItem>
                    })
                }
            </ScrollView>

            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <WaitingModal message={errorMessage} status={modalWaiting} />
            </View>
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