import React, { useEffect } from 'react';

import { View, Animated } from 'react-native';

import globalStyles, { colorPrimaryLight, colorInputBackground, colorTextDescription } from '../../../assets/styles/global';

export default function OrdersListShimmer() {
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

    const translateXFildNumber = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 220]
    });

    const translateXFildTotal = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 80]
    });

    const translateXFildStatus = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 160]
    });

    const translateXFildDate = AnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 130]
    });

    useEffect(() => {
        circleAnimated();

        return () => circleAnimated();
    }, []);

    return <View style={[globalStyles.containerItem, { backgroundColor: colorInputBackground }]}>
        <View style={globalStyles.fieldsRow}>
            <View style={globalStyles.fieldsColumn}>
                <View style={globalStyles.menuRow}>
                    <View style={{ flex: 1 }}>
                        <View>
                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                <View style={{ flex: 0.7 }}>
                                    <View style={{ height: 20, backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                                        <Animated.View
                                            style={{
                                                width: '30%',
                                                height: '100%',
                                                opacity: 0.35,
                                                backgroundColor: colorTextDescription,
                                                transform: [{ translateX: translateXFildNumber }]
                                            }}
                                        ></Animated.View>
                                    </View>
                                </View>
                                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                    <View style={{ height: 20, width: '80%', backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
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
                            <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                <View style={globalStyles.colTitleButtonItem}>
                                    <View style={{ height: 20, backgroundColor: colorPrimaryLight, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                                        <Animated.View
                                            style={{
                                                width: '30%',
                                                height: '100%',
                                                opacity: 0.35,
                                                backgroundColor: colorPrimaryLight,
                                                transform: [{ translateX: translateXFildStatus }]
                                            }}
                                        ></Animated.View>
                                    </View>
                                </View>
                                <View style={[globalStyles.colTitleButtonItem, { alignItems: 'flex-end' }]}>
                                    <View style={{ height: 20, width: '80%', backgroundColor: colorTextDescription, opacity: 0.35, borderRadius: 5, overflow: 'hidden' }}>
                                        <Animated.View
                                            style={{
                                                width: '30%',
                                                height: '100%',
                                                opacity: 0.35,
                                                backgroundColor: colorTextDescription,
                                                transform: [{ translateX: translateXFildDate }]
                                            }}
                                        ></Animated.View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        </View>
    </View>
}