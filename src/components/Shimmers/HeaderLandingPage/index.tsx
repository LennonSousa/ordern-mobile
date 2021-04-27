import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

import { colorTextDescription } from '../../../assets/styles/global';

interface LandingPageShimmerProps {
    headerHeight: number;
}

export default ({ headerHeight }: LandingPageShimmerProps) => {
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
        outputRange: [-10, 90]
    });

    useEffect(() => {
        circleAnimated();

        return () => circleAnimated();
    }, []);

    return (
        <View style={styles.containerCover}>
            <View style={[styles.cover, { height: headerHeight }]}>
                <View style={styles.avatar}>
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
        </View>
    )
}

const styles = StyleSheet.create(
    {
        containerCover: {
            alignItems: 'center'
        },

        cover: {
            width: Dimensions.get('window').width,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colorTextDescription,
            opacity: 0.35,
            overflow: 'hidden'
        },

        avatar: {
            width: 90,
            height: 90,
            borderRadius: 100,
            backgroundColor: colorTextDescription,
            opacity: 0.35,
            overflow: 'hidden'
        },

        categoryItem: {
            width: '100%',
            backgroundColor: '#fff',
            paddingTop: 15,
        },

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