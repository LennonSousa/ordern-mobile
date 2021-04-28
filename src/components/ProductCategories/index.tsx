import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import ProductAdditionalItem, { ProductAdditional } from '../ProductAdditionals';

import globalStyles from '../../assets/styles/global';

export interface ProductCategory {
    id: string;
    title: string;
    min: number;
    max: number;
    repeat: boolean;
    order: number;
    productAdditional: ProductAdditional[];
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
        <View style={globalStyles.container}>
            <View>
                {/* Title*/}
                <Text style={globalStyles.titlePrimaryLight}>{productCategory?.title}</Text>

                {/* Prices*/}
                <Text style={globalStyles.textDescription}>
                    {
                        productCategory && productCategory.min > 0 ?
                            `Mínimo ${productCategory.min} ${productCategory.min === 1 ? 'opção.' : 'opções.'}` :
                            "Opcional."

                    }
                </Text>

                {/* Obrigatory*/}
                <Text style={globalStyles.textDescription}>
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