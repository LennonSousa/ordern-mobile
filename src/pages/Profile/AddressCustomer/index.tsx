import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView } from 'react-native';
import { BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import cep from 'cep-promise';

import api from '../../../services/api';

import { CustomerContext } from '../../../context/customerContext';
import { CustomerAddress } from '../../../components/CustomerAddress';
import Input from '../../../components/Interfaces/Inputs';
import InvalidFeedback from '../../../components/Interfaces/InvalidFeedback';

export default function AddressCustomer() {
    const navigation = useNavigation();
    const { customer, handleCustomer } = useContext(CustomerContext);

    // Customer address
    const [customerAddress, setCustomerAddress] = useState<CustomerAddress[]>([]);
    const [cepCustomer, setCepCustomer] = useState('');
    const [spinnerCep, setSpinnerCep] = useState('none');
    const [streetCustomer, setStreetCustomer] = useState('');
    const [numberCustomer, setNumberCustomer] = useState('');
    const [groupCustomer, setGroupCustomer] = useState('');
    const [addressLine2Customer, setAddressLine2Customer] = useState('');
    const [cityCustomer, setCityCustomer] = useState('');
    const [countryCustomer, setCountryCustomer] = useState('');
    const [typeAddressCustomer, setTypeAddressCustomer] = useState('home');

    const [containerNewAddress, setContainerNewAddress] = useState(false);

    const validatiionSchema = Yup.object().shape({
        name: Yup.string().required('Você precisa preencher o seu nome!'),
        cpf: Yup.number().notRequired().positive('CPF inválido'),
        phone: Yup.string().notRequired(),
        password: Yup.string().required('Obrigatório!').min(8, 'Deve conter no mínimo 8 caracteres!').max(22, 'Deve ser menor que 22!')
    });

    useEffect(() => {
        if (cepCustomer !== '') {
            setSpinnerCep('inline-block');
            cep(cepCustomer)
                .then(cep => {
                    const { street, neighborhood, city, state } = cep;

                    setStreetCustomer(street);
                    setGroupCustomer(neighborhood);
                    setCityCustomer(city);
                    setCountryCustomer(state);
                })
                .catch(() => {
                });
        }
    }, [cepCustomer]);

    function handleAddCustomerAddress() {
        if (customer) {
            handleCustomer(
                {
                    ...customer, address: [
                        ...customer.address,
                        ...customerAddress,
                        {
                            id: 0,
                            zip_code: cepCustomer,
                            street: streetCustomer,
                            number: numberCustomer,
                            group: groupCustomer,
                            complement: addressLine2Customer,
                            city: cityCustomer,
                            country: countryCustomer,
                            type: typeAddressCustomer
                        }
                    ]
                }
            );

            setCepCustomer('');
            setStreetCustomer('');
            setNumberCustomer('');
            setGroupCustomer('');
            setAddressLine2Customer('');
            setCityCustomer('');
            setCountryCustomer('');
            setTypeAddressCustomer('home');
        }
    }

    function handleDeleteAddressCustomer(index: number) {
        setCustomerAddress(customerAddress.splice(index, 0));
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.containerMenu}>
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
                    containerNewAddress && <Formik
                        initialValues={{
                            name: '',
                            cpf: '',
                            phone: '',
                            password: ''
                        }}
                        onSubmit={async values => {
                            try {
                                //navigation.navigate('Profile');
                            }
                            catch {

                            }

                        }}
                        validationSchema={validatiionSchema}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                            <>
                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <View style={styles.menuRow}>
                                            <View style={styles.menuColumn}>
                                                <Text>Criar um endereço</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='CEP'
                                            placeholder='Somente números'
                                            textContentType='postalCode'
                                            onChangeText={e => { e.length === 8 && setCepCustomer(e) }}
                                            defaultValue={cepCustomer}
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Rua'
                                            textContentType='streetAddressLine1'
                                            onChangeText={e => { setStreetCustomer(e) }}
                                            defaultValue={streetCustomer}
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Número'
                                            onChangeText={e => { setNumberCustomer(e) }}
                                            defaultValue={numberCustomer}
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Bairro'
                                            textContentType='sublocality'
                                            onChangeText={e => { setGroupCustomer(e) }}
                                            defaultValue={groupCustomer}
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Complemento'
                                            placeholder='Opcional'
                                            textContentType='streetAddressLine1'
                                            onChangeText={e => { setAddressLine2Customer(e) }}
                                            defaultValue={addressLine2Customer}
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Cidade'
                                            textContentType='addressCity'
                                            onChangeText={e => { setCityCustomer(e) }}
                                            defaultValue={cityCustomer}
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Estado'
                                            textContentType='addressState'
                                            onChangeText={e => { setCountryCustomer(e) }}
                                            defaultValue={countryCustomer}
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.menuColumn}>
                                        <Text>Tipo</Text>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ width: '30%' }}>
                                                <TouchableOpacity style={styles.buttonTypeAddressCustomer} onPress={() => { setTypeAddressCustomer('home') }}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Text style={{ color: typeAddressCustomer === 'home' ? '#cc0000' : 'darkgray' }}>Casa</Text>
                                                        <Feather name="home" size={24} color={typeAddressCustomer === 'home' ? '#cc0000' : 'darkgray'} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>


                                            <View style={{ width: '30%' }}>
                                                <TouchableOpacity style={styles.buttonTypeAddressCustomer} onPress={() => { setTypeAddressCustomer('work') }}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Text style={{ color: typeAddressCustomer === 'work' ? '#cc0000' : 'darkgray' }}>Trabalho</Text>
                                                        <Feather name="coffee" size={24} color={typeAddressCustomer === 'work' ? '#cc0000' : 'darkgray'} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ width: '30%' }}>
                                                <TouchableOpacity style={styles.buttonTypeAddressCustomer} onPress={() => { setTypeAddressCustomer('other') }}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Text style={{ color: typeAddressCustomer === 'other' ? '#cc0000' : 'darkgray' }}>Outros</Text>
                                                        <Feather name="box" size={24} color={typeAddressCustomer === 'other' ? '#cc0000' : 'darkgray'} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
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
                                                <TouchableOpacity style={styles.buttonAction} onPress={() => {
                                                    setContainerNewAddress(false);
                                                    setCepCustomer('');
                                                    setStreetCustomer('');
                                                    setNumberCustomer('');
                                                    setGroupCustomer('');
                                                    setAddressLine2Customer('');
                                                    setCityCustomer('');
                                                    setCountryCustomer('');
                                                    setTypeAddressCustomer('home');
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
                            </>
                        )}
                    </Formik>
                }

                {
                    customer && customer.address && customer.address.map((address, index) => {
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