import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { ContextOrdering } from '../../context/orderingContext';

import { colorBackground, colorPrimaryLight } from '../../assets/styles/global';

interface HeaderProps {
    title: string;
    showGoBack?: boolean;
    showCancel?: boolean;
    showClearBag?: boolean;
    customGoBack?: string;
}

export default function Header(
    {
        title,
        showGoBack = true,
        showCancel = true,
        showClearBag = false,
        customGoBack
    }: HeaderProps) {
    const navigation = useNavigation();

    const { handleClearOrder } = useContext(ContextOrdering);

    function handleGoBackLandingPage() {
        navigation.navigate('LandingPage');
    }

    function handleClearBag() {
        handleClearOrder();
    }

    return (
        <View style={[styles.container, { paddingTop: getStatusBarHeight() }]}>
            <StatusBar />
            {
                showGoBack ? <BorderlessButton onPress={() => { customGoBack ? navigation.navigate(customGoBack) : navigation.goBack() }} style={{ flex: 0.2 }}>
                    <Feather name="arrow-left" size={24} color={colorPrimaryLight} />
                </BorderlessButton> :
                    <View style={{ flex: 0.2 }}></View>
            }

            <Text style={styles.title}>{title}</Text>

            { showCancel &&
                <BorderlessButton onPress={handleGoBackLandingPage} style={{ flex: 0.2 }}>
                    <Feather name="x" size={24} color={colorPrimaryLight} style={{ textAlign: 'center' }} />
                </BorderlessButton>
            }

            { showClearBag &&
                <BorderlessButton onPress={handleClearBag} style={{ flex: 0.2 }}>
                    <Text style={styles.buttonClearBagText}>Limpar</Text>
                </BorderlessButton>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        paddingHorizontal: 24,
        flexDirection: 'row',
        backgroundColor: colorBackground,
        shadowOpacity: 0.25,
        elevation: 3,
        alignItems: 'center',
    },

    title: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#262626',
        fontSize: 18,
        flex: 0.6,
        textAlign: 'center',
    },

    buttonClearBagText: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#cc0000',
        fontSize: 14,
        textAlign: 'center',
    },
});