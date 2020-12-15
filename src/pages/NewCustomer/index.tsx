import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView, Platform } from 'react-native';
import { BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { CustomerAddress } from '../../components/CustomerAddress';
import Input from '../../components/Inputs';
import api from '../../services/api';


export default function NewClient() {
    const navigation = useNavigation();

    const [containerNewAddress, setContainerNewAddress] = useState(false);

    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');

    const [show, setShow] = useState(false);

    const [birth, setBirth] = useState(new Date());
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailConfirmed, setEmailConfirmed] = useState(false);
    const [messageErrorLogin, setMessageErrorLogin] = useState(false);

    // Customer address
    const [customerAddress, setCustomerAddress] = useState<CustomerAddress[]>([]);

    async function handleEmail() {
        if (email !== '') {
            try {
                await api.get(`clients/authenticate/${email}`);

                setMessageErrorLogin(true);
            }
            catch {
                setEmailConfirmed(true);
            }

        }
    }

    async function handleCreateCustomer() {
        console.log(birth);

        const res = await api.post('clients', {
            "name": name,
            "cpf": cpf,
            "birth": birth,
            "phone": phone,
            "email": email,
            "password": password,
            "active": true,
            "paused": false,
        });

        console.log(res);
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
                                    onChangeText={e => { setName(e) }}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
                                    title='CPF'
                                    placeholder='Opcional'
                                    onChangeText={e => { setCpf(e) }}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={{ flex: 0.5 }}>
                                <Input
                                    style={styles.fieldsLogIn}
                                    title='Data de nascimento'
                                    defaultValue={format(birth, 'dd/MM/yyyy')}
                                    editable={false}
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
                                            setBirth(selectedDate || birth);
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
                                    onChangeText={e => { setPhone(e) }}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
                                    title='Senha'
                                    placeholder='No mínimo 8 caracteres'
                                    textContentType='newPassword'
                                    onChangeText={e => { setPassword(e) }}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <View style={styles.menuRow}>
                                    <View style={styles.menuColumn}>
                                        <Text>Endereços</Text>
                                    </View>
                                    <View style={styles.menuIconColumn}>
                                        <TouchableHighlight
                                            style={styles.buttonNewItem}
                                            underlayColor="#e8e8e8"
                                            onPress={() => { setContainerNewAddress(!containerNewAddress) }}
                                        >
                                            <View>
                                                <Feather name={containerNewAddress ? "x" : "plus"} size={24} color="#cc0000" />
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                                <View style={styles.menuDescriptionRow}>
                                    <View style={styles.menuDescriptionColumn}>
                                        <Text style={styles.textsDescriptionMenu}>Seus endereços para entrega.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {
                            customerAddress.map((address, index) => {
                                return <View key={index} style={styles.containerItem}>
                                    <View style={styles.fieldsRow}>
                                        <View style={styles.fieldsColumn}>
                                            <View style={styles.menuRow}>
                                                <View style={styles.colTitleButtonItem}>
                                                    <BorderlessButton onPress={() => { navigation.navigate('AddressCustomer') }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={styles.colTitleButtonItem}>
                                                                <Text style={{ color: '#8c8c8c' }}>{`${address.street} - ${address.number}`}</Text>
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

                        {/* Divider*/}
                        <View style={styles.divider}></View>

                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <BorderlessButton>
                                    <View style={styles.menuRow}>
                                        <View style={styles.menuColumn}>
                                            <Text>Formas de pagamento</Text>
                                        </View>
                                        <View style={styles.menuIconColumn}>
                                            <TouchableHighlight>
                                                <View>
                                                    <Feather name="plus" size={24} color="#cc0000" />
                                                </View>
                                            </TouchableHighlight>
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

                        <View>
                            <TouchableHighlight style={styles.footerButton} onPress={handleCreateCustomer}>
                                <Text style={styles.footerButtonText}>Cadastrar</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView> :
                    <ScrollView style={styles.containerLogIn}>
                        <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <Input
                                    style={styles.fieldsLogIn}
                                    title='Qual o seu e-mail?'
                                    textContentType='emailAddress'
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