import React, { useEffect } from 'react';
import { View, Animated, ScrollView, StyleSheet, Dimensions } from 'react-native';

import ProductsShimmer from '../Products';

import { colorTextDescription } from '../../../assets/styles/global';

export default function CategoriesShimmer() {
    const AnimatedValue = new Animated.Value(0);

    const circleAnimated = () => {
        AnimatedValue.setValue(0);

        Animated.timing(
            AnimatedValue,
            {
                toValue: 1,
                duration: 350,
                useNativeDriver: false,
            }
        ).start(() => {
            setTimeout(() => {
                circleAnimated();
            }, 1000);
        })
    }

    const translateXCategoryTitle = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 310]
    });

    useEffect(() => {
        circleAnimated();

        return () => circleAnimated();
    }, []);

    return (
        <ScrollView>
            <View style={styles.categoryItem}>
                <View style={{
                    width: '90%',
                    height: 30,
                    backgroundColor: colorTextDescription,
                    opacity: 0.35,
                    borderRadius: 5,
                    overflow: 'hidden'
                }}>
                    <Animated.View
                        style={{
                            width: '30%',
                            height: '100%',
                            opacity: 0.35,
                            backgroundColor: colorTextDescription,
                            transform: [{ translateX: translateXCategoryTitle }]
                        }}
                    ></Animated.View>
                </View>

                <View>
                    <ProductsShimmer />
                    <ProductsShimmer />
                    <ProductsShimmer />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create(
    {
        categoryItem: {
            width: '100%',
            backgroundColor: '#fff',
            paddingTop: 15,
        },
    }
)