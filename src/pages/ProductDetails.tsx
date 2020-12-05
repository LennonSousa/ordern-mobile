import React, { useContext, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import { Product } from '../components/Products';
import { ProductCategory } from '../components/ProductCategories';
import { ContextSelectedProduct } from '../context/selectedProductContext';

interface ProductDetailsRouteParams {
    product: Product;
}

export default function ProductDetails() {
    const route = useRoute();
    const navigation = useNavigation();

    const [product, setProduct] = useState<Product>();

    const params = route.params as ProductDetailsRouteParams;

    const { selectedProduct, handleSelectedProduct } = useContext(ContextSelectedProduct);

    useEffect(() => {
        if (params.product) {
            setProduct(params.product);

            handleSelectedProduct({
                id: params.product.id,
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

    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.containerCover}>
                    <ImageBackground source={{ uri: product?.image }} style={styles.cover} />
                </View>

                <View>
                    <Text style={styles.productTitle}>{product?.title}</Text>
                    <Text style={styles.productDescription}>{product?.description}</Text>
                </View>

                <View style={styles.rowPrice}>

                    {
                        product?.discount ? <Text style={styles.productPriceDiscount}>{`R$ ${product.price.toString().replace('.', ',')}`}</Text> :
                            <Text style={styles.productPrice}>{`R$ ${product?.price.toString().replace('.', ',')}`}</Text>
                    }
                    {
                        product?.discount && <Text style={styles.productPrice}>{`R$ ${product.discount_price.toString().replace('.', ',')}`}</Text>
                    }
                </View>

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
                                        selectedProduct && selectedProduct.categoiesAdditional.map(category => {
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

            {/* Footer*/}
            <View style={styles.footer}>
                <View style={styles.footerAmount}></View>

                <TouchableHighlight underlayColor='#ff0000' style={styles.footerButton}>
                    <Text style={{color: '#fff'}}>R$ 15,75</Text>
                </TouchableHighlight>
            </View>
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
        paddingHorizontal: 10
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
    },

    footerAmount: {
        flex: 0.5
    },

    footerButton: {
        flex: 0.5,
        backgroundColor: '#cc0000',
        borderRadius: 2
    }
});