import React, { useContext, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import { Product } from '../../components/Products';
import { ProductCategory } from '../../components/ProductCategories';
import { ContextSelectedProduct } from '../../context/selectedProductContext';
import { ContextOrdering } from '../../context/orderingContext';
import ProductValues from '../../components/ProductValues';

interface ProductDetailsRouteParams {
    product: Product;
}

export default function ProductDetails() {
    const route = useRoute();
    const navigation = useNavigation();

    const [product, setProduct] = useState<Product>();

    const params = route.params as ProductDetailsRouteParams;

    const { selectedProduct, handleSelectedProduct } = useContext(ContextSelectedProduct);
    const { order, handleOrder } = useContext(ContextOrdering);

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

    function handleAddProductToCart() {
        if (product && selectedProduct) {
            let itemsToOrder = {
                id: order ? order.orderItems.length : 0,
                amount: selectedProduct.amount,
                name: product.title,
                value: selectedProduct.price,
                additional: false,
                additional_item: 0,
                additionals: [{
                    id: 0,
                    amount: 1,
                    name: "",
                    value: 0,
                    additional: true,
                    additional_item: 0,
                    additionals: []
                }]
            };

            itemsToOrder.additionals = [];

            selectedProduct.categoiesAdditional.forEach(category => {
                category.selectedAdditionals.forEach(additional => {
                    itemsToOrder.additionals.push({
                        id: itemsToOrder.additionals.length,
                        amount: 1,
                        name: additional.title,
                        value: additional.price,
                        additional: true,
                        additional_item: itemsToOrder.id,
                        additionals: []
                    });
                });
            });

            if (order) {
                handleOrder({
                    ...order, orderItems: [...order.orderItems, itemsToOrder]
                });
            }
            else {
                handleOrder({
                    id: 0,
                    client_id: 0,
                    client: '',
                    ordered: new Date(),
                    delivery: new Date(),
                    delivered: new Date(),
                    sub_total: 0,
                    cupom: '',
                    delivery_tax: 0,
                    fee: 0,
                    total: 0,
                    payment: '',
                    address: '',
                    reason_cancellation: '',
                    orderStatus: '',
                    orderItems: [itemsToOrder],
                });
            }

            navigation.navigate('Cart');
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
                                <Text style={styles.productPrice}>{`R$ ${product.price.toString().replace('.', ',')}`}</Text>
                        }

                        {
                            product.discount && <Text style={styles.productPrice}>{`R$ ${product.discount_price.toString().replace('.', ',')}`}</Text>
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

                                    {
                                        categoryAdditional.min > 0 && <View style={styles.rowObrigatory}>
                                            <Text style={styles.obrigatoryTitle}>Obrigatório</Text>
                                        </View>
                                    }

                                    <View style={styles.rowTitleSelectedAdditionals} >
                                        {
                                            selectedProduct.categoiesAdditional.map(category => {
                                                if (categoryAdditional.id === category.id) {
                                                    const additionals = category.selectedAdditionals.map(additional => {
                                                        return additional;
                                                    });

                                                    return additionals && additionals.map(item => {
                                                        return <Text key={item.id} style={styles.selectedAdditionals}>{item.title}</Text>
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
        fontSize: 16,
        color: '#00b300'
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
        backgroundColor: '#8c8c8c',
        borderRadius: 5,
        textAlign: 'center'
    },

    rowTitleSelectedAdditionals: {
        paddingHorizontal: 20
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