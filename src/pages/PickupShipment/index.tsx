import React, { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

import { RestaurantContext } from '../../context/restaurantContext';
import { ContextOrdering } from '../../context/orderingContext';

import PageFooter from '../../components/PageFooter';

import globalStyles, { colorPrimaryDark, colorBackground } from '../../assets/styles/global';
import pickupShipment from '../../assets/images/successful_purchase.png';

export default function PickupShipment() {
    const navigation = useNavigation();

    const { restaurant } = useContext(RestaurantContext);
    const { order, handleOrder, handleTotalOrder } = useContext(ContextOrdering);

    useEffect(() => {
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
                    delivery_type: 'pickup'
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
                        </View>
                    </View>
                </View>
            </View>
            <ScrollView style={globalStyles.container}>
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
                            region={{
                                latitude: Number(restaurant?.latitude),
                                longitude: Number(restaurant?.longitude),
                                latitudeDelta: 0.008,
                                longitudeDelta: 0.008
                            }}
                        >
                            <Marker
                                icon={restaurant ? restaurant.avatar : pickupShipment}
                                style={{ width: 15, height: 15 }}
                                coordinate={{
                                    latitude: Number(restaurant?.latitude),
                                    longitude: Number(restaurant?.longitude),
                                }}
                                title={restaurant?.title}
                                description={restaurant?.description}
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
                        <Text style={globalStyles.textDescription}>{`Telefone: ${restaurant?.phone}`}</Text>
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