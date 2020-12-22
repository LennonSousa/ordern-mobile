import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView } from 'react-native';
import { BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
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
    const { customer, handleCustomer } = useContext(CustomerContext);

    // Customer address
    const [selectedCustomerAddress, setSelectedCustomerAddress] = useState<CustomerAddress | null>();

    const [containerNewAddress, setContainerNewAddress] = useState(false);
    const [buttonDeleteAddress, setButtonDeleteAddress] = useState(true);

    const validatiionSchema = Yup.object().shape({
        zip_code: Yup.string().required('Obrigatório!').max(8, 'Deve conter no máximo 8 caracteres!'),
        street: Yup.string().required('Obigatório!'),
        number: Yup.string().required('Obigatório!'),
        group: Yup.string().required('Obigatório!'),
        city: Yup.string().required('Obigatório!'),
        country: Yup.string().required('Obigatório!'),
    });

    function handleAddressCustomer(id: number) {
        if (customer) {
            customer.address.forEach(address => {
                if (address.id === id) {
                    setSelectedCustomerAddress(address);

                    setButtonDeleteAddress(true);

                    setContainerNewAddress(true);
                }
            })
        }
    }

    async function handleDeleteAddress(id: number) {
        try {
            if (customer) {
                await api.delete(`customer/address/${id}`);

                const res = await api.get(`clients/${customer.id}`);

                handleCustomer(res.data);

                setContainerNewAddress(false);
                setSelectedCustomerAddress(null);
                setButtonDeleteAddress(true);
            }
        }
        catch {

        }
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
                                    onPress={() => {
                                        setSelectedCustomerAddress(null);
                                        setButtonDeleteAddress(true);
                                        setContainerNewAddress(!containerNewAddress);
                                    }}
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
                            zip_code: selectedCustomerAddress ? selectedCustomerAddress.zip_code : '',
                            street: selectedCustomerAddress ? selectedCustomerAddress.street : '',
                            number: selectedCustomerAddress ? selectedCustomerAddress.number : '',
                            group: selectedCustomerAddress ? selectedCustomerAddress.group : '',
                            complement: selectedCustomerAddress ? selectedCustomerAddress.complement : '',
                            city: selectedCustomerAddress ? selectedCustomerAddress.city : '',
                            country: selectedCustomerAddress ? selectedCustomerAddress.country : '',
                            type: selectedCustomerAddress ? selectedCustomerAddress.type : 'home',
                        }}
                        onSubmit={async values => {
                            if (customer) {
                                try {
                                    if (selectedCustomerAddress) {
                                        await api.put(`customer/address/${selectedCustomerAddress.id}`, {
                                            "zip_code": values.zip_code,
                                            "street": values.street,
                                            "number": values.number,
                                            "group": values.group,
                                            "complement": values.complement,
                                            "city": values.city,
                                            "country": values.country,
                                            "type": values.type,
                                            "client": customer.id
                                        });
                                    }
                                    else {
                                        await api.post('customer/address', {
                                            "zip_code": values.zip_code,
                                            "street": values.street,
                                            "number": values.number,
                                            "group": values.group,
                                            "complement": values.complement,
                                            "city": values.city,
                                            "country": values.country,
                                            "type": values.type,
                                            "client": customer.id
                                        });
                                    }

                                    const res = await api.get(`clients/${customer.id}`);

                                    handleCustomer(res.data);

                                    setContainerNewAddress(false);
                                    setSelectedCustomerAddress(null);
                                }
                                catch {

                                }
                            }
                        }}
                        validationSchema={validatiionSchema}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
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
                                            title='CEP'
                                            placeholder='Somente números'
                                            textContentType='postalCode'
                                            keyboardType='numeric'
                                            onBlur={handleBlur('zip_code')}
                                            onChangeText={e => {
                                                setFieldValue('zip_code', e);

                                                if (e.length === 8) {
                                                    if (e !== '') {
                                                        cep(e)
                                                            .then(cep => {
                                                                const { street, neighborhood, city, state } = cep;

                                                                setFieldValue('street', street, false);
                                                                setFieldValue('group', neighborhood, false);
                                                                setFieldValue('city', city, false);
                                                                setFieldValue('country', state, false);
                                                            })
                                                            .catch(() => {
                                                            });
                                                    }
                                                }
                                            }}
                                            value={values.zip_code}
                                        />
                                        <InvalidFeedback message={errors.zip_code}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Rua'
                                            textContentType='streetAddressLine1'
                                            keyboardType='default'
                                            onChangeText={handleChange('street')}
                                            onBlur={handleBlur('street')}
                                            value={values.street}
                                        />
                                        <InvalidFeedback message={errors.street}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Número'
                                            onChangeText={handleChange('number')}
                                            onBlur={handleBlur('number')}
                                            value={values.number}
                                        />
                                        <InvalidFeedback message={errors.number}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Bairro'
                                            textContentType='sublocality'
                                            onChangeText={handleChange('group')}
                                            onBlur={handleBlur('group')}
                                            value={values.group}
                                        />
                                        <InvalidFeedback message={errors.group}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Complemento'
                                            placeholder='Opcional'
                                            textContentType='streetAddressLine2'
                                            onChangeText={handleChange('complement')}
                                            onBlur={handleBlur('complement')}
                                            value={values.complement}
                                        />
                                        <InvalidFeedback message={errors.complement}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Cidade'
                                            textContentType='addressCity'
                                            onChangeText={handleChange('city')}
                                            onBlur={handleBlur('city')}
                                            value={values.city}
                                        />
                                        <InvalidFeedback message={errors.city}></InvalidFeedback>
                                    </View>
                                </View>

                                <View style={styles.fieldsRow}>
                                    <View style={styles.fieldsColumn}>
                                        <Input
                                            style={styles.fieldsLogIn}
                                            title='Estado'
                                            textContentType='addressState'
                                            onChangeText={handleChange('country')}
                                            onBlur={handleBlur('country')}
                                            value={values.country}
                                        />
                                        <InvalidFeedback message={errors.country}></InvalidFeedback>
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
                                                <TouchableOpacity style={styles.buttonTypeAddressCustomer} onPress={() => { setFieldValue('type', 'home') }}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Text style={{ color: values.type === 'home' ? '#cc0000' : 'darkgray' }}>Casa</Text>
                                                        <Feather name="home" size={24} color={values.type === 'home' ? '#cc0000' : 'darkgray'} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>


                                            <View style={{ width: '30%' }}>
                                                <TouchableOpacity style={styles.buttonTypeAddressCustomer} onPress={() => { setFieldValue('type', 'work') }}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Text style={{ color: values.type === 'work' ? '#cc0000' : 'darkgray' }}>Trabalho</Text>
                                                        <Feather name="coffee" size={24} color={values.type === 'work' ? '#cc0000' : 'darkgray'} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ width: '30%' }}>
                                                <TouchableOpacity style={styles.buttonTypeAddressCustomer} onPress={() => { setFieldValue('type', 'other') }}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Text style={{ color: values.type === 'other' ? '#cc0000' : 'darkgray' }}>Outros</Text>
                                                        <Feather name="box" size={24} color={values.type === 'other' ? '#cc0000' : 'darkgray'} />
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
                                                {
                                                    selectedCustomerAddress && buttonDeleteAddress ? <TouchableOpacity style={styles.buttonAction} onPress={() => { setButtonDeleteAddress(false) }}>
                                                        <View style={{ alignItems: 'center' }}>
                                                            <Feather name="trash-2" size={24} color="#ffffff" />
                                                        </View>
                                                    </TouchableOpacity> :
                                                        selectedCustomerAddress && <TouchableOpacity
                                                            style={styles.buttonConfirm}
                                                            onPress={() => { selectedCustomerAddress && handleDeleteAddress(selectedCustomerAddress.id) }}
                                                        >
                                                            <View style={{ alignItems: 'center' }}>
                                                                <Feather name="info" size={24} color="#ffffff" />
                                                            </View>
                                                        </TouchableOpacity>
                                                }
                                            </View>

                                            <View style={{ width: '30%' }}>
                                                <TouchableOpacity style={styles.buttonAction} onPress={() => {
                                                    setContainerNewAddress(false);
                                                    setSelectedCustomerAddress(null);
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
                            </View>
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
                                            <BorderlessButton onPress={() => { handleAddressCustomer(address.id) }}>
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

    buttonConfirm: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ffcc00',
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