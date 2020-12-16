import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { CustomerContext } from '../../context/customerContext';
import Header from '../../components/PageHeader';
import Input from '../../components/Inputs';

export default function Profile() {
    const navigation = useNavigation();
    const { signed, customer, handleLogin, handleLogout } = useContext(CustomerContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [messageErrorLogin, setMessageErrorLogin] = useState(false);

    function handleClient() {
        if (email !== '' && password !== '')
            handleLogin(email, password)
                .then(res => {
                    !res ? setMessageErrorLogin(true) : null
                })
                .catch(err => {
                    console.log('error profile');
                    console.log(err);
                });
    }
    return (
        <View style={styles.container}>
            <Header title="Perfil" showCancel={false} />
            {
                signed && customer ?
                    <View style={styles.containerMenu}>
                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Text style={styles.textsLogIn}>{customer.name}</Text>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <BorderlessButton>
                                    <View style={styles.menuRow}>
                                        <View style={styles.menuColumn}>
                                            <Text>Informações pessoais</Text>
                                        </View>
                                        <View style={styles.menuIconColumn}>
                                            <Feather name="smile" size={24} color="#fe3807" />
                                        </View>
                                    </View>
                                    <View style={styles.menuDescriptionRow}>
                                        <View style={styles.menuDescriptionColumn}>
                                            <Text style={styles.textsDescriptionMenu}>Nome, e-mail, cpf...</Text>
                                        </View>
                                    </View>
                                </BorderlessButton>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <BorderlessButton>
                                    <View style={styles.menuRow}>
                                        <View style={styles.menuColumn}>
                                            <Text>Endereços</Text>
                                        </View>
                                        <View style={styles.menuIconColumn}>
                                            <Feather name="map" size={24} color="#fe3807" />
                                        </View>
                                    </View>
                                    <View style={styles.menuDescriptionRow}>
                                        <View style={styles.menuDescriptionColumn}>
                                            <Text style={styles.textsDescriptionMenu}>Seus endereços para entrega.</Text>
                                        </View>
                                    </View>
                                </BorderlessButton>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <BorderlessButton>
                                    <View style={styles.menuRow}>
                                        <View style={styles.menuColumn}>
                                            <Text>Formas de pagamento</Text>
                                        </View>
                                        <View style={styles.menuIconColumn}>
                                            <Feather name="credit-card" size={24} color="#fe3807" />
                                        </View>
                                    </View>
                                    <View style={styles.menuDescriptionRow}>
                                        <View style={styles.menuDescriptionColumn}>
                                            <Text style={styles.textsDescriptionMenu}>Cartões de crédito...</Text>
                                        </View>
                                    </View>
                                </BorderlessButton>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <BorderlessButton>
                                    <View style={styles.menuRow}>
                                        <View style={styles.menuColumn}>
                                            <Text>Credenciais</Text>
                                        </View>
                                        <View style={styles.menuIconColumn}>
                                            <Feather name="key" size={24} color="#fe3807" />
                                        </View>
                                    </View>
                                    <View style={styles.menuDescriptionRow}>
                                        <View style={styles.menuDescriptionColumn}>
                                            <Text style={styles.textsDescriptionMenu}>Mudar a sua senha, ou recuperá-la.</Text>
                                        </View>
                                    </View>
                                </BorderlessButton>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <BorderlessButton onPress={handleLogout}>
                                    <View style={styles.menuRow}>
                                        <View style={styles.menuColumn}>
                                            <Text>Sair</Text>
                                        </View>
                                        <View style={styles.menuIconColumn}>
                                            <Feather name="log-out" size={24} color="#fe3807" />
                                        </View>
                                    </View>
                                    <View style={styles.menuDescriptionRow}>
                                        <View style={styles.menuDescriptionColumn}>
                                            <Text style={styles.textsDescriptionMenu}>Sair da sua conta.</Text>
                                        </View>
                                    </View>
                                </BorderlessButton>
                            </View>
                        </View>
                    </View> :
                    <ScrollView style={styles.containerLogIn}>
                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Text style={styles.textsLogIn}>Entrar</Text>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
                                    title='E-mail'
                                    textContentType='emailAddress'
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    onChangeText={e => { setEmail(e) }}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
                                    title='Senha'
                                    textContentType='password'
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    onChangeText={e => { setPassword(e) }}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <TouchableHighlight style={styles.buttonLogIn} onPress={handleClient}>
                                    <Text style={styles.buttonTextLogIn}>Entrar</Text>
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
                                    }>E-mail ou senha incorretos!</Text>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <BorderlessButton onPress={() => { navigation.navigate('NewCustomer') }}>
                                    <Text style={styles.buttonTextSignIn}>Criar o meu cadastro.</Text>
                                </BorderlessButton>
                            </View>
                        </View>
                    </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontSize: 22,
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
        marginVertical: 15,
    },

    fieldsColumn: {
        flex: 1,
    },

    textsLogIn: {
        textAlign: 'center',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 22,
        color: '#fe3807',
        padding: 10
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
    }
});