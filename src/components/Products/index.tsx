import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, View, TouchableHighlight } from 'react-native';

import { Category } from '../Categories';
import { ProductImage } from '../ProductImages';
import { ProductValue } from '../ProductValues';
import { ProductCategory } from '../ProductCategories';
import { ProductAvailable } from '../ProductAvailables';

import { colorHighLight } from '../../assets/styles/global';

export interface Product {
    id: string;
    title: string;
    description: string;
    maiority: boolean;
    code: string;
    price_one: boolean;
    price: number;
    discount: boolean;
    discount_price: number;
    paused: boolean;
    order: number;
    available_all: boolean;
    on_request: boolean;
    category: Category;
    images: ProductImage[];
    values: ProductValue[];
    categoriesAdditional: ProductCategory[];
    availables: ProductAvailable[];
}

interface ProductProps {
    product: Product;
}

export default function Products({ product }: ProductProps) {
    const navigation = useNavigation();

    function handleNavigateToProductDetails(productObject: Product) {
        navigation.navigate('ProductDetails', { product: productObject });
    }

    return (
        <View style={styles.productContainer} >
            <TouchableHighlight style={styles.button} underlayColor='#e6e6e6' onPress={() => { handleNavigateToProductDetails(product) }}>
                <View style={styles.productRow} >
                    <View style={styles.productCol}>
                        <View style={styles.rowTop}>
                            <View style={styles.productColTexts}>
                                <Text style={styles.productTitle}>{product.title}</Text>
                                <Text style={styles.productDescription}>{product.description}</Text>
                            </View>
                            <View style={styles.productColImage}>
                                <Image source={{ uri: product.images[0].path }} style={styles.productImage} />
                            </View>
                        </View>

                        <View style={styles.rowBase}>
                            {
                                product.discount ?
                                    <Text style={styles.productPriceDiscount}>
                                        {`R$ ${product.price_one ?
                                            product.price.toString().replace('.', ',') :
                                            product.values.length > 0 ? product.values[0].value.toString().replace('.', ',') : '0,00'}`}
                                    </Text> :
                                    <Text style={[styles.productPrice, { color: colorHighLight }]}>
                                        {`R$ ${product.price_one ?
                                            product.price.toString().replace('.', ',') :
                                            product.values.length > 0 ? product.values[0].value.toString().replace('.', ',') : '0,00'}`}
                                    </Text>
                            }
                            {
                                product.discount &&
                                <Text style={[styles.productPrice, { color: colorHighLight }]}>
                                    {`R$ ${product.discount_price.toString().replace('.', ',')}`}
                                </Text>
                            }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    productContainer: {
        flex: 1,
        borderColor: '#e6e6e6',
        borderTopWidth: 1,
        borderRadius: 5,
    },

    button: {
        alignItems: "center",
    },

    productRow: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 20,
        overflow: 'hidden',
    },

    productCol: {
        flex: 1,
    },

    rowTop: {
        flexDirection: 'row',
    },

    rowBase: {
        flexDirection: 'row',
        paddingHorizontal: 5
    },

    productColTexts: {
        flex: 0.7,
        padding: 5
    },

    productColImage: {
        flex: 0.3,
    },

    productTitle: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
        color: '#262626'
    },

    productDescription: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 13,
        color: '#8c8c8c'
    },

    productImage: {
        width: 75,
        height: 75,
        resizeMode: 'cover',
        borderRadius: 10
    },

    productPrice: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16
    },

    productPriceDiscount: {
        fontFamily: 'Nunito_300Light_Italic',
        textDecorationLine: 'line-through',
        fontSize: 13,
        marginRight: 5
    }
});