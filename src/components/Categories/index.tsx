import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import ProductItem, { Product } from '../Products';

import globalStyles from '../../assets/styles/global';

export interface Category {
    id: string;
    title: string;
    paused: boolean;
    order: number;
    products: Product[];
}

interface CategoryProps {
    title: string;
    renderProducts?: boolean;
    products?: Product[];
}

export default function Categories({ title, renderProducts = false, products }: CategoryProps) {

    return (
        <View style={styles.categoryItem}>
            <View>
                <Text style={globalStyles.titlePrimaryLight}>{title}</Text>
            </View>
            {
                renderProducts && products && products.map((product, index) => {
                    return <ProductItem key={index} product={product} />
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    categoryItem: {
        width: Dimensions.get('window').width,
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 15,
    },
});