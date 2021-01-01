import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, ActivityIndicator, Modal } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { CustomerContext } from '../../context/customerContext';
import { ContextOrdering } from '../../context/orderingContext';
import { CustomerAddress } from '../../components/CustomerAddress';
import { RestaurantDeliveryGroups } from '../../components/DeliveryGroups';
import Input from '../../components/Interfaces/Inputs';
import InvalidFeedback from '../../components/Interfaces/InvalidFeedback';
import { BorderlessButton } from 'react-native-gesture-handler';

import globalStyles, { colorPrimaryLight, colorPrimaryDark } from '../../assets/styles/global';
import api from '../../services/api';

export default function Shipment() {
    const navigation = useNavigation();
    const { customer } = useContext(CustomerContext);
    const { order } = useContext(ContextOrdering);

    const [selectedAddress, setSelectedAddress] = useState<CustomerAddress>();
    const [restaurantDeliveryGroups, setRestaurantDeliveryGroups] = useState<RestaurantDeliveryGroups[]>([]);
    const [selectedDeliveryGroup, setSelectedDeliveryGroup] = useState<RestaurantDeliveryGroups>();

    useEffect(() => {
        api.get('restaurant/delivery-groups').then(res => {
            setRestaurantDeliveryGroups(res.data);
        })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <ScrollView style={globalStyles.container}>
            <View style={globalStyles.row}>
                <View style={globalStyles.column}>
                    <View style={globalStyles.menuRow}>
                        <View style={globalStyles.menuColumn}>
                            <Text style={globalStyles.textsMenu}>Endereço para entrega</Text>
                        </View>
                        <View style={globalStyles.menuIconColumn}>
                            <TouchableHighlight
                                style={styles.buttonNewItem}
                                underlayColor="#e8e8e8"
                                onPress={() => {
                                    navigation.navigate('AddressCustomer');
                                }}
                            >
                                <View>
                                    <Feather name="plus" size={24} color="#cc0000" />
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={globalStyles.menuDescriptionRow}>
                        <View style={globalStyles.menuDescriptionColumn}>
                            <Text style={globalStyles.textsDescriptionMenu}>
                                Escolha um endereço para entrega ou adicione um novo.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>



            <View style={globalStyles.containerMenu}>
                {
                    customer && customer.address && customer.address.map((address, index) => {
                        return <View key={index} style={globalStyles.containerItem}>
                            <View style={globalStyles.row}>
                                <View style={globalStyles.column}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.colTitleButtonItem}>
                                            <BorderlessButton onPress={() => { setSelectedAddress(address) }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={globalStyles.colTitleButtonItem}>
                                                        <Text style={{ color: '#8c8c8c' }}>{`${address.street} - ${address.number}`}</Text>
                                                    </View>
                                                    <View style={globalStyles.colIconButtonItem}>
                                                        {
                                                            selectedAddress && selectedAddress.id === address.id && <FontAwesome5 name="check" size={18} color={colorPrimaryLight} />
                                                        }
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
            </View>

            {/* Divider*/}
            <View style={globalStyles.divider}></View>

            <View style={globalStyles.row}>
                <View style={globalStyles.column}>
                    <View style={globalStyles.menuRow}>
                        <View style={globalStyles.menuColumn}>
                            <Text style={globalStyles.textsMenu} >Taxa de entrega</Text>
                        </View>
                        <View style={globalStyles.menuIconColumn}>
                            <Feather name="truck" size={24} color="#fe3807" />
                        </View>
                    </View>
                    <View style={globalStyles.menuDescriptionRow}>
                        <View style={globalStyles.menuDescriptionColumn}>
                            <Text style={globalStyles.textsDescriptionMenu}>
                                Nossa entrega é cobrada por grupo de bairros. Escolha um grupo em que o seu bairro se enquadra.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={globalStyles.containerMenu}>
                {
                    restaurantDeliveryGroups && restaurantDeliveryGroups.map((deliveryGroup, index) => {
                        return <View key={index} style={globalStyles.containerItem}>
                            <View style={globalStyles.row}>
                                <View style={globalStyles.column}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.colTitleButtonItem}>
                                            <BorderlessButton onPress={() => { setSelectedDeliveryGroup(deliveryGroup) }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 0.6 }}>
                                                        <Text style={{ color: '#8c8c8c' }}>{deliveryGroup.description}</Text>
                                                    </View>
                                                    <View style={{ flex: 0.3, alignItems: 'center' }}>
                                                        <Text style={{ color: colorPrimaryLight }}>{`R$ ${deliveryGroup.price.toString().replace('.', ',')}`}</Text>
                                                    </View>
                                                    <View style={{ flex: 0.1 }}>
                                                        {
                                                            selectedDeliveryGroup && selectedDeliveryGroup.id === deliveryGroup.id && <FontAwesome5 name="check" size={18} color={colorPrimaryLight} style={{ textAlign: 'center' }} />
                                                        }
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
            </View>

            <View>
                <TouchableHighlight
                    underlayColor={colorPrimaryDark}
                    style={globalStyles.footerButton}
                    disabled={selectedAddress && selectedDeliveryGroup ? false : true}
                    onPress={() => { navigation.navigate('Payment') }}
                >
                    <Text style={globalStyles.footerButtonText}>Avançar</Text>
                </TouchableHighlight>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    buttonNewItem: {
        padding: 10,
        borderRadius: 5,
    },

    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
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
});