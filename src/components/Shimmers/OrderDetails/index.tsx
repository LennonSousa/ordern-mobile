import React, { useEffect } from 'react';
import { View, Animated, ScrollView, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import globalStyles, { colorPrimaryLight, colorTextDescription } from '../../../assets/styles/global';

export default function OrderDetailsShimmer() {
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

    const translateXFildStatus = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 210]
    });

    const translateXFildTotal = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 70]
    });

    const translateXFildDescription = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 240]
    });

    const translateXFildAmount = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 60]
    });

    useEffect(() => {
        circleAnimated();

        return () => circleAnimated();
    }, []);

    return <ScrollView style={globalStyles.container}>
        <View style={globalStyles.fieldsRow}>
            <View style={globalStyles.fieldsColumn}>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 0.6 }}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                            <Animated.View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    opacity: 0.35,
                                    backgroundColor: colorTextDescription,
                                    transform: [{ translateX: translateXFildStatus }]
                                }}
                            ></Animated.View>
                        </View>
                    </View>
                    <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                        <View style={{ height: 20, width: '30%', backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                            <Animated.View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    opacity: 0.35,
                                    backgroundColor: colorTextDescription,
                                    transform: [{ translateX: translateXFildStatus }]
                                }}
                            ></Animated.View>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 0.7 }}>
                        <View style={{ height: 10, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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
                                transform: [{ translateX: translateXFildTotal }]
                            }}
                        ></Animated.View>
                    </View>
                </View>
            </View>

            <View style={globalStyles.container}>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={styles.itemColumnAmount}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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

                    <View style={styles.itemColumnName}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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

                    <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                        <View style={{ height: 20, width: '80%', backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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
                <View style={styles.additionalContainer}>
                    <View style={styles.additionalRow}>
                        <View style={styles.additionalColumnAmount}>
                            <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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

                        <View style={styles.additionalColumnName}>
                            <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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

                        <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                            <View style={{ height: 20, width: '80%', backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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

                <View style={styles.itemTotalContainer}>
                    <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                        <Animated.View
                            style={{
                                width: '30%',
                                height: '100%',
                                opacity: 0.35,
                                backgroundColor: colorTextDescription,
                                transform: [{ translateX: translateXFildStatus }]
                            }}
                        ></Animated.View>
                    </View>
                </View>
                {/* Divider*/}
                <View style={globalStyles.divider}></View>
            </View>

            <View style={globalStyles.container}>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={styles.itemColumnAmount}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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

                    <View style={styles.itemColumnName}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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

                    <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                        <View style={{ height: 20, width: '80%', backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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
                <View style={styles.additionalContainer}>
                    <View style={styles.additionalRow}>
                        <View style={styles.additionalColumnAmount}>
                            <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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

                        <View style={styles.additionalColumnName}>
                            <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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

                        <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                            <View style={{ height: 20, width: '80%', backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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

                <View style={styles.itemTotalContainer}>
                    <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                        <Animated.View
                            style={{
                                width: '30%',
                                height: '100%',
                                opacity: 0.35,
                                backgroundColor: colorTextDescription,
                                transform: [{ translateX: translateXFildStatus }]
                            }}
                        ></Animated.View>
                    </View>
                </View>
                {/* Divider*/}
                <View style={globalStyles.divider}></View>
            </View>

        </View>

        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <View style={globalStyles.fieldsColumn}>
                <View style={globalStyles.menuRow}>
                    <View style={globalStyles.menuColumn}>
                        <Text style={globalStyles.textsMenu}>Sub total</Text>
                    </View>
                    <View style={globalStyles.menuIconColumn}>
                        <Feather name="tag" size={24} color={colorPrimaryLight} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 0.2 }}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                            <Animated.View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    opacity: 0.35,
                                    backgroundColor: colorTextDescription,
                                    transform: [{ translateX: translateXFildTotal }]
                                }}
                            ></Animated.View>
                        </View>
                    </View>
                </View>
            </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <View style={globalStyles.fieldsColumn}>
                <View style={globalStyles.menuRow}>
                    <View style={globalStyles.menuColumn}>
                        <Text style={globalStyles.textsMenu}>Entrega</Text>
                    </View>
                    <View style={globalStyles.menuIconColumn}>
                        <Feather name="map" size={24} color={colorPrimaryLight} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 0.2 }}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                            <Animated.View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    opacity: 0.35,
                                    backgroundColor: colorTextDescription,
                                    transform: [{ translateX: translateXFildTotal }]
                                }}
                            ></Animated.View>
                        </View>
                    </View>
                </View>
            </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <View style={globalStyles.fieldsColumn}>
                <View style={globalStyles.menuRow}>
                    <View style={globalStyles.menuColumn}>
                        <Text style={globalStyles.textsMenu}>Taxa de entrega</Text>
                    </View>
                    <View style={globalStyles.menuIconColumn}>
                        <Feather name="truck" size={24} color={colorPrimaryLight} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 0.2 }}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                            <Animated.View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    opacity: 0.35,
                                    backgroundColor: colorTextDescription,
                                    transform: [{ translateX: translateXFildTotal }]
                                }}
                            ></Animated.View>
                        </View>
                    </View>
                </View>
            </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <View style={globalStyles.fieldsColumn}>
                <View style={globalStyles.menuRow}>
                    <View style={globalStyles.menuColumn}>
                        <Text style={globalStyles.textsMenu}>Tempo estimado</Text>
                    </View>
                    <View style={globalStyles.menuIconColumn}>
                        <Feather name="watch" size={24} color={colorPrimaryLight} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 0.2 }}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                            <Animated.View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    opacity: 0.35,
                                    backgroundColor: colorTextDescription,
                                    transform: [{ translateX: translateXFildTotal }]
                                }}
                            ></Animated.View>
                        </View>
                    </View>
                </View>
            </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <View style={globalStyles.fieldsColumn}>
                <View style={globalStyles.menuRow}>
                    <View style={globalStyles.menuColumn}>
                        <Text style={globalStyles.textsMenu}>Pagamento</Text>
                    </View>
                    <View style={globalStyles.menuIconColumn}>
                        <Feather name="credit-card" size={24} color={colorPrimaryLight} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 0.2 }}>
                        <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                            <Animated.View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    opacity: 0.35,
                                    backgroundColor: colorTextDescription,
                                    transform: [{ translateX: translateXFildTotal }]
                                }}
                            ></Animated.View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    </ScrollView>
}

const styles = StyleSheet.create(
    {
        container: {
            marginVertical: 5,
            marginHorizontal: 10
        },

        divider: {
            borderTopColor: '#e6e6e6',
            borderTopWidth: 1,
            marginHorizontal: 15,
            marginVertical: 15
        },

        itemRow: {
            flexDirection: 'row',
        },

        itemColumnAmount: {
            flex: 0.1,
            backgroundColor: '#8c8c8c',
            borderRadius: 3,
            marginRight: 5,
        },

        itemColumnName: {
            flex: 0.7
        },

        itemColumnValue: {
            flex: 0.2
        },

        itemAmountText: {
            color: '#ffffff',
            textAlign: 'center',
        },

        itemTexts: {
            color: '#4d4d4d',
        },

        itemValueTexts: {
            color: '#4d4d4d',
            textAlign: 'center',
        },

        itemTotalContainer: {
            flexDirection: 'row',
            marginVertical: 5,
            justifyContent: 'flex-end'
        },

        itemTotalText: {
            flex: 0.2,
            color: '#ffffff',
            textAlign: 'center',
            backgroundColor: '#ff6666',
            borderRadius: 3,
        },

        additionalContainer: {
            marginLeft: 15
        },

        additionalRow: {
            flexDirection: 'row',
            marginVertical: 5,
            marginLeft: 8,
            alignItems: 'center'
        },

        additionalColumnAmount: {
            flex: 0.1,
            backgroundColor: '#e6e6e6',
            borderRadius: 3,
            marginRight: 5,
        },

        additionalColumnName: {
            flex: 0.7
        },

        additionalColumnValue: {
            flex: 0.2
        },

        additionalTextAmount: {
            textAlign: 'center',
            fontSize: 10,
            color: '#8c8c8c',
        },

        additionalTexts: {
            color: '#8c8c8c',
        },
    }
)