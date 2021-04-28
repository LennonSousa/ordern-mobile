import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, Platform, Linking } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { format } from 'date-fns';

import api from '../../services/api';
import { AuthContext } from '../../context/authContext';
import { StoreContext } from '../../context/storeContext';
import { ContextOrdering } from '../../context/orderingContext';
import { StoreShipments } from '../../components/StoreShipments';
import PageFooter from '../../components/PageFooter';

import globalStyles, { colorPrimaryDark, colorPrimaryLight } from '../../assets/styles/global';

export default function PickupShipment() {
    const navigation = useNavigation();

    const { customer } = useContext(AuthContext);
    const { store } = useContext(StoreContext);
    const { order, handleOrder, handleTotalOrder } = useContext(ContextOrdering);
    const [pickupShipmentEstimated, setPickupShipmentEstimated] = useState(30);

    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${store?.latitude},${store?.longitude}`;
    const label = store?.title;
    const urlLocation = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
    });

    useEffect(() => {
        if (customer) {
            api.get(`customer/${customer.id}/store/shipments`)
                .then(res => {
                    const storeShipments: StoreShipments[] = res.data;

                    if (storeShipments && storeShipments.length > 0) {
                        const pickupShipment = storeShipments.find(shipment => { return shipment.code === 'pickup' });

                        pickupShipment && setPickupShipmentEstimated(pickupShipment.default_price);
                    }
                })
                .catch(() => {
                    console.log('Error to get store shipments');
                });
        }

        if (order) {
            handleTotalOrder(
                {
                    ...order,
                    delivery_tax: 0,
                    delivery_type: 'pickup'
                }
            );
        }
    }, []);

    function handleOrdertoPayment() {
        if (order) {
            handleOrder(
                {
                    ...order,
                    tracker: `${format(new Date(), 'ssmmddHHMM')}${order.total.toFixed(2).replace('.', '').replace(',', '')}`,
                    address: 'Retirar no local.',
                    delivery_tax: 0,
                    delivery_type: 'pickup',
                    delivery_estimated: pickupShipmentEstimated,
                }
            );

            navigation.navigate('OrderReview');
        }
    }

    return (
        <>
            <ScrollView style={globalStyles.container}>
                <View style={globalStyles.fieldsRow}>
                    <View style={globalStyles.fieldsColumn}>
                        <View style={globalStyles.menuRow}>
                            <View style={globalStyles.menuColumn}>
                                <Text style={globalStyles.textsMenu}>Nosso endereço</Text>
                            </View>
                            <View style={globalStyles.menuIconColumn}>
                                <Feather name="map-pin" size={24} color={colorPrimaryLight} />
                            </View>
                        </View>

                        <View style={globalStyles.menuRow}>
                            <View style={{ flex: 1 }}>
                                <View style={globalStyles.menuDescriptionColumn}>
                                    <Text style={globalStyles.textDescription}>{`${store?.street}, ${store?.number}`}</Text>
                                    <Text style={globalStyles.textDescription}>{store?.complement}</Text>
                                    <Text style={globalStyles.textDescription}>{`${store?.group}`}</Text>
                                    <Text style={globalStyles.textDescription}>{`${store?.city} - ${store?.state}`}</Text>
                                    <Text style={globalStyles.textDescription}>{`CEP: ${store?.zip_code}`}</Text>
                                    <Text style={globalStyles.textDescription}>{`Telefone: ${store?.phone}`}</Text>
                                    <Text style={globalStyles.textDescription}>{`Tempo estimado:\n ${pickupShipmentEstimated} minutos`}</Text>
                                </View>
                            </View>

                            <View style={{ flex: 1 }}>
                                <BorderlessButton onPress={() => { urlLocation && Linking.openURL(urlLocation); }}>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <FontAwesome5
                                                style={{ textAlign: 'center' }}
                                                name="map-marked-alt"
                                                size={20}
                                                color={colorPrimaryLight}
                                            />
                                        </View>
                                    </View>
                                    <View style={[globalStyles.menuRow, { justifyContent: 'center' }]}>
                                        <View style={globalStyles.column}>
                                            <Text
                                                style={[globalStyles.textDescription, { textAlign: 'center', fontSize: 12 }]}
                                            >
                                                Abrir no mapa <Feather name="chevron-right" size={12} color={colorPrimaryLight} />
                                            </Text>
                                        </View>
                                    </View>
                                </BorderlessButton>
                            </View>

                        </View>

                    </View>
                </View>
            </ScrollView>

            <PageFooter>
                <View style={{ flex: 0.5 }} >
                    <Text style={[globalStyles.textsMenu, { textAlign: 'center' }]}>{`Total: R$ ${order?.total.toFixed(2).replace('.', ',')}`}</Text>
                </View>

                <View style={{ flex: 0.5 }} >
                    <TouchableHighlight
                        underlayColor={colorPrimaryDark}
                        style={globalStyles.footerButton}
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
    mapContainer: {
        height: '100%',
        width: '100%',
    },
});