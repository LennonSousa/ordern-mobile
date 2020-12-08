import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { ContextSelectedProduct } from '../../context/selectedProductContext';

export interface ProductValue {
    id: number;
    description: string;
    value: number;
    order: number;
    product: number;
}

interface ProductValueProps {
    productValue: ProductValue;
}

export default function ProductValues({ productValue }: ProductValueProps) {
    const { selectedProduct, handleSelectedProduct } = useContext(ContextSelectedProduct);

    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        if (selectedProduct && selectedProduct.selectedValue === productValue.id)
            setIsEnabled(true);
        else
            setIsEnabled(false);
    }, [selectedProduct]);

    function handleSetEnabled() {
        selectedProduct && handleSelectedProduct(
            {
                ...selectedProduct,
                price: productValue.value,
                selectedValue: productValue.id
            }
        )
    }

    return (
        <View key={productValue.id} style={styles.additionalsContainer}>
            <Text style={styles.additionalTitle}>{productValue.description}</Text>

            {
                productValue.value > 0 && <Text style={styles.additionalPrice}>{`R$ ${productValue.value.toString().replace('.', ',')}`}</Text>
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
            flex: 0.5,
            fontFamily: 'Nunito_300Light',
            fontSize: 16,
            color: '#262626',
        },

        additionalPrice: {
            flex: 0.3,
            fontFamily: 'Nunito_300Light',
            fontSize: 16,
            color: '#8c8c8c',
        },

        additionalSwitch: {
            flex: 0.2
        }
    }
);