import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import { ContextOrdering } from '../../context/orderingContext';

interface HeaderProps {
    title: string;
    showCancel?: boolean;
    showClearBag?: boolean;
}

export default function Header({ title, showCancel = true, showClearBag = false }: HeaderProps) {
    const navigation = useNavigation();

    const { handleClearOrder } = useContext(ContextOrdering);

    function handleGoBackLandingPage() {
        navigation.navigate('LandingPage');
    }

    function handleClearBag() {
        handleClearOrder();
    }

    return (
        <View style={styles.container}>
            <BorderlessButton onPress={navigation.goBack} style={{ flex: 0.2 }}>
                <Feather name="arrow-left" size={24} color="#cc0000" />
            </BorderlessButton>

            <Text style={styles.title}>{title}</Text>

            { showCancel &&
                <BorderlessButton onPress={handleGoBackLandingPage} style={{ flex: 0.2 }}>
                    <Feather name="x" size={24} color="#ff669d" style={{ textAlign: 'center' }} />
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
        height: 60,
        paddingHorizontal: 24,
        flexDirection: 'row',
        backgroundColor: '#f9fafc',
        borderBottomWidth: 1,
        borderColor: '#dde3f0',
        alignItems: 'center'
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