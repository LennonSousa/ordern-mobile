import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import ProductItem, { Product } from '../Products';

import globalStyles from '../../assets/styles/global';

export interface Category {
    id: number;
    title: string;
    paused: boolean;
    order: number;
    products: Product[];
}

interface CategoryProps {
    category: Category;
}

export default function Categories({ category }: CategoryProps) {
    return (
        !category.paused ? <View style={styles.categoryItem}>
            <View>
                <Text style={globalStyles.titlePrimaryLight}>{category.title}</Text>
            </View>
            <View>
                {
                    category.products.map((product, index) => {
                        return (
                            !product.paused && <ProductItem key={index} product={product} />
                        )
                    })
                }
            </View>
        </View> : null
    )
}

const styles = StyleSheet.create({
    categoryItem: {
        width: Dimensions.get('window').width,
        backgroundColor: '#fff',
        paddingTop: 15,
        paddingLeft: 10
    },

    categoryTitle: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 22,
        color: '#cc0000'
    }
});