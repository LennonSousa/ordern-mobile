import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView, Platform } from 'react-native';
import { BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import Input from '../../components/Inputs';
import api from '../../services/api';

export default function NewClient() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    const [emailConfirmed, setEmailConfirmed] = useState(false);
    const [messageErrorLogin, setMessageErrorLogin] = useState(false);
    const [messageTokenIncorrect, setMessageTokenIncorrect] = useState(false);

    async function handleEmail() {
        if (email !== '') {
            try {
                const res = await api.post('customer/new', { email });

                console.log(res);

                if (res.status === 200) {
                    setMessageErrorLogin(true);
                }
                else if (res.status === 204) {
                    setEmailConfirmed(true);
                }
            }
            catch { }
        }
    }

    async function handleConfirmEmail() {
        if (email !== '' && token !== '') {
            try {
                const res = await api.put('customer/new', { email, token });

                console.log(res);

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
    }

    return (
        <View style={styles.container}>
            {
                emailConfirmed ?
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
                                    onChangeText={e => { setToken(e) }}
                                />
                            </View>
                        </View>

                        <View>
                            <TouchableHighlight style={styles.footerButton} onPress={handleConfirmEmail}>
                                <Text style={styles.footerButtonText}>Confirmar</Text>
                            </TouchableHighlight>
                            <Text
                                style={
                                    {
                                        display: messageTokenIncorrect ? 'flex' : 'none',
                                        color: '#fe3807',
                                        alignSelf: 'center',
                                        fontFamily: 'Nunito_600SemiBold',
                                        fontSize: 16,
                                    }
                                }>Código incorreto!</Text>
                        </View>
                    </ScrollView> :
                    <ScrollView style={styles.containerLogIn}>
                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
                                    title='Qual o seu e-mail?'
                                    textContentType='emailAddress'
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    onChangeText={e => { setEmail(e) }}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <TouchableHighlight style={styles.buttonLogIn} onPress={handleEmail} >
                                    <Text style={styles.buttonTextLogIn}>Avançar</Text>
                                </TouchableHighlight>
                                <Text
                                    style={
                                        {
                                            display: messageErrorLogin ? 'flex' : 'none',
                                            color: '#fe3807',
                                            alignSelf: 'center',
                                            fontFamily: 'Nunito_600SemiBold',
                                            fontSize: 16,
                                        }
                                    }>Esse e-mail já está cadastrado.</Text>
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