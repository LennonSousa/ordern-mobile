import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView, Platform } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../../services/api';

import { CustomerContext } from '../../../context/customerContext';
import Input from '../../../components/Interfaces/Inputs';
import InvalidFeedback from '../../../components/Interfaces/InvalidFeedback';


interface NewCustomerRouteParams {
    email: string;
    token: string;
}

export default function NewClient() {
    const route = useRoute();
    const navigation = useNavigation();
    const { handleLogin } = useContext(CustomerContext);
    const params = route.params as NewCustomerRouteParams;

    const [show, setShow] = useState(false);

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [birth, setBirth] = useState(new Date());

    useEffect(() => {
        if (params.email && params.token) {
            setEmail(params.email);
            setToken(params.token);
        }
    }, [params.email, params.token]);

    const validatiionSchema = Yup.object().shape({
        name: Yup.string().required('Você precisa preencher o seu nome!'),
        cpf: Yup.number().notRequired().positive('CPF inválido'),
        phone: Yup.string().notRequired(),
        password: Yup.string().required('Obrigatório!').min(8, 'Deve conter no mínimo 8 caracteres!').max(22, 'Deve ser menor que 22!')
    });

    return (
        <View style={styles.container}>
            <Formik
                initialValues={{
                    name: '',
                    cpf: '',
                    phone: '',
                    password: ''
                }}
                onSubmit={async values => {
                    try {
                        const res = await api.post('clients', {
                            "name": values.name,
                            "cpf": values.cpf,
                            "birth": birth,
                            "phone": values.phone,
                            "email": email,
                            "password": values.password,
                            "active": true,
                            "paused": false,
                        }, { headers: { 'Authorization': `Bearer ${token}` } });

                        if (res.status === 201) {
                            handleLogin(email, values.password)
                                .then(res => {
                                    res && navigation.navigate('Profile');
                                })
                                .catch(err => {
                                    console.log('error profile');
                                    console.log(err);
                                });
                        }
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
                                        <Feather name="smile" size={24} color="#cc0000" />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
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

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
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

                        <View style={styles.fieldsRow}>
                            <View style={{ flex: 0.5 }}>
                                <Input
                                    style={styles.fieldsLogIn}
                                    title='Data de nascimento'
                                    defaultValue={format(birth, 'dd/MM/yyyy')}
                                    editable={false}
                                    onChangeText={handleChange('birth')}
                                />
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center' }}>
                                <TouchableHighlight underlayColor="#e8e8e8" style={styles.buttonNewItem} onPress={() => { setShow(true) }}>
                                    <Feather name="calendar" size={24} color="#cc0000" />
                                </TouchableHighlight>
                                {
                                    show && <DateTimePicker
                                        value={birth}
                                        style={styles.fieldsLogIn}
                                        mode="date"
                                        onChange={(birthDate, selectedDate) => {
                                            setShow(Platform.OS === 'ios');
                                            selectedDate && setBirth(selectedDate);
                                        }}
                                    />
                                }
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
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

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
                                    title='Senha'
                                    placeholder='No mínimo 8 caracteres'
                                    textContentType='newPassword'
                                    autoCapitalize='none'
                                    keyboardType='visible-password'
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                />
                                <InvalidFeedback message={errors.password}></InvalidFeedback>
                            </View>
                        </View>

                        <View>
                            <TouchableHighlight underlayColor='#cc0000' style={styles.buttonLogIn} onPress={handleSubmit as any}>
                                <Text style={styles.footerButtonText}>Cadastrar</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                )}
            </Formik>
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