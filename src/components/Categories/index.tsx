import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import { Product } from '../Products';

import globalStyles from '../../assets/styles/global';

export interface Category {
    id: number;
    title: string;
    paused: boolean;
    order: number;
    products: Product[];
}

interface CategoryProps {
    title: string;
    paused: boolean;
}

export default function Categories({ title, paused }: CategoryProps) {

    return (
        !paused ? <View style={styles.categoryItem}>
            <View>
                <Text style={globalStyles.titlePrimaryLight}>{title}</Text>
            </View>
        </View> : null
    )
}

const styles = StyleSheet.create({
    categoryItem: {
        width: Dimensions.get('window').width,
        backgroundColor: '#fff',
        paddingBottom: 15,
    },

    categoryTitle: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 22,
        color: '#cc0000'
    }
});