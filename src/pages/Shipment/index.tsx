import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, Switch, View, TouchableHighlight, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';

import { RestaurantContext } from '../../context/restaurantContext';
import { CustomerContext } from '../../context/customerContext';
import { ContextOrdering } from '../../context/orderingContext';
import { CustomerAddress } from '../../components/CustomerAddress';
import { RestaurantDeliveryGroups } from '../../components/DeliveryGroups';

import PageFooter from '../../components/PageFooter';
import WaitingModal, { statusModal } from '../../components/Interfaces/WaitingModal';

import api from '../../services/api';

import globalStyles, { colorPrimaryLight, colorPrimaryDark, colorBackground } from '../../assets/styles/global';
import pickupShipment from '../../assets/images/successful_purchase.png';

export default function Shipment() {
    const navigation = useNavigation();

    const { restaurant } = useContext(RestaurantContext);
    const { customer } = useContext(CustomerContext);
    const { order, handleOrder, handleTotalOrder } = useContext(ContextOrdering);

    const [isPickup, setIsPickup] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<CustomerAddress>();
    const [restaurantDeliveryGroups, setRestaurantDeliveryGroups] = useState<RestaurantDeliveryGroups[]>([]);
    const [selectedDeliveryGroup, setSelectedDeliveryGroup] = useState<RestaurantDeliveryGroups>();

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setModalWaiting("waiting");

        api.get('restaurant/delivery-groups').then(res => {
            setRestaurantDeliveryGroups(res.data);

            setModalWaiting("hidden");
        })
            .catch(err => {
                console.log(err);

                setModalWaiting("error");
                setErrorMessage("Tivemos um problema, verifique a sua conexão.");
            });

        if (selectedDeliveryGroup)
            handleDeliveryGroup(selectedDeliveryGroup);
    }, []);

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

    function handleToPickupShipment() {
        if (!isPickup && order) {
            handleTotalOrder(
                {
                    ...order,
                    delivery_tax: 0,
                    delivery_type: 'pickup'
                }
            );
        }
        else if (selectedDeliveryGroup)
            handleDeliveryGroup(selectedDeliveryGroup);

        setIsPickup(!isPickup);
    }

    function handleOrdertoPayment() {
        if (order && isPickup) {
            handleOrder(
                {
                    ...order,
                    address: 'Retirar no local.',
                    delivery_tax: 0,
                    delivery_type: 'pickup'
                }
            );

            navigation.navigate('OrderReview');
        }
        else if (order && selectedAddress && selectedDeliveryGroup) {
            handleOrder(
                {
                    ...order,
                    address: `${selectedAddress.street} -  ${selectedAddress.number}\n${selectedAddress.group}\n${selectedAddress.complement}\n${selectedAddress.city} - ${selectedAddress.country}, ${selectedAddress.zip_code}`,
                    delivery_tax: selectedDeliveryGroup.price,
                    delivery_type: selectedDeliveryGroup.description
                }
            );

            navigation.navigate('OrderReview');
        }
    }

    return (
        <>
            <View style={{ backgroundColor: colorBackground, paddingHorizontal: 10 }}>
                <View style={globalStyles.row}>
                    <View style={globalStyles.column}>
                        <View style={globalStyles.menuRow}>
                            <Text style={globalStyles.textsMenu}>Retirar no local</Text>
                            <Switch
                                style={{ marginHorizontal: 15 }}
                                trackColor={{ false: "#767577", true: "#cc0000" }}
                                thumbColor="#f4f3f4"
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={handleToPickupShipment}
                                value={isPickup}
                            />
                        </View>

                    </View>
                </View>
            </View>
            { isPickup ? <ScrollView style={globalStyles.container}>
                <View style={globalStyles.row}>
                    <View style={globalStyles.column}>
                        <View style={globalStyles.menuRow}>
                            <View style={globalStyles.menuColumn}>
                                <Text style={globalStyles.textsMenu}>Retire aqui! </Text>
                            </View>
                            <View style={globalStyles.menuIconColumn}>
                                <Feather name="box" size={24} color="#fe3807" />
                            </View>
                        </View>
                        <View style={globalStyles.menuDescriptionRow}>
                            <View style={globalStyles.menuDescriptionColumn}>
                                <Text style={globalStyles.textsDescriptionMenu}>
                                    Retire o seu pedido no nosso endereço.
                            </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[globalStyles.row, { marginVertical: 0, width: '100%', height: 250 }]}>
                    <View style={[globalStyles.column, { alignItems: 'center' }]}>
                        <MapView
                            style={styles.mapContainer}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: -5.4984682505722775,
                                longitude: -47.477012644130255,
                                latitudeDelta: 0.008,
                                longitudeDelta: 0.008
                            }}
                        >
                            <Marker
                                icon={restaurant ? restaurant.avatar : pickupShipment}
                                style={{ width: 15, height: 15 }}
                                coordinate={{
                                    latitude: -5.4984682505722775,
                                    longitude: -47.477012644130255,
                                }}
                            >
                                <Callout tooltip>
                                    <View>
                                        <Text>Oi</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        </MapView>
                    </View>
                </View>
                <View style={[globalStyles.row, { marginTop: 0, marginBottom: 10 }]}>
                    <View style={[globalStyles.column, { alignItems: 'center' }]}>
                        <Text style={globalStyles.titlePrimaryLight}>Nosso endereço</Text>
                        <Text style={globalStyles.textDescription}>{`${restaurant?.street}, ${restaurant?.number}`}</Text>
                        <Text style={globalStyles.textDescription}>{`${restaurant?.group} - CEP: ${restaurant?.zip_code}`}</Text>
                        <Text style={globalStyles.textDescription}>{`${restaurant?.city} - ${restaurant?.country}`}</Text>
                    </View>
                </View>
            </ScrollView> :
                <ScrollView style={globalStyles.container}>
                    <View style={globalStyles.row}>
                        <View style={globalStyles.column}>
                            <View style={globalStyles.menuRow}>
                                <View style={globalStyles.menuColumn}>
                                    <Text style={globalStyles.textsMenu}>Entrega</Text>
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

                    <View style={globalStyles.containerMenu}>
                        {
                            customer && customer.address && customer.address.map((address, index) => {
                                return <View key={index} style={globalStyles.containerItem}>
                                    <View style={globalStyles.row}>
                                        <View style={globalStyles.column}>
                                            <View style={globalStyles.menuRow}>
                                                <View style={globalStyles.colTitleButtonItem}>
                                                    <BorderlessButton
                                                        onPress={() => { setSelectedAddress(address) }}
                                                    >
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
                                                    <BorderlessButton onPress={() => { handleDeliveryGroup(deliveryGroup) }}>
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
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <WaitingModal message={errorMessage} status={modalWaiting} />
                    </View>
                </ScrollView>
            }

            <PageFooter>
                <View style={{ flex: 0.5 }} >
                    <Text style={[globalStyles.textsMenu, { textAlign: 'center' }]}>{`Total: R$ ${order?.total.toFixed(2).replace('.', ',')}`}</Text>
                </View>

                <View style={{ flex: 0.5 }} >
                    <TouchableHighlight
                        underlayColor={colorPrimaryDark}
                        style={globalStyles.footerButton}
                        disabled={selectedAddress && selectedDeliveryGroup || isPickup ? false : true}
                        onPress={handleOrdertoPayment}
                    >
                        <Text style={globalStyles.footerButtonText}>Avançar</Text>
                    </TouchableHighlight>
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