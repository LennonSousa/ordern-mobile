import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CustomerContext } from '../../context/customerContext';
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
    const { customer } = useContext(CustomerContext);
    const { handleCategories } = useContext(CategoriesContext);
    const { order, handleOrder, handleTotalOrder } = useContext(ContextOrdering);
    const navigation = useNavigation();

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (order) {
            handleTotalOrder(
                {
                    ...order,
                    delivery_tax: 0
                }
            );
        }
    }, []);

    async function handleOrdertoShipment() {
        if (order) {
            setModalWaiting("waiting");
            
            try {
                const res = await api.get('categories');

                handleCategories(res.data);
                const categories: Category[] = res.data;

                let notAvailableProducts: NotAvailableProduct[] = [];

                categories.forEach(category => {
                    category.products.forEach(product => {
                        const productFound = order.orderItems.find(orderItem => { return orderItem.additional_item === product.id });

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
                    handleOrder(
                        {
                            ...order,
                            tracker: `${Date.now()}${order.total.toFixed(2).replace('.', '').replace(',', '')}`
                        }
                    );

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
                                return <OrderItems key={item.id} orderItem={item} />
                            })
                        }
                    </View>

                    <View style={globalStyles.row}>
                        <View style={globalStyles.column}>
                            <Text style={globalStyles.textsMenu}>{`Taxa de engreta: R$ ${Number(order.delivery_tax).toFixed(2).replace('.', ',')}`}</Text>
                        </View>
                    </View>

                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <WaitingModal message={errorMessage} status={modalWaiting} />
                    </View>
                </ScrollView> : <View style={globalStyles.container}>
                        <View style={[globalStyles.row, { marginVertical: 0 }]}>
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
                    </View>

            }

            {
                order && <PageFooter>
                    <View style={{ flex: 0.5 }} >
                        <Text style={[globalStyles.textsMenu, { textAlign: 'center' }]}>{`Total: R$ ${order?.total.toFixed(2).replace('.', ',')}`}</Text>
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
            height: `${(22 * Dimensions.get('window').width) / 100}%`,
            resizeMode: 'contain'
        }
    }
)