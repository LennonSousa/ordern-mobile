import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';

import ProductAdditionalItem, { ProductAdditional } from '../ProductAdditionals';

export interface ProductCategory {
    id: number;
    title: string;
    min: number;
    max: number;
    repeat: boolean;
    order: number;
    productAdditional: ProductAdditional[];
    product: number;
}

interface ProductDetailsRouteParams {
    productCategory: ProductCategory;
}

export default function ProductCategories() {
    const route = useRoute();

    const [productCategory, setProductCategory] = useState<ProductCategory>();

    const params = route.params as ProductDetailsRouteParams;

    useEffect(() => {
        if (params.productCategory) {
            setProductCategory(params.productCategory);
        }
    }, [params.productCategory]);

    return (
        <View style={styles.container}>
            <View>
                {/* Title*/}
                <Text style={styles.title}>{productCategory?.title}</Text>

                {/* Prices*/}
                <Text style={styles.minText}>
                    {
                        productCategory && productCategory.min > 0 ?
                            `Mínimo ${productCategory.min} ${productCategory.min === 1 ? 'opção.' : 'opções.'}` :
                            "Opcional."

                    }
                </Text>

                {/* Obrigatory*/}
                <Text style={styles.maxText}>
                    {
                        productCategory && productCategory.max > 0 ?
                            `Escolha até ${productCategory.max} ${productCategory.max === 1 ? 'opção.' : 'opções.'}` :
                            "Escolha quantos quiser."

                    }
                </Text>

                {/* Additionals*/}
                <View>
                    {
                        productCategory && productCategory.productAdditional.map(additional => {
                            return !additional.additional.paused && <ProductAdditionalItem
                                key={additional.id}
                                productAdditional={additional} />
                        })
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        backgroundColor: '#f9fafc',
    },

    containerHeader: {
        height: 80,
        paddingHorizontal: 24,
        flexDirection: 'row',
        backgroundColor: '#f9fafc',
        borderBottomWidth: 1,
        borderColor: '#dde3f0',
        paddingTop: 44,
    },

    title: {
        fontFamily: 'Nunito_300Light',
        fontSize: 22,
        color: '#fe3807',
        padding: 10
    },

    minText: {
        fontFamily: 'Nunito_300Light_Italic',
        fontSize: 13,
        color: '#8c8c8c',
        marginLeft: 15,
        marginVertical: 5
    },

    maxText: {
        fontFamily: 'Nunito_300Light_Italic',
        fontSize: 13,
        color: '#8c8c8c',
        marginLeft: 15,
        marginVertical: 5,
    }
});