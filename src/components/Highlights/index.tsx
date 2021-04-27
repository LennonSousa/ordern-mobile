import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from '@react-navigation/native';

import { Product } from '../Products';
import { colorHighLight, colorBorder } from '../../assets/styles/global';

export interface Highlight {
    id: number;
    active: boolean;
    product: Product;
}

interface HighlightProps {
    highlight: Highlight;
}

export default function Highlights({ highlight }: HighlightProps) {
    const navigation = useNavigation();

    function handleNavigateToProductDetails(productObject: Product) {
        navigation.navigate('ProductDetails', { product: productObject });
    }

    return (
        highlight.active ? <TouchableOpacity
            style={{ alignItems: "center" }}
            activeOpacity={0.8}
            onPress={() => { handleNavigateToProductDetails(highlight.product) }}
        >
            <View style={styles.container}>
                <View style={{ flex: 2 }}>
                    <Image source={{ uri: highlight.product.images[0].path }} style={styles.highlightImage} />
                </View>
                <View style={{ flex: 1, paddingLeft: 10, paddingTop: 5 }}>
                    <Text style={styles.productTitle}>{highlight.product.title}</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 10, paddingTop: 5 }}>
                    {
                        highlight.product.discount ? <Text style={styles.productPriceDiscount}>{`R$ ${highlight.product.price.toString().replace('.', ',')}`}</Text> :
                            <Text style={[styles.productPrice, { color: colorHighLight }]}>{`R$ ${highlight.product.price.toString().replace('.', ',')}`}</Text>
                    }
                    {
                        highlight.product.discount && <Text style={[styles.productPrice, { color: colorHighLight }]}>{`R$ ${highlight.product.discount_price.toString().replace('.', ',')}`}</Text>
                    }
                </View>
            </View>
        </TouchableOpacity> : null
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        width: 120,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 0.5,
        borderColor: colorBorder,
    },

    highlightImage: {
        flex: 1,
        width: undefined,
        height: undefined,
        resizeMode: 'cover'
    },

    productTitle: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
        color: '#262626'
    },

    productPrice: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 14
    },

    productPriceDiscount: {
        fontFamily: 'Nunito_300Light_Italic',
        textDecorationLine: 'line-through',
        fontSize: 10,
        marginRight: 5
    }
});