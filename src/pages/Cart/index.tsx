import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { RestaurantContext } from '../../context/restaurantContext';
import { HighlightsContext } from '../../context/highlightsContext';
import Highlights from '../../components/Highlights';
import { OpenedDaysContext } from '../../context/openedDaysContext';
import { AuthContext } from '../../context/authContext';
import { CategoriesContext } from '../../context/categoriesContext';
import { ContextOrdering } from '../../context/orderingContext';
import { Category } from '../../components/Categories';
import OrderItems from '../../components/OrderItems';
import Header from '../../components/PageHeader';
import PageFooter from '../../components/PageFooter';
import VerifyProductAvailable from '../../utils/verifyProductAvailable';
import WaitingModal, { statusModal } from '../../components/Interfaces/WaitingModal';

import api from '../../services/api';

import globalStyles, { colorPrimaryDark } from '../../assets/styles/global';
import emptyCart from '../../assets/images/empty-cart.png';

interface NotAvailableProduct {
    name: string;
}

export default function Cart() {
    const { restaurant } = useContext(RestaurantContext);
    const { highlights } = useContext(HighlightsContext);
    const { isOpened } = useContext(OpenedDaysContext);
    const { customer } = useContext(AuthContext);
    const { handleCategories } = useContext(CategoriesContext);
    const { order, handleOrder } = useContext(ContextOrdering);
    const navigation = useNavigation();

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    async function handleOrdertoShipment() {
        if (restaurant && isOpened && order) {
            if (order.sub_total >= restaurant.min_order) {
                setModalWaiting("waiting");

                try {
                    const res = await api.get('categories');

                    handleCategories(res.data);
                    const categories: Category[] = res.data;

                    let notAvailableProducts: NotAvailableProduct[] = [];

                    categories.forEach(category => {
                        category.products.forEach(product => {
                            const productFound = order.orderItems.find(orderItem => { return orderItem.product_id === product.id });

                            if (productFound) {
                                const verify = VerifyProductAvailable(product);

                                console.log(productFound.name, verify);

                                if (verify === "paused")
                                    notAvailableProducts.push({ name: productFound.name });
                                else if (verify === "not-available") {
                                    notAvailableProducts.push({ name: productFound.name });
                                }
                            }
                        });
                    });

                    if (notAvailableProducts.length > 0) {
                        setTimeout(() => {
                            setModalWaiting("error");
                            setErrorMessage(`Infelizmente os seguintes itens acabaram de sair do estoque:${notAvailableProducts.map(item => { return ` ${item.name}\n` })}`);

                            return;
                        }, 1500);
                    }
                    else {
                        handleOrder(order);

                        setTimeout(() => {
                            setModalWaiting("hidden");

                            if (customer)
                                navigation.navigate('Shipment');
                            else
                                navigation.navigate('Profile');
                        }, 1500);
                    }
                }
                catch {
                    setModalWaiting("error");
                    setErrorMessage("Por favor, verifique a sua conexão com a internet.");
                }
            }
            else {
                setModalWaiting("error");
                setErrorMessage(`Desculpe, o pedido mínimo é de R$ ${Number(restaurant.min_order).toFixed(2).replace('.', ',')}.`);
            }
        }
    }

    return (
        <>
            <Header title="Sacola" showGoBack={false} showCancel={false} showClearBag={order ? true : false} />
            {
                order ? <ScrollView style={globalStyles.container}>
                    <View>
                        <Text style={globalStyles.titlePrimaryLight}>Itens</Text>
                        {
                            order.orderItems.map(item => {
                                return <OrderItems key={item.id} orderItem={item} canEdit />
                            })
                        }
                    </View>

                    {
                        order.delivery_tax > 0 && <View style={globalStyles.row}>
                            <View style={globalStyles.column}>
                                <Text style={globalStyles.textsMenu}>{`Taxa de entrega: R$ ${Number(order.delivery_tax).toFixed(2).replace('.', ',')}`}</Text>
                            </View>
                        </View>
                    }

                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <WaitingModal message={errorMessage} status={modalWaiting} />
                    </View>
                </ScrollView> : <ScrollView style={globalStyles.container}>
                    <View style={[globalStyles.row, { marginVertical: 0, height: 200 }]}>
                        <View style={[globalStyles.column, { alignItems: 'center' }]}>
                            <Image source={emptyCart} style={styles.imageEmptyCart} />
                        </View>
                    </View>
                    <View style={[globalStyles.row, { marginVertical: 0 }]}>
                        <View style={[globalStyles.column, { alignItems: 'center' }]}>
                            <Text style={globalStyles.titlePrimaryLight}>Sacola vazia!</Text>
                            <Text style={globalStyles.textDescription}>Aproveite e adicione items para comprar.</Text>
                        </View>
                    </View>


                    <View style={[globalStyles.row, { marginVertical: 0 }]}>
                        {
                            restaurant && restaurant.highlights && highlights && highlights.length > 0 && <View style={{ flex: 1, backgroundColor: 'white', marginVertical: 20 }}>
                                <Text style={globalStyles.titlePrimaryLight}>{restaurant.highlights_title}</Text>

                                <View style={{ height: 200, marginTop: 20 }}>
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {
                                            highlights && highlights.map((highlight, index) => {
                                                return <Highlights key={index} highlight={highlight} />
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            </View>
                        }
                    </View>

                </ScrollView>

            }

            {
                order && <PageFooter>
                    <View style={{ flex: 0.5 }} >
                        <Text style={[globalStyles.textsMenu, { textAlign: 'center' }]}>{`Total: R$ ${order?.sub_total.toFixed(2).replace('.', ',')}`}</Text>
                    </View>

                    <View style={{ flex: 0.5 }} >
                        <TouchableHighlight
                            underlayColor={colorPrimaryDark}
                            style={globalStyles.footerButton}
                            disabled={order ? false : true}
                            onPress={handleOrdertoShipment}
                        >
                            <Text style={globalStyles.footerButtonText}>Avançar</Text>
                        </TouchableHighlight>
                    </View>
                </PageFooter>
            }
        </>
    )
}

const styles = StyleSheet.create(
    {
        imageEmptyCart: {
            height: '75%',
            resizeMode: 'contain'
        },
    });