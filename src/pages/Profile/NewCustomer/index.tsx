import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../../services/api';

import Input from '../../../components/Interfaces/Inputs';
import InvalidFeedback from '../../../components/Interfaces/InvalidFeedback';

export default function NewClient() {
    const navigation = useNavigation();

    const [emailState, setEmailState] = useState('');

    const [emailSended, setEmailSended] = useState(false);
    const [messageErrorLogin, setMessageErrorLogin] = useState(false);
    const [messageTokenIncorrect, setMessageTokenIncorrect] = useState(false);

    const validatiionSchema01 = Yup.object().shape({
        email: Yup.string().email('E-mail inválido!').required('Você precisa preencher o seu e-mail!')
    });

    const validatiionSchema02 = Yup.object().shape({
        token: Yup.string().required('Obrigatório!').min(4, 'Deve conter no mínimo 4 caracteres!').max(4, 'Deve conter no máximo 4 caracteres!')
    });

    return (
        <View style={styles.container}>
            {
                emailSended ?
                    <Formik
                        initialValues={{ token: '' }}
                        onSubmit={async values => {
                            if (emailState !== '' && values.token !== '') {
                                try {
                                    const res = await api.put('customer/new', { email: emailState, token: values.token });

                                    if (res.status === 201) {
                                        setMessageErrorLogin(false);

                                        navigation.navigate('CreateCustomer',
                                            {
                                                email: res.data.email,
                                                token: res.data.token
                                            });
                                    }
                                }
                                catch {
                                    setMessageTokenIncorrect(true);
                                }
                            }
                        }}
                        validationSchema={validatiionSchema02}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                            <ScrollView style={styles.containerMenu}>
                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <View style={styles.menuRow}>
                                            <View style={styles.menuColumn}>
                                                <Text>Confirme o seu e-mail.</Text>
                                            </View>
                                            <View style={styles.menuIconColumn}>
                                                <Feather name="mail" size={24} color="#cc0000" />
                                            </View>
                                        </View>
                                        <View style={styles.menuDescriptionRow}>
                                            <View style={styles.menuDescriptionColumn}>
                                                <Text style={styles.textsDescriptionMenu}>Enviamos um código para o seu e-mail.</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Digite o código'
                                            textContentType='password'
                                            autoCapitalize='none'
                                            onChangeText={handleChange('token')}
                                            onBlur={() => { handleBlur('token'); setMessageTokenIncorrect(false); }}
                                            value={values.token}
                                        />
                                        <InvalidFeedback message={errors.token}></InvalidFeedback>
                                    </View>
                                </View>

                                <View>
                                    <TouchableHighlight underlayColor='#cc0000' style={styles.footerButton} onPress={handleSubmit as any}>
                                        <Text style={styles.footerButtonText}>Confirmar</Text>
                                    </TouchableHighlight>
                                    {
                                        messageTokenIncorrect && <InvalidFeedback message="Código incorreto!"></InvalidFeedback>
                                    }
                                </View>
                            </ScrollView>
                        )}
                    </Formik> :
                    <Formik
                        initialValues={{ email: '' }}
                        onSubmit={async values => {
                            if (values.email !== '') {
                                try {
                                    const res = await api.post('customer/new', { email: values.email });

                                    if (res.status === 200) {
                                        setMessageErrorLogin(true);
                                    }
                                    else if (res.status === 204) {
                                        setEmailState(values.email);
                                        setEmailSended(true);
                                    }
                                }
                                catch { }
                            }
                        }}
                        validationSchema={validatiionSchema01}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                            <ScrollView style={styles.containerLogIn}>
                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Qual o seu e-mail?'
                                            textContentType='emailAddress'
                                            autoCapitalize='none'
                                            keyboardType='email-address'
                                            onChangeText={handleChange('email')}
                                            onBlur={() => { handleBlur('email'); setMessageErrorLogin(false); }}
                                            value={values.email}
                                        />
                                        <InvalidFeedback message={errors.email}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <TouchableHighlight underlayColor='#cc0000' style={styles.buttonLogIn} onPress={handleSubmit as any} >
                                            <Text style={styles.buttonTextLogIn}>Avançar</Text>
                                        </TouchableHighlight>
                                        {
                                            messageErrorLogin && <InvalidFeedback message="E-mail já cadastrado!"></InvalidFeedback>
                                        }
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <BorderlessButton onPress={() => { navigation.navigate('Profile') }}>
                                            <Text style={styles.buttonTextSignIn}>Já tenho cadastro!</Text>
                                        </BorderlessButton>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </Formik>
            }
        </View >
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
        backgroundColor: '#fe3807',
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