import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { StoreContext } from '../../context/storeContext';
import { AuthContext } from '../../context/authContext';
import { ContextOrdering } from '../../context/orderingContext';

import { Store } from '../../components/Store';
import Highlights from '../../components/Highlights';
import OrderItems from '../../components/OrderItems';
import Header from '../../components/PageHeader';
import PageFooter from '../../components/PageFooter';
import WaitingModal, { statusModal } from '../../components/Interfaces/WaitingModal';

import api from '../../services/api';

import globalStyles, { colorPrimaryDark } from '../../assets/styles/global';
import emptyCart from '../../assets/images/empty-cart.png';
import { Category } from '../../components/Categories';

interface NotAvailableProduct {
    name: string;
}

export default function Cart() {
    const { store, handleStore } = useContext(StoreContext);
    const { customer } = useContext(AuthContext);
    const { order, handleOrder } = useContext(ContextOrdering);
    const navigation = useNavigation();

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    async function handleOrdertoShipment() {
        if (store && order) {
            setModalWaiting("waiting");

            try {
                if (order.sub_total < store.min_order) {
                    setModalWaiting("error");
                    setErrorMessage(`O pedido mínimo é de R$ ${Number(store.min_order).toFixed(2).replace('.', ',')}.`);
                    return;
                }

                const resStore = await api.get('store');

                const resCategories = await api.get('categories');
                
                const updatedCategories: Category[] = resCategories.data;

                const updatedStore: Store = { ...resStore.data, categories: updatedCategories };

                let notAvailableProducts: NotAvailableProduct[] = [];

                order.orderItems.forEach(orderItem => {
                    let foundItem = false;

                    updatedStore.categories.forEach(category => {
                        const foundProduct = category.products.find(product => { return product.id === orderItem.product_id });

                        if (foundProduct) {
                            orderItem.orderItemAdditionals.forEach(itemAdditional => {
                                foundProduct.categoriesAdditional.forEach(categoryAdditional => {
                                    const foundAdditional = categoryAdditional.productAdditional.find(productAdditional => {
                                        return productAdditional.additional.id === itemAdditional.additional_id
                                    });

                                    if (!foundAdditional) notAvailableProducts.push({
                                        name: `Adicional ${itemAdditional.name} no produto ${foundProduct.title}`
                                    });
                                });
                            });

                            foundItem = true;
                            return;
                        }
                    });

                    if (!foundItem) notAvailableProducts.push({ name: orderItem.name });
                });

                if (notAvailableProducts.length > 0) {
                    setModalWaiting("error");
                    setErrorMessage(
                        `Infelizmente os seguintes itens acabaram de sair do estoque:\n ${notAvailableProducts.map((item, index) => {
                            return `${index > 8 ? index + 1 : `0${index + 1}`} - ${item.name}\n`
                        })}`
                    );
                    return;
                }

                handleStore(updatedStore);
                handleOrder(order);

                setTimeout(() => {
                    setModalWaiting("hidden");

                    if (customer)
                        navigation.navigate('Shipment');
                    else
                        navigation.navigate('Profile');
                }, 1500);
            }
            catch {
                setModalWaiting("error");
                setErrorMessage("Erro de conexão! Por favor, verifique a sua conexão com a internet.");
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
                            store && store.productsHighlights.length > 0 && <View style={{ flex: 1, backgroundColor: 'white', marginVertical: 20 }}>
                                <Text style={globalStyles.titlePrimaryLight}>{store.highlights_title}</Text>

                                <View style={{ height: 200, marginTop: 20 }}>
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {
                                            store.productsHighlights.map((highlight, index) => {
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