import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '../../context/authContext';
import { CustomerContext } from '../../context/customerContext';
import Header from '../../components/PageHeader';
import Input from '../../components/Interfaces/Inputs';
import PasswordInput from '../../components/Interfaces/PasswordInput';
import InvalidFeedback from '../../components/Interfaces/InvalidFeedback';
import Buttons from '../../components/Interfaces/Buttons';
import WaitingModal, { statusModal } from '../../components/Interfaces/WaitingModal';

import globalStyles from '../../assets/styles/global';

const { expo } = require('../../../app.json');

export default function Profile() {
    const navigation = useNavigation();
    const { signed, handleLogin, handleLogout } = useContext(AuthContext);
    const { customer } = useContext(CustomerContext);

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    const validatiionSchema = Yup.object().shape({
        email: Yup.string().email('E-mail inválido!').required('Você precisa preencher o seu e-mail!'),
        password: Yup.string().required('Obrigatório!').min(8, 'Deve conter no mínimo 8 caracteres!').max(22, 'Deve ser menor que 22!')
    });

    return (
        <View style={styles.container}>
            <Header title="Perfil" showGoBack={false} showCancel={false} />
            {
                signed && customer ?
                    <ScrollView style={styles.containerMenu}>
                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Text style={styles.textsLogIn}>{customer.name}</Text>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <BorderlessButton onPress={() => {
                                    navigation.navigate('CustomerUpdate');
                                }}>
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
                                <BorderlessButton onPress={() => {
                                    navigation.navigate('OrdersList');
                                }}>
                                    <View style={styles.menuRow}>
                                        <View style={styles.menuColumn}>
                                            <Text>Pedidos</Text>
                                        </View>
                                        <View style={styles.menuIconColumn}>
                                            <Feather name="shopping-bag" size={24} color="#fe3807" />
                                        </View>
                                    </View>
                                    <View style={styles.menuDescriptionRow}>
                                        <View style={styles.menuDescriptionColumn}>
                                            <Text style={styles.textsDescriptionMenu}>Seus pedidos no aplicativo</Text>
                                        </View>
                                    </View>
                                </BorderlessButton>
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <BorderlessButton onPress={() => {
                                    navigation.navigate('AddressCustomer');
                                }}>
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
                                <BorderlessButton onPress={() => {
                                    navigation.navigate('PaymentsCustomer');
                                }}>
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
                                <BorderlessButton onPress={() => {
                                    navigation.navigate('CustomerNewReset');
                                }}>
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
                    </ScrollView> :
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={async values => {
                            if (values.email !== '' && values.password !== '') {
                                setModalWaiting("waiting");

                                try {
                                    const res = await handleLogin(values.email, values.password)

                                    if (!res) {
                                        setModalWaiting("error");
                                        setErrorMessage("E-mail ou senha incorretos!");
                                    }
                                    else
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
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                            <ScrollView style={styles.containerLogIn}>
                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Text style={[globalStyles.titlePrimaryLight, { textAlign: 'center' }]}>Entrar</Text>
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
                                            returnKeyType='go'
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                        />
                                        <InvalidFeedback message={errors.email}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <PasswordInput
                                            style={styles.fieldsLogIn}
                                            title='Senha'
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            value={values.password}
                                        />
                                        <InvalidFeedback message={errors.password}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Buttons title="Entrar" onPress={handleSubmit as any} />
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <BorderlessButton onPress={() => { navigation.navigate('CustomerNewReset') }}>
                                            <Text style={styles.buttonTextSignIn}>Esqueci a minha senha.</Text>
                                        </BorderlessButton>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <BorderlessButton onPress={() => { navigation.navigate('CustomerNew') }}>
                                            <Text style={styles.buttonTextSignIn}>Criar o meu cadastro.</Text>
                                        </BorderlessButton>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={{ flex: 0.5 }}>
                                        <BorderlessButton onPress={() => { navigation.navigate('PrivacyTerms', { type: "terms" }) }}>
                                            <Text style={[globalStyles.textsDescriptionMenu, { textAlign: 'center' }]}>Termos de uso</Text>
                                        </BorderlessButton>
                                    </View>

                                    <View style={{ flex: 0.5 }}>
                                        <BorderlessButton onPress={() => { navigation.navigate('PrivacyTerms', { type: "privacy" }) }}>
                                            <Text style={[globalStyles.textsDescriptionMenu, { textAlign: 'center' }]}>Políticas de privacidade</Text>
                                        </BorderlessButton>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <Text style={[globalStyles.textsDescriptionMenu, { textAlign: 'center' }]}>{`Versão do aplicativo: ${expo.version}`}</Text>
                                </View>
                            </ScrollView>
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
        height: 50,
    },

    buttonLogIn: {
        backgroundColor: '#fe3807',
        borderRadius: 5,
        marginVertical: 15,
        height: 50,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
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