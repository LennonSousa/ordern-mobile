import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

import { Additional } from '../Additionals';
import { ProductCategory } from '../ProductCategories';
import { SelectedProductContext } from '../../context/selectedProductContext';
import { useNavigation } from '@react-navigation/native';

export interface ProductAdditional {
    id: number;
    pdv: string;
    price: number;
    order: number;
    additional: Additional;
    categoryAdditional: ProductCategory;
}

interface ProductAdditionalProps {
    productAdditional: ProductAdditional;
    idCategory: number;
}

export default function ProductAdditionals({ productAdditional, idCategory }: ProductAdditionalProps) {
    const navigation = useNavigation();

    const { selectedProduct, handleSelectedProduct } = useContext(SelectedProductContext);

    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        selectedProduct && selectedProduct.categoiesAdditional.forEach(category => {
            if (category.id === idCategory) {
                category.selectedAdditionals.forEach(additional => {
                    if (additional.id === productAdditional.id)
                        setIsEnabled(additional.enabled);
                })
            }
        });
    }, [selectedProduct]);

    function handleSetEnabled() {
        let maxChoices = 0;
        let selectedAdditionals = 0;

        selectedProduct && handleSelectedProduct(
            {
                ...selectedProduct, categoiesAdditional: selectedProduct.categoiesAdditional.map(category => {
                    if (category.id === idCategory) {
                        maxChoices = category.max;

                        // If item already exists on list
                        if (category.selectedAdditionals.find(item => { return item.id === productAdditional.id })) {
                            setIsEnabled(!isEnabled);

                            selectedAdditionals = category.selectedAdditionals.length - 1;

                            return {
                                ...category,
                                selectedAdditionals: category.selectedAdditionals.filter(item => item.id !== productAdditional.id)
                            }
                        }
                        // If item don't exists on list
                        else {
                            // If category got max additionals
                            if (category.selectedAdditionals.length + 1 <= category.max) {
                                setIsEnabled(!isEnabled);

                                selectedAdditionals = category.selectedAdditionals.length + 1;

                                return {
                                    ...category,
                                    selectedAdditionals: [
                                        ...category.selectedAdditionals, {
                                            id: productAdditional.id,
                                            additional_id: productAdditional.additional.id, // Additional id to verify on page cart if paused
                                            title: productAdditional.additional.title,
                                            enabled: true,
                                            price: productAdditional.price
                                        }
                                    ]
                                }
                            }
                            else if (category.max === 1 && category.selectedAdditionals.length > 0) {
                                setIsEnabled(!isEnabled);

                                selectedAdditionals = 1;

                                const additionalsUpdated = category.selectedAdditionals.filter(item => item.id !== category.selectedAdditionals[0].id);

                                return {
                                    ...category,
                                    selectedAdditionals: [
                                        ...additionalsUpdated, {
                                            id: productAdditional.id,
                                            additional_id: productAdditional.additional.id, // Additional id to verify on page cart if paused
                                            title: productAdditional.additional.title,
                                            enabled: true,
                                            price: productAdditional.price
                                        }
                                    ]
                                }
                            }
                        }
                    }

                    return category;
                })
            }
        )

        if (maxChoices === selectedAdditionals)
            navigation.goBack();
    }

    return (
        <View key={productAdditional.id} style={styles.additionalsContainer}>
            <Text style={styles.additionalTitle}>{productAdditional.additional.title}</Text>

            {
                productAdditional.price > 0 && <Text style={styles.additionalPrice}>{`R$ ${productAdditional.price.toString().replace('.', ',')}`}</Text>
            }

            <Switch
                style={styles.additionalSwitch}
                trackColor={{ false: "#767577", true: "#cc0000" }}
                thumbColor="#f4f3f4"
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleSetEnabled}
                value={isEnabled}
            />
        </View>
    )
}

const styles = StyleSheet.create(
    {
        additionalsContainer: {
            flexDirection: 'row',
            marginVertical: 8,
            paddingHorizontal: 20,
            justifyContent: 'flex-end',
            alignContent: 'flex-end'
        },

        additionalTitle: {
            flex: 1,
            fontFamily: 'Nunito_300Light',
            fontSize: 16,
            color: '#262626',
        },

        additionalPrice: {
            flex: 0.4,
            fontFamily: 'Nunito_300Light',
            fontSize: 16,
            color: '#8c8c8c',
        },

        additionalSwitch: {
            flex: 0.4
        }
    }
);