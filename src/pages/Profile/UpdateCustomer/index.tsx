import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView, Platform, ActivityIndicator, Modal } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { parseISO, format, addHours } from 'date-fns';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../../services/api';

import { CustomerContext } from '../../../context/customerContext';
import Input from '../../../components/Interfaces/Inputs';
import InvalidFeedback from '../../../components/Interfaces/InvalidFeedback';
import WaitingModal, { statusModal } from '../../../components/Interfaces/WaitingModal';

import globalStyles, { colorPrimaryDark } from '../../../assets/styles/global';

export default function CustomerUpdate() {
    const navigation = useNavigation();
    const { customer, handleCustomer } = useContext(CustomerContext);

    const [show, setShow] = useState(false);

    const [birth, setBirth] = useState(new Date());

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (customer) {
            let customerBirth = parseISO(customer.birth.toString());

            customerBirth = addHours(customerBirth, 1);

            setBirth(customerBirth);
        }
    }, []);

    const validatiionSchema = Yup.object().shape({
        name: Yup.string().required('Você precisa preencher o seu nome!'),
        cpf: Yup.number().notRequired().positive('CPF inválido'),
        phone: Yup.string().notRequired()
    });

    return (
        <ScrollView style={globalStyles.container}>
            {
                customer && <Formik
                    initialValues={{
                        name: customer.name,
                        cpf: customer.cpf,
                        phone: customer.phone,
                        password: ''
                    }}
                    onSubmit={async values => {
                        setModalWaiting("waiting");

                        try {
                            await api.put(`customer/${customer.id}`, {
                                name: values.name,
                                cpf: values.cpf,
                                birth: birth,
                                phone: values.phone,
                                active: true,
                                paused: false,
                            });

                            const updatedCustomer = await api.get(`customer/${customer.id}`);

                            setModalWaiting("success");

                            handleCustomer(updatedCustomer.data);

                            setTimeout(() => {
                                setModalWaiting("hidden");
                            }, 1500);
                        }
                        catch (err) {
                            setModalWaiting("error");
                            setErrorMessage("Algo deu errado com a sua solicitação.");

                            console.log(err);
                        }

                    }}
                    validationSchema={validatiionSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <>
                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.menuColumn}>
                                            <Text>Informações pessoais</Text>
                                        </View>
                                        <View style={globalStyles.menuIconColumn}>
                                            <Feather name="smile" size={24} color="#cc0000" />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <Input
                                        style={globalStyles.fieldsLogIn}
                                        title='Seu nome'
                                        placeholder='Obrigatório'
                                        textContentType='name'
                                        autoCapitalize='words'
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                    />
                                    <InvalidFeedback message={errors.name}></InvalidFeedback>
                                </View>
                            </View>

                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <Input
                                        style={globalStyles.fieldsLogIn}
                                        title='E-mail'
                                        textContentType='emailAddress'
                                        autoCapitalize='none'
                                        keyboardType='email-address'
                                        editable={false}
                                        value={customer.email}
                                    />
                                </View>
                            </View>

                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <Input
                                        style={globalStyles.fieldsLogIn}
                                        title='CPF'
                                        placeholder='Opcional'
                                        keyboardType='number-pad'
                                        onChangeText={handleChange('cpf')}
                                        onBlur={handleBlur('cpf')}
                                        value={values.cpf}
                                    />
                                    <InvalidFeedback message={errors.cpf}></InvalidFeedback>
                                </View>
                            </View>

                            <View style={globalStyles.fieldsRow}>
                                <View style={{ flex: 0.5 }}>
                                    <Input
                                        style={globalStyles.fieldsLogIn}
                                        title='Data de nascimento'
                                        defaultValue={format(birth, 'dd/MM/yyyy')}
                                        editable={false}
                                        onChangeText={handleChange('birth')}
                                    />
                                </View>
                                <View style={{ flex: 0.2, alignItems: 'center' }}>
                                    <TouchableHighlight underlayColor="#e8e8e8" style={globalStyles.buttonNewItem} onPress={() => { setShow(true) }}>
                                        <Feather name="calendar" size={24} color="#cc0000" />
                                    </TouchableHighlight>
                                    {
                                        show && <DateTimePicker
                                            value={birth}
                                            style={globalStyles.fieldsLogIn}
                                            mode="date"
                                            onChange={(birthDate, selectedDate) => {
                                                setShow(Platform.OS === 'ios');
                                                selectedDate && setBirth(selectedDate);
                                            }}
                                        />
                                    }
                                </View>
                            </View>

                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <Input
                                        style={globalStyles.fieldsLogIn}
                                        title='Telefone'
                                        placeholder='Opcional'
                                        textContentType='telephoneNumber'
                                        keyboardType='phone-pad'
                                        onChangeText={handleChange('phone')}
                                        onBlur={handleBlur('phone')}
                                        value={values.phone}
                                    />
                                    <InvalidFeedback message={errors.phone}></InvalidFeedback>
                                </View>
                            </View>

                            <View style={globalStyles.fieldsRow}>
                                <View style={globalStyles.fieldsColumn}>
                                    <BorderlessButton onPress={() => {
                                        navigation.navigate('CustomerUpdate');
                                    }}>
                                        <View style={globalStyles.menuRow}>
                                            <View style={globalStyles.menuColumn}>
                                                <Text>Senha</Text>
                                            </View>
                                            <View style={globalStyles.menuIconColumn}>
                                                <Feather name="key" size={24} color="#fe3807" />
                                            </View>
                                        </View>
                                        <View style={globalStyles.menuDescriptionRow}>
                                            <View style={globalStyles.menuDescriptionColumn}>
                                                <Text style={globalStyles.textsDescriptionMenu}>Atualizar a sua senha atual.</Text>
                                            </View>
                                        </View>
                                    </BorderlessButton>
                                </View>
                            </View>

                            <View>
                                <TouchableHighlight underlayColor='#cc0000' style={globalStyles.buttonLogIn} onPress={handleSubmit as any}>
                                    <Text style={globalStyles.footerButtonText}>Atualizar</Text>
                                </TouchableHighlight>
                            </View>
                        </>
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
        </ScrollView>
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
    },
});