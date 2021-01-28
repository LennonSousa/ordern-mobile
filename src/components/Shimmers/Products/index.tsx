import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import globalStyles, { colorTextDescription } from '../../../assets/styles/global';

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

    const translateXProductTexts = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 160]
    });

    const translateXProductImage = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 75]
    });

    useEffect(() => {
        circleAnimated();

        return () => circleAnimated();
    }, []);

    return (
        <View style={styles.productRow} >
            <View style={styles.productCol}>
                <View style={styles.rowTop}>
                    <View style={styles.productColTexts}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                width: '70%',
                                height: 20,
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
                                        transform: [{ translateX: translateXProductTexts }]
                                    }}
                                ></Animated.View>
                            </View>
                        </View>
                        <View style={globalStyles.row}>
                            <View style={{
                                width: '50%',
                                height: 15,
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
                                        transform: [{ translateX: translateXProductTexts }]
                                    }}
                                ></Animated.View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.productColImage}>
                        <View style={styles.productImage}>
                            <Animated.View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    opacity: 0.35,
                                    backgroundColor: colorTextDescription,
                                    transform: [{ translateX: translateXProductImage }]
                                }}
                            ></Animated.View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        productRow: {
            marginTop: 10,
            flexDirection: 'row',
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            borderColor: '#e6e6e6',
            borderTopWidth: 1
        },

        productCol: {
            flex: 1
        },

        rowTop: {
            flexDirection: 'row',
        },

        rowBase: {
            flexDirection: 'row',
        },

        productColTexts: {
            flex: 0.7,
            padding: 5
        },

        productColImage: {
            flex: 0.3,
        },

        productImage: {
            width: 75,
            height: 75,
            resizeMode: 'cover',
            borderRadius: 10,
            backgroundColor: colorTextDescription,
            opacity: 0.35,
            overflow: 'hidden',
        },
    }
)