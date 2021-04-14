import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { format } from 'date-fns';

import { CustomerContext } from '../../context/customerContext';
import { ContextOrdering } from '../../context/orderingContext';
import { CustomerAddress } from '../../components/CustomerAddress';
import { RestaurantDeliveryGroups } from '../../components/DeliveryGroups';

import PageFooter from '../../components/PageFooter';
import Buttons from '../../components/Interfaces/Button';
import ButtonListItem from '../../components/Interfaces/ButtonListItem';
import WaitingModal, { statusModal } from '../../components/Interfaces/WaitingModal';

import api from '../../services/api';

import globalStyles, { colorPrimaryLight } from '../../assets/styles/global';

export default function Shipment() {
    const navigation = useNavigation();

    const { customer } = useContext(CustomerContext);
    const { order, handleOrder, handleTotalOrder } = useContext(ContextOrdering);

    const [selectedAddress, setSelectedAddress] = useState<CustomerAddress>();
    const [restaurantDeliveryGroups, setRestaurantDeliveryGroups] = useState<RestaurantDeliveryGroups[]>([]);
    const [selectedDeliveryGroup, setSelectedDeliveryGroup] = useState<RestaurantDeliveryGroups>();

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setModalWaiting("waiting");

        api.get('store/delivery-groups').then(res => {
            setRestaurantDeliveryGroups(res.data);

            setModalWaiting("hidden");
        })
        .finally(() => {
            setModalWaiting("hidden");
        })
            .catch(err => {
                console.log(err);

                setModalWaiting("error");
                setErrorMessage("Tivemos um problema, verifique a sua conexão.");
            });

        const unsubscribe = navigation.addListener('focus', () => {
            // do something
            if (order) {
                handleTotalOrder(
                    {
                        ...order,
                        delivery_tax: 0,
                        delivery_type: ''
                    }
                );

                setSelectedDeliveryGroup(undefined);
            }
        });

        return unsubscribe;
    }, [navigation]);

    function handleDeliveryGroup(deliveryGroup: RestaurantDeliveryGroups) {
        setSelectedDeliveryGroup(deliveryGroup);

        if (order) {
            handleTotalOrder(
                {
                    ...order,
                    delivery_tax: deliveryGroup.price
                }
            );
        }
    }

    function handleOrdertoPayment() {
        if (order && selectedAddress && selectedDeliveryGroup) {
            handleOrder(
                {
                    ...order,
                    tracker: `${format(new Date(), 'ssmmddHHMM')}${order.total.toFixed(2).replace('.', '').replace(',', '')}`,
                    address: `${selectedAddress.street} -  ${selectedAddress.number}\n${selectedAddress.group}\n${selectedAddress.complement}\n${selectedAddress.city} - ${selectedAddress.country}, ${selectedAddress.zip_code}`,
                    delivery_tax: selectedDeliveryGroup.price,
                    delivery_type: selectedDeliveryGroup.description,
                    delivery_estimated: selectedDeliveryGroup.estimated,
                }
            );

            navigation.navigate('OrderReview');
        }
    }

    return (
        <>
            <ScrollView style={globalStyles.container}>
                <View style={globalStyles.row}>
                    <View style={globalStyles.column}>
                        <BorderlessButton
                            onPress={() => {
                                navigation.navigate('PickupShipment');
                            }}
                        >
                            <View style={globalStyles.menuRow}>
                                <View style={globalStyles.menuColumn}>
                                    <Text style={globalStyles.textsMenu}>Retire no local</Text>
                                </View>
                                <View style={globalStyles.menuIconColumn}>
                                    <View>
                                        <Feather name="chevron-right" size={24} color="#cc0000" />
                                    </View>
                                </View>
                            </View>
                            <View style={globalStyles.menuDescriptionRow}>
                                <View style={globalStyles.menuDescriptionColumn}>
                                    <Text style={globalStyles.textsDescriptionMenu}>
                                        Retire o seu pedido no nosso endereço.
                            </Text>
                                </View>
                            </View>
                        </BorderlessButton>
                    </View>
                </View>

                <View style={globalStyles.row}>
                    <View style={globalStyles.column}>
                        <View style={globalStyles.menuRow}>
                            <View style={globalStyles.menuColumn}>
                                <Text style={globalStyles.textsMenu}>Ou entregamos na sua casa</Text>
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
                                        <Feather name="plus" size={24} color="#fe3807" />
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

                {
                    customer && customer.address && customer.address.map((address, index) => {
                        return <ButtonListItem key={index} onPress={() => { setSelectedAddress(address) }}>
                            <View style={globalStyles.row}>
                                <View style={globalStyles.colTitleButtonItem}>
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
                                </View>
                            </View>
                        </ButtonListItem>
                    })
                }

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

                {
                    restaurantDeliveryGroups && restaurantDeliveryGroups.map((deliveryGroup, index) => {
                        return <ButtonListItem key={index} onPress={() => { handleDeliveryGroup(deliveryGroup) }}>
                            <View style={globalStyles.menuRow}>
                                <View style={globalStyles.colTitleButtonItem}>
                                    <View style={globalStyles.row}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: '#8c8c8c' }}>{deliveryGroup.description}</Text>
                                        </View>
                                        <View style={{ flex: 0.4, alignItems: 'center' }}>
                                            <Text style={{ color: colorPrimaryLight }}>{`R$ ${deliveryGroup.price.toString().replace('.', ',')}`}</Text>
                                        </View>
                                        <View style={{ flex: 0.1, alignItems: 'center' }}>
                                            {
                                                selectedDeliveryGroup && selectedDeliveryGroup.id === deliveryGroup.id && <FontAwesome5 name="check" size={18} color={colorPrimaryLight} style={{ textAlign: 'center' }} />
                                            }
                                        </View>
                                    </View>
                                    <View>
                                        <View style={globalStyles.column}>
                                            <Text style={globalStyles.textsDescriptionMenu}>{`${deliveryGroup.estimated} minutos`}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ButtonListItem>
                    })
                }

                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <WaitingModal message={errorMessage} status={modalWaiting} />
                </View>
            </ScrollView>

            <PageFooter>
                <View style={{ flex: 0.5 }} >
                    <Text style={[globalStyles.textsMenu, { textAlign: 'center' }]}>{`Total: R$ ${order?.total.toFixed(2).replace('.', ',')}`}</Text>
                </View>

                <View style={{ flex: 0.5 }} >
                    <Buttons disabled={selectedAddress && selectedDeliveryGroup ? false : true} title="Avançar" onPress={handleOrdertoPayment} />
                </View>
            </PageFooter>
        </>
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

    mapContainer: {
        height: '100%',
        width: '100%',
    },
});