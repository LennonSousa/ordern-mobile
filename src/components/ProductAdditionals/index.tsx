import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { Additional } from '../Additionals';
import { ProductCategory } from '../ProductCategories';
import { SelectedProductContext } from '../../context/selectedProductContext';

import globalStyles, { colorPrimaryLight, colorSecondary, colorTextInSecondary } from '../../assets/styles/global';

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
}

export default function ProductAdditionals({ productAdditional }: ProductAdditionalProps) {
    const navigation = useNavigation();

    const { selectedProduct, handleSelectedProduct } = useContext(SelectedProductContext);

    const [isEnabled, setIsEnabled] = useState(false);

    const [selectedAdditionalAmount, setSelectedAdditionalAmount] = useState(0);

    const [buttonPlus, setButtonPlus] = useState(true);
    const [amountText, setAmountText] = useState(true);
    const [buttonMinus, setButtonMinus] = useState(true);

    useEffect(() => {
        selectedProduct && selectedProduct.categoiesAdditional.forEach(category => {
            if (category.id === productAdditional.categoryAdditional.id) {
                let selectedAdditionalsAmount = 0;
                let additionalAmount = 0;

                category.selectedAdditionals.forEach(selectedAdditional => {
                    if (selectedAdditional.id === productAdditional.id)
                        additionalAmount = selectedAdditional.amount;

                    setSelectedAdditionalAmount(additionalAmount);

                    selectedAdditionalsAmount = selectedAdditionalsAmount + selectedAdditional.amount;
                });

                if (productAdditional.categoryAdditional.repeat) {
                    if (additionalAmount === 0) {
                        setButtonMinus(false);
                        setAmountText(false);
                        setButtonPlus(true);
                    }
                    else {
                        setButtonMinus(true);
                        setAmountText(true);
                    }

                    if (selectedAdditionalsAmount === category.max && category.max !== 0)
                        setButtonPlus(false);
                    else if (selectedAdditionalsAmount > 0)
                        setButtonPlus(true);
                }
                else {
                    category.selectedAdditionals.forEach(additional => {
                        if (additional.id === productAdditional.id)
                            if (additional.amount > 0)
                                setIsEnabled(true);
                            else
                                setIsEnabled(false);
                    });
                }
            }
        });
    }, [selectedProduct]);

    function handleAdditional(repeat: boolean, operation?: "minus" | "plus") {
        let maxChoices = 0;
        let selectedAdditionals = 0;

        selectedProduct && handleSelectedProduct(
            {
                ...selectedProduct, categoiesAdditional: selectedProduct.categoiesAdditional.map(category => {
                    if (category.id === productAdditional.categoryAdditional.id) { // Category found.
                        //console.log('Category found: ', productAdditional.categoryAdditional);

                        maxChoices = category.max;

                        if (repeat && category.max !== 1) {

                            const additionalItem = category.selectedAdditionals.find(item => { return item.id === productAdditional.id }); // Seeking for additional on list

                            if (additionalItem) {
                                if (operation) {
                                    let newAmount = 0;

                                    if (operation === "plus")
                                        newAmount = additionalItem.amount + 1;
                                    else if (operation === "minus")
                                        newAmount = additionalItem.amount - 1;

                                    if (newAmount > 0) {
                                        return {
                                            ...category,
                                            selectedAdditionals: category.selectedAdditionals.map(selectedAdditional => {
                                                if (selectedAdditional.id === productAdditional.id)
                                                    return { ...selectedAdditional, amount: newAmount }

                                                return selectedAdditional;
                                            })
                                        }
                                    }
                                    else {
                                        return {
                                            ...category,
                                            selectedAdditionals: category.selectedAdditionals.filter(item => item.id !== productAdditional.id)
                                        }
                                    }
                                }

                            }
                            else {
                                return {
                                    ...category,
                                    selectedAdditionals: [
                                        ...category.selectedAdditionals, {
                                            id: productAdditional.id,
                                            additional_id: productAdditional.additional.id, // Additional id to verify on page cart if paused
                                            title: productAdditional.additional.title,
                                            amount: 1,
                                            price: productAdditional.price
                                        }
                                    ]
                                }
                            }
                        }

                        // If item already exists on list
                        else if (category.selectedAdditionals.find(item => { return item.id === productAdditional.id })) {
                            setIsEnabled(!isEnabled);

                            selectedAdditionals = category.selectedAdditionals.length - 1;

                            return {
                                ...category,
                                selectedAdditionals: category.selectedAdditionals.filter(item => item.id !== productAdditional.id)
                            }
                        }
                        // If item don't exists on list
                        else if (category.max !== 0) {
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
                                            amount: 1,
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
                                            amount: 1,
                                            price: productAdditional.price
                                        }
                                    ]
                                }
                            }
                        }
                        else {
                            return {
                                ...category,
                                selectedAdditionals: [
                                    ...category.selectedAdditionals, {
                                        id: productAdditional.id,
                                        additional_id: productAdditional.additional.id, // Additional id to verify on page cart if paused
                                        title: productAdditional.additional.title,
                                        amount: 1,
                                        price: productAdditional.price
                                    }
                                ]
                            }
                        }
                    }

                    return category;
                })
            }
        )

        if (maxChoices !== 0 && maxChoices === selectedAdditionals)
            navigation.goBack();
    }

    return (
        <View key={productAdditional.id} style={styles.additionalsContainer}>
            <View style={{ flex: 0.7 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.additionalTitle}>{productAdditional.additional.title}</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    {
                        productAdditional.price > 0 && <Text
                            style={styles.additionalPrice}>{`R$ ${productAdditional.price.toString().replace('.', ',')}`}
                        </Text>
                    }
                </View>
            </View>

            <View style={{ flex: 0.3 }}>
                <View style={{ flexDirection: 'row' }}>
                    {
                        productAdditional.categoryAdditional.repeat ?
                            <View style={[globalStyles.row, { alignSelf: 'flex-start' }]}>
                                <View style={globalStyles.column}>
                                    {
                                        buttonMinus && <TouchableOpacity
                                            onPress={() => { handleAdditional(true, "minus") }}
                                            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                        >
                                            <Feather name="minus" style={styles.iconButtons} />
                                        </TouchableOpacity>
                                    }
                                </View>

                                <View style={globalStyles.column}>
                                    {
                                        selectedProduct && amountText && <Text style={styles.iconText}>{selectedAdditionalAmount}</Text>
                                    }
                                </View>

                                <View style={globalStyles.column}>
                                    <TouchableOpacity
                                        onPress={() => { handleAdditional(true, "plus") }}
                                        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                        disabled={!buttonPlus}
                                    >
                                        <Feather name="plus" style={buttonPlus ? styles.iconButtons : styles.disabledIconButtons} />
                                    </TouchableOpacity>
                                </View>
                            </View> :
                            <Switch
                                style={styles.additionalSwitch}
                                trackColor={{ false: "#767577", true: "#cc0000" }}
                                thumbColor="#f4f3f4"
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => { handleAdditional(false) }}
                                value={isEnabled}
                            />
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        additionalsContainer: {
            flexDirection: 'row',
            marginVertical: 8,
            paddingHorizontal: 5,
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
        },

        additionalTitle: {
            fontFamily: 'Nunito_600SemiBold',
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
        },

        iconButtons: {
            fontFamily: 'Nunito_300Light',
            fontSize: 18,
            color: colorPrimaryLight,
            textAlign: 'center'
        },

        disabledIconButtons: {
            fontFamily: 'Nunito_300Light',
            fontSize: 18,
            color: colorSecondary,
            textAlign: 'center'
        },

        iconText: {
            fontFamily: 'Nunito_300Light',
            fontSize: 16,
            color: colorTextInSecondary,
            textAlign: 'center'
        },
    }
);