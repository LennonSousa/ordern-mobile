import React, { useEffect } from 'react';
import { View, Animated, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

import globalStyles, { colorPrimaryLight, colorTextDescription } from '../../../assets/styles/global';
import PageFooter from '../../PageFooter';

export default function ProductDetailsShimmer() {
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

    const translateXFildCover = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 350]
    });

    const translateXFildTitles = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 210]
    });

    const translateXFildDescription = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 70]
    });

    const translateXFildAmount = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 40]
    });

    useEffect(() => {
        circleAnimated();

        return () => circleAnimated();
    }, []);

    return (
        <>
            <ScrollView style={globalStyles.container}>
                <View style={styles.containerCover}>
                    <View style={{
                        width: Dimensions.get('window').width,
                        height: 100,
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
                                transform: [{ translateX: translateXFildCover }]
                            }}
                        ></Animated.View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={{ flex: 0.6 }}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                            <Animated.View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    opacity: 0.35,
                                    backgroundColor: colorTextDescription,
                                    transform: [{ translateX: translateXFildTitles }]
                                }}
                            ></Animated.View>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={{ flex: 0.6 }}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                            <Animated.View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    opacity: 0.35,
                                    backgroundColor: colorTextDescription,
                                    transform: [{ translateX: translateXFildTitles }]
                                }}
                            ></Animated.View>
                        </View>
                    </View>
                </View>

                <View>
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <View style={{ flex: 0.2 }}>
                            <View style={{ height: 15, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                                <Animated.View
                                    style={{
                                        width: '30%',
                                        height: '100%',
                                        opacity: 0.35,
                                        backgroundColor: colorTextDescription,
                                        transform: [{ translateX: translateXFildDescription }]
                                    }}
                                ></Animated.View>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <View style={{ flex: 0.2 }}>
                            <View style={{ height: 15, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                                <Animated.View
                                    style={{
                                        width: '30%',
                                        height: '100%',
                                        opacity: 0.35,
                                        backgroundColor: colorTextDescription,
                                        transform: [{ translateX: translateXFildDescription }]
                                    }}
                                ></Animated.View>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <View style={{ flex: 0.2 }}>
                            <View style={{ height: 15, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                                <Animated.View
                                    style={{
                                        width: '30%',
                                        height: '100%',
                                        opacity: 0.35,
                                        backgroundColor: colorTextDescription,
                                        transform: [{ translateX: translateXFildDescription }]
                                    }}
                                ></Animated.View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Divider*/}
                <View style={globalStyles.divider}></View>


                {/* Notes*/}
            </ScrollView>

            <PageFooter>
                <View style={styles.footerContainerAmount}>
                    <View style={styles.footerContainerAmountRow}>
                        <View style={styles.footerContainerAmountColumnMinus}>
                            <View style={{ height: 20, width: '75%', backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                                <Animated.View
                                    style={{
                                        width: '30%',
                                        height: '100%',
                                        opacity: 0.35,
                                        backgroundColor: colorTextDescription,
                                        transform: [{ translateX: translateXFildAmount }]
                                    }}
                                ></Animated.View>
                            </View>
                        </View>

                        <View style={styles.footerContainerAmountColumnValue}>
                            <View style={{ height: 20, width: '75%', backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                                <Animated.View
                                    style={{
                                        width: '30%',
                                        height: '100%',
                                        opacity: 0.35,
                                        backgroundColor: colorTextDescription,
                                        transform: [{ translateX: translateXFildAmount }]
                                    }}
                                ></Animated.View>
                            </View>
                        </View>

                        <View style={styles.footerContainerAmountColumnPlus}>
                            <View style={{ height: 20, width: '75%', backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                                <Animated.View
                                    style={{
                                        width: '30%',
                                        height: '100%',
                                        opacity: 0.35,
                                        backgroundColor: colorTextDescription,
                                        transform: [{ translateX: translateXFildAmount }]
                                    }}
                                ></Animated.View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 0.5 }}>
                    <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                        <Animated.View
                            style={{
                                width: '30%',
                                height: '100%',
                                opacity: 0.35,
                                backgroundColor: colorTextDescription,
                                transform: [{ translateX: translateXFildTitles }]
                            }}
                        ></Animated.View>
                    </View>
                </View>
            </PageFooter>
        </>
    )
}

const styles = StyleSheet.create(
    {

        containerCover: {
            alignItems: 'center',
            marginBottom: 5,
        },

        footerContainerAmount: {
            flex: 0.4,
            borderColor: '#d9d9d9',
            borderWidth: 1,
            borderRadius: 5
        },

        footerContainerAmountRow: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
        },

        footerContainerAmountColumnMinus: {
            flex: 0.3,
        },

        footerContainerAmountColumnValue: {
            flex: 0.4,
        },

        footerContainerAmountColumnPlus: {
            flex: 0.3,
        },
    }
)