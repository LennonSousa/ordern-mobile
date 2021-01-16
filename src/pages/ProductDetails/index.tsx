import React, { useContext, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import { Category } from '../../components/Categories';
import { Product } from '../../components/Products';
import { ProductCategory } from '../../components/ProductCategories';
import { SelectedProductContext } from '../../context/selectedProductContext';
import { CategoriesContext } from '../../context/categoriesContext';
import { ContextOrdering } from '../../context/orderingContext';
import ProductValues from '../../components/ProductValues';
import verifyProductAvailable from '../../utils/verifyProductAvailable';
import WaitingModal, { statusModal } from '../../components/Interfaces/WaitingModal';

import api from '../../services/api';

import { colorHighLight, colorPrimaryLight, colorTextMenuDescription } from '../../assets/styles/global';
import { OrderItem } from '../../components/OrderItems';
import _ from 'lodash';

interface ProductDetailsRouteParams {
    product: Product;
}

export default function ProductDetails() {
    const route = useRoute();
    const navigation = useNavigation();

    const { handleCategories } = useContext(CategoriesContext);
    const { selectedProduct, handleSelectedProduct } = useContext(SelectedProductContext);
    const { order, handleTotalOrder } = useContext(ContextOrdering);

    const [product, setProduct] = useState<Product>();

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    const params = route.params as ProductDetailsRouteParams;

    useEffect(() => {
        if (params.product) {
            navigation.setOptions({ title: params.product.title });
            setProduct(params.product);

            handleSelectedProduct({
                id: params.product.id,
                price_one: params.product.price_one,
                price: params.product.price_one ? params.product.discount ? params.product.discount_price : params.product.price : 0,
                values: params.product.values,
                selectedValue: undefined,
                amount: 1,
                total: params.product.price_one ? params.product.discount ? params.product.discount_price : params.product.price : 0,
                categoiesAdditional: params.product.categoriesAdditional.map(category => {
                    return {
                        id: category.id,
                        min: category.min,
                        max: category.max,
                        selectedAdditionals: []
                    }
                })
            });
        }
    }, [params.product]);

    function handleNavigateToCategoryAdditionals(categoryAdditional: ProductCategory) {
        navigation.navigate('CategoryAdditionals', { productCategory: categoryAdditional });
    }

    function handleAmount(operation: string) {
        if (selectedProduct) {
            if (operation === "plus")
                handleSelectedProduct(
                    {
                        ...selectedProduct,
                        amount: selectedProduct.amount + 1
                    }
                );
            if (operation === "minus" && selectedProduct.amount !== 1)
                handleSelectedProduct(
                    {
                        ...selectedProduct,
                        amount: selectedProduct.amount - 1
                    }
                );
        }
    }

    async function handleAddProductToCart() {
        if (product && selectedProduct) {
            setModalWaiting("waiting");

            const selectedValue = selectedProduct.values.find(item => { return item.id === selectedProduct.selectedValue });

            let itemsToOrder: OrderItem = {
                id: 0,
                amount: selectedProduct.amount,
                name: `${product.title} - ${!product.price_one && selectedValue ? selectedValue.description : ''} (${product.category.title})`,
                value: selectedProduct.price,
                product_id: product.id,
                orderItemAdditionals: [{
                    id: 0,
                    amount: 1,
                    name: "",
                    value: 0,
                    additional_id: 0,
                }]
            };

            itemsToOrder.orderItemAdditionals = [];

            selectedProduct.categoiesAdditional.forEach(category => {
                category.selectedAdditionals.forEach(additional => {
                    itemsToOrder.orderItemAdditionals.push({
                        id: itemsToOrder.orderItemAdditionals.length,
                        amount: additional.amount,
                        name: additional.title,
                        value: additional.price,
                        additional_id: additional.additional_id
                    });
                });
            });

            if (order) {
                let identicFound = false;

                if (order.orderItems.length > 0) {
                    console.log('function findOne');

                    order.orderItems.forEach((listItem: OrderItem) => { // Searching for each one.
                        if (itemsToOrder.product_id === listItem.product_id) {
                            if (!selectedProduct.price_one) {

                                if (listItem.name !== itemsToOrder.name)
                                    return;
                            }

                            if (itemsToOrder.orderItemAdditionals.length === 0 && listItem.orderItemAdditionals.length === 0) { // No addiciontals, means that are identicals.
                                identicFound = true;

                                console.log('Idêntico!');

                                handleTotalOrder(
                                    {
                                        ...order, orderItems: order.orderItems.map((item, index) => {
                                            if (index === listItem.id) {
                                                return {
                                                    ...item, amount: item.amount + selectedProduct.amount
                                                };
                                            }

                                            return item;
                                        })
                                    }
                                );

                                setTimeout(() => {
                                    setModalWaiting("hidden");

                                    navigation.navigate('Cart');
                                }, 1000);
                            }
                            else if (itemsToOrder.orderItemAdditionals.length === listItem.orderItemAdditionals.length) { // Same additionals amount.
                                let allAdditionalsIdentcials = true;

                                itemsToOrder.orderItemAdditionals.forEach(additionalToOrder => {
                                    const itemFound = listItem.orderItemAdditionals.find(orderItemAdditionals => {
                                        return additionalToOrder.additional_id === orderItemAdditionals.additional_id
                                    });

                                    console.log('itemFound: ', itemFound);

                                    if (!itemFound)
                                        allAdditionalsIdentcials = false;

                                    if (!allAdditionalsIdentcials)
                                        return;
                                });

                                if (allAdditionalsIdentcials) {
                                    identicFound = true;

                                    console.log('Idêntico com adicionais!');

                                    handleTotalOrder(
                                        {
                                            ...order, orderItems: order.orderItems.map((item, index) => {
                                                if (index === listItem.id) {
                                                    return {
                                                        ...item, amount: item.amount + selectedProduct.amount
                                                    };
                                                }

                                                return item;
                                            })
                                        }
                                    );

                                    setTimeout(() => {
                                        setModalWaiting("hidden");

                                        navigation.navigate('Cart');
                                    }, 1000);
                                }
                            }
                        }
                    });
                }

                if (!identicFound) {
                    // Not identic product on cart, create a new.
                    try {
                        const res = await api.get('categories');

                        handleCategories(res.data);
                        const categories: Category[] = res.data;

                        categories.forEach(category => {
                            category.products.forEach(productItem => {
                                if (productItem.id === product.id) {
                                    const verify = verifyProductAvailable(productItem);

                                    if (verify === "paused") {
                                        setModalWaiting("error");
                                        setErrorMessage("Desculpe, mas esse produto acabou de ficar sem estoque.");

                                        return;
                                    }
                                    else if (verify === "not-available") {
                                        setModalWaiting("error");
                                        setErrorMessage("Desculpe, mas esse produto não está mais disponível nesse horário.");

                                        return;
                                    }

                                    const newItemnsToOrder = [...order.orderItems, itemsToOrder];

                                    handleTotalOrder({
                                        ...order, orderItems: newItemnsToOrder.map((item, index) => {

                                            return { ...item, id: index };
                                        })
                                    });

                                    setTimeout(() => {
                                        setModalWaiting("hidden");

                                        navigation.navigate('Cart');
                                    }, 1000);
                                }
                            });
                        });
                    }
                    catch {
                        setModalWaiting("error");
                        setErrorMessage("Por favor, verifique a sua conexão com a internet.");
                    }
                }
            }
            else {
                // Empity cart, create a new product on cart.
                handleTotalOrder({
                    id: 0,
                    tracker: '',
                    client_id: 0,
                    client: '',
                    ordered: new Date(),
                    delivery: new Date(),
                    delivered: new Date(),
                    sub_total: 0,
                    cupom: '',
                    delivery_tax: 0,
                    delivery_type: '',
                    discount: 0,
                    fee: 0,
                    total: 0,
                    payment: '',
                    paid: false,
                    address: '',
                    reason_cancellation: '',
                    orderStatus: {
                        id: 1,
                        title: '',
                        description: '',
                        order: 0,
                    },
                    orderItems: [itemsToOrder],
                });

                setTimeout(() => {
                    setModalWaiting("hidden");

                    navigation.navigate('Cart');
                }, 1000);
            }
        }
    }

    return (
        <>
            {
                product && selectedProduct && <ScrollView style={styles.container}>
                    <View style={styles.containerCover}>
                        <ImageBackground source={{ uri: product.image }} style={styles.cover} />
                    </View>

                    <View>
                        <Text style={styles.productTitle}>{product.title}</Text>
                        <Text style={styles.productDescription}>{product.description}</Text>
                    </View>

                    <View style={styles.rowPrice}>
                        {
                            product.discount ? <Text style={styles.productPriceDiscount}>{`R$ ${product.price.toString().replace('.', ',')}`}</Text> :
                                <Text style={[styles.productPrice, { color: colorHighLight }]}>{`R$ ${product.price.toString().replace('.', ',')}`}</Text>
                        }

                        {
                            product.discount && <Text style={[styles.productPrice, { color: colorHighLight }]}>{`R$ ${product.discount_price.toString().replace('.', ',')}`}</Text>
                        }
                    </View>

                    {
                        !product.price_one && <View style={styles.productValuesContainer}>
                            <Text style={styles.categoryAdditionalTitle} >Escolha uma opção:</Text>
                            {
                                product.values.map(value => {
                                    return <View key={value.id}>
                                        <ProductValues productValue={value} />
                                    </View>
                                })
                            }
                        </View>
                    }

                    {
                        product && product.categoriesAdditional.map(categoryAdditional => {
                            return (
                                <View key={categoryAdditional.id} style={styles.containerAdditionals}>
                                    <View style={styles.rowAdditionals}>
                                        <TouchableHighlight
                                            underlayColor='#e6e6e6'
                                            onPress={() => { handleNavigateToCategoryAdditionals(categoryAdditional) }}>
                                            <View style={styles.rowTitleCategoryAdditionals}>
                                                <Text style={styles.categoryAdditionalTitle}>{categoryAdditional.title}</Text>
                                                <Feather name="chevron-right" style={styles.categoryAdditionalArrow} />
                                            </View>
                                        </TouchableHighlight>
                                    </View>

                                    <View style={styles.rowObrigatory}>
                                        <Text
                                            style={[styles.obrigatoryTitle, { backgroundColor: categoryAdditional.min > 0 ? colorPrimaryLight : colorTextMenuDescription }]}
                                        >
                                            {categoryAdditional.min > 0 ? "Obrigatório." : "Opcional."}
                                        </Text>
                                    </View>

                                    <View style={styles.rowTitleSelectedAdditionals} >
                                        {
                                            selectedProduct.categoiesAdditional.map(category => {
                                                if (categoryAdditional.id === category.id) {
                                                    const additionals = category.selectedAdditionals.map(additional => {
                                                        return additional;
                                                    });

                                                    return additionals && additionals.map(item => {
                                                        return <View key={item.id} style={{ flexDirection: 'row', marginVertical: 2 }}>
                                                            <Text style={styles.selectedAdditionalsAmount}>{item.amount}</Text>
                                                            <Text style={styles.selectedAdditionals}>{item.title}</Text>
                                                        </View>
                                                    });
                                                }
                                            })
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }

                    {/* Divider*/}
                    <View style={styles.divider}></View>

                    {/* Notes*/}
                    <View style={styles.containerNotes}>
                        <View style={{ flexDirection: 'row' }}>
                            <Feather name="message-square" style={styles.iconNotes} />
                            <Text style={styles.titleNotes}>  Alguma observação?</Text>
                        </View>
                        <TextInput multiline={true} numberOfLines={3} maxLength={140} style={styles.inputNotes} />
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

            {/* Footer*/}
            {
                selectedProduct && <View style={styles.footer}>
                    <View style={styles.footerContainerAmount}>
                        <View style={styles.footerContainerAmountRow}>
                            <View style={styles.footerContainerAmountColumnMinus}>
                                <TouchableOpacity
                                    onPress={() => { handleAmount("minus") }}
                                    disabled={
                                        selectedProduct.amount > 1 ? false : true
                                    }
                                >
                                    <Feather name="minus" style={styles.iconButtons} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.footerContainerAmountColumnValue}>
                                <Text style={styles.iconButtons}>{selectedProduct?.amount}</Text>
                            </View>

                            <View style={styles.footerContainerAmountColumnPlus}>
                                <TouchableOpacity onPress={() => { handleAmount("plus") }}>
                                    <Feather name="plus" style={styles.iconButtons} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footerContainerButton}>
                        <TouchableHighlight
                            underlayColor="#ff0000"
                            onPress={handleAddProductToCart}
                            disabled={selectedProduct.price === 0.00 ? true : false}
                            style={styles.footerButton}
                        >
                            <View style={styles.footerContainerButtonRow}>
                                <View style={styles.footerContainerButtonColumnText}>
                                    <Text style={styles.textButtons}>Adicionar</Text>
                                </View>
                                <View style={styles.footerContainerButtonColumnTotal}>
                                    <Text style={styles.textButtons}>
                                        {`R$ ${selectedProduct && Number(selectedProduct.total).toFixed(2).toString().replace('.', ',')}`}
                                    </Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    containerCover: {
        alignItems: 'center'
    },

    cover: {
        width: Dimensions.get('window').width,
        height: 180,
        alignItems: 'center',
        justifyContent: 'center'
    },

    avatar: {
        width: 75,
        height: 75,
        resizeMode: 'cover',
        borderRadius: 100
    },

    productTitle: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 22,
        color: '#262626',
        paddingHorizontal: 15,
        marginVertical: 5
    },

    productDescription: {
        fontFamily: 'Nunito_300Light',
        fontSize: 16,
        color: '#8c8c8c',
        paddingHorizontal: 20
    },

    rowPrice: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginVertical: 8
    },

    productPrice: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16
    },

    productPriceDiscount: {
        fontFamily: 'Nunito_300Light_Italic',
        textDecorationLine: 'line-through',
        fontSize: 13,
        color: '#8c8c8c',
        marginRight: 5
    },

    productValuesContainer: {
        paddingHorizontal: 15,
        marginVertical: 8
    },

    containerAdditionals: {
        paddingHorizontal: 15,
        marginVertical: 8
    },

    rowAdditionals: {
        flexDirection: 'row',
    },

    rowTitleCategoryAdditionals: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },

    categoryAdditionalTitle: {
        fontFamily: 'Nunito_300Light',
        fontSize: 18,
        color: '#8c8c8c',
    },

    categoryAdditionalArrow: {
        fontSize: 18,
        color: '#8c8c8c',
        paddingLeft: 20
    },

    rowObrigatory: {
        paddingHorizontal: 20,
    },

    obrigatoryTitle: {
        width: 80,
        fontFamily: 'Nunito_300Light_Italic',
        fontSize: 13,
        color: '#fff',
        borderRadius: 5,
        textAlign: 'center'
    },

    rowTitleSelectedAdditionals: {
        paddingHorizontal: 20
    },

    selectedAdditionalsAmount: {
        fontFamily: 'Nunito_300Light_Italic',
        fontSize: 13,
        color: '#ffffff',
        backgroundColor: '#cc0000',
        borderRadius: 5,
        paddingHorizontal: 5,
        marginRight: 5,
    },

    selectedAdditionals: {
        fontFamily: 'Nunito_300Light_Italic',
        fontSize: 13,
        color: '#cc0000'
    },

    divider: {
        borderTopColor: '#e6e6e6',
        borderTopWidth: 1,
        marginHorizontal: 15,
        marginVertical: 15
    },

    containerNotes: {
        marginVertical: 15,
        paddingHorizontal: 15,
    },

    iconNotes: {
        fontFamily: 'Nunito_300Light',
        fontSize: 18,
        color: '#8c8c8c',
    },

    titleNotes: {
        fontFamily: 'Nunito_300Light',
        fontSize: 18,
        color: '#8c8c8c',
    },

    inputNotes: {
        borderColor: '#e6e6e6',
        borderWidth: 1,
        marginTop: 15,
        paddingHorizontal: 10,
        color: '#8c8c8c',
    },

    footer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        height: 70,
        borderTopColor: '#f2f2f2',
        borderTopWidth: 1,
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'space-between'
    },

    footerContainerAmount: {
        flex: 0.4,
        borderColor: '#d9d9d9',
        borderWidth: 1,
        borderRadius: 5
    },

    footerContainerAmountRow: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },

    footerContainerAmountColumnMinus: {
        flex: 0.3,
    },

    footerContainerAmountColumnValue: {
        flex: 0.4,
    },

    footerContainerAmountColumnPlus: {
        flex: 0.3,
    },

    iconButtons: {
        fontFamily: 'Nunito_300Light',
        fontSize: 18,
        color: '#8c8c8c',
        textAlign: 'center'
    },

    footerContainerButton: {
        backgroundColor: '#cc0000',
        flex: 0.5,
        borderRadius: 5
    },

    footerContainerButtonRow: {
        flexDirection: 'row',
    },

    footerButton: {
        paddingVertical: 12,
        alignItems: 'center'
    },

    footerContainerButtonColumnText: {
        flex: 0.5,
    },

    footerContainerButtonColumnTotal: {
        flex: 0.5
    },

    textButtons: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
        color: '#fff',
        textAlign: 'center'
    },
});