import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import cep from 'cep-promise';

import { CustomerAddress } from '../../../../components/CustomerAddress';
import Input from '../../../../components/Interfaces/Inputs';
import api from '../../../../services/api';

export default function CreateAddress() {
    const navigation = useNavigation();

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
        setCustomerAddress(
            [
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

    function handleDeleteAddressCustomer(index: number) {
        setCustomerAddress(customerAddress.splice(index, 0));
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.containerMenu}>
                <View style={styles.containerItem}>
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
                                placeholder='CEP'
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
                                placeholder='Rua'
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
                                placeholder='Número'
                                onChangeText={e => { setNumberCustomer(e) }}
                                defaultValue={numberCustomer}
                            />
                        </View>
                    </View>

                    <View style={styles.fieldsRow}>
                        <View style={styles.fieldsColumn}>
                            <Input
                                style={styles.fieldsLogIn}
                                placeholder='Bairro'
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
                                placeholder='Complemento'
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
                                placeholder='Cidade'
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
                                placeholder='Estado'
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
                                <TouchableOpacity style={styles.buttonTypeAddressCustomer} onPress={() => { setTypeAddressCustomer('home') }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ color: typeAddressCustomer === 'home' ? '#cc0000' : 'darkgray' }}>Casa</Text>
                                        <Feather name="home" size={24} color={typeAddressCustomer === 'home' ? '#cc0000' : 'darkgray'} />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.buttonTypeAddressCustomer} onPress={() => { setTypeAddressCustomer('work') }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ color: typeAddressCustomer === 'work' ? '#cc0000' : 'darkgray' }}>Trabalho</Text>
                                        <Feather name="coffee" size={24} color={typeAddressCustomer === 'work' ? '#cc0000' : 'darkgray'} />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.buttonTypeAddressCustomer} onPress={() => { setTypeAddressCustomer('other') }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ color: typeAddressCustomer === 'other' ? '#cc0000' : 'darkgray' }}>Outros</Text>
                                        <Feather name="box" size={24} color={typeAddressCustomer === 'other' ? '#cc0000' : 'darkgray'} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.fieldsRow}>
                        <View style={styles.fieldsColumn}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={styles.buttonAction} onPress={handleAddCustomerAddress}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Feather name="check" size={24} color="#ffffff" />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.buttonAction} onPress={() => {
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

    buttonTypeAddressCustomer: {
        width: '30%',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#e8e8e8',
        alignItems: 'center',
    },

    buttonAction: {
        width: '30%',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#cc0000',
        alignItems: 'center',
    },

    fieldsLogIn: {
        marginVertical: 8,
    },
});