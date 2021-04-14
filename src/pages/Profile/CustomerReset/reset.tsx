import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../../services/api';

import { AuthContext } from '../../../context/authContext';
import { Customer } from '../../../components/Customer';
import Input from '../../../components/Interfaces/Inputs';
import InvalidFeedback from '../../../components/Interfaces/InvalidFeedback';
import WaitingModal, { statusModal } from '../../../components/Interfaces/WaitingModal';
import Button from '../../../components/Interfaces/Button';

interface NewCustomerRouteParams {
    email: string;
    token: string;
    customer: Customer;
}

export default function NewClient() {
    const route = useRoute();
    const navigation = useNavigation();
    const { handleLogin } = useContext(AuthContext);
    const params = route.params as NewCustomerRouteParams;

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [customer, setCustomer] = useState<Customer>();

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (params.email && params.token) {
            setEmail(params.email);
            setToken(params.token);
            setCustomer(params.customer);
        }
    }, [params.email, params.token]);

    const validatiionSchema = Yup.object().shape({
        password: Yup.string().required('Obrigatório!').min(8, 'Deve conter no mínimo 8 caracteres!').max(22, 'Deve ser menor que 22!')
    });

    return (
        <View style={styles.container}>
            <Formik
                initialValues={{
                    password: ''
                }}
                onSubmit={async values => {
                    try {
                        if (customer) {
                            setModalWaiting("waiting");

                            const res = await api.put(`customer/password/${customer.id}`, {
                                password: values.password
                            }, { headers: { 'Authorization': `Bearer ${token}` } });

                            if (res.status === 204) {
                                handleLogin(email, values.password)
                                    .then(res => {
                                        if (res) {
                                            setModalWaiting("success");

                                            setTimeout(() => {
                                                setModalWaiting("hidden");
                                                navigation.navigate('Profile');
                                            }, 1500);
                                        }
                                    })
                                    .catch(err => {
                                        console.log('error profile');
                                        console.log(err);

                                        setModalWaiting("error");
                                        setErrorMessage("Algo deu errado com a sua solicitação.");
                                    });
                            }
                            else {
                                setModalWaiting("error");
                                setErrorMessage("Algo deu errado com a sua solicitação.");
                            }
                        }
                    }
                    catch {
                        setModalWaiting("error");
                        setErrorMessage("Algo deu errado com a sua solicitação.");
                    }

                }}
                validationSchema={validatiionSchema}
                validateOnChange={false}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                    <ScrollView style={styles.containerMenu}>
                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <View style={styles.menuRow}>
                                    <View style={styles.menuColumn}>
                                        <Text>Digite a sua nova senha</Text>
                                    </View>
                                    <View style={styles.menuIconColumn}>
                                        <Feather name="key" size={24} color="#cc0000" />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
                                    title='Nova senha'
                                    placeholder='No mínimo 8 caracteres'
                                    textContentType='newPassword'
                                    autoCapitalize='none'
                                    keyboardType='visible-password'
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                />
                                {touched.password && <InvalidFeedback message={errors.password}></InvalidFeedback>}
                            </View>
                        </View>

                        <View>
                            <Button title="Salvar" disabled={touched.password && isValid ? false : true} onPress={handleSubmit as any} />
                        </View>
                    </ScrollView>
                )}
            </Formik>

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