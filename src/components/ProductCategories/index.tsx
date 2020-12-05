import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';

import ProductAdditionalItem, { ProductAdditional } from '../ProductAdditionals';

export interface ProductCategory {
    id: number;
    title: string;
    min: number;
    max: number;
    order: number;
    productAdditional: ProductAdditional[];
    product: number;
}

interface ProductDetailsRouteParams {
    productCategory: ProductCategory;
}

export default function ProductCategories() {
    const route = useRoute();

    const [productCategoryAdditionals, setProductCategoryAdditionals] = useState<ProductCategory>();

    const params = route.params as ProductDetailsRouteParams;

    useEffect(() => {
        if (params.productCategory) {
            setProductCategoryAdditionals(params.productCategory);
        }
    }, [params.productCategory]);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>{productCategoryAdditionals?.title}</Text>

                <View>
                    {
                        productCategoryAdditionals?.productAdditional.map(additional => {
                            return !additional.additional.paused && <ProductAdditionalItem
                                key={additional.id}
                                productAdditional={additional}
                                idCategory={productCategoryAdditionals.id} />
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
        color: '#cc0000',
        padding: 10
    }
});