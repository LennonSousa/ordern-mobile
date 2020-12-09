import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
    title: string;
    showCancel?: boolean;
}

export default function Header({ title, showCancel = true }: HeaderProps) {
    const navigation = useNavigation();

    function handleGoBackLandingPage() {
        navigation.navigate('LandingPage');
    }

    return (
        <View style={styles.container}>
            <BorderlessButton onPress={navigation.goBack} style={{flex: 0.3}}>
                <Feather name="arrow-left" size={24} color="#cc0000" />
            </BorderlessButton>

            <Text style={styles.title}>{title}</Text>

            { showCancel ? (
                <BorderlessButton onPress={handleGoBackLandingPage} style={{flex: 0.3}}>
                    <Feather name="x" size={24} color="#ff669d" style={{textAlign: 'center'}} />
                </BorderlessButton>
            ) : (
                    <View style={{flex: 0.3}} />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        paddingHorizontal: 24,
        flexDirection: 'row',
        backgroundColor: '#f9fafc',
        borderBottomWidth: 1,
        borderColor: '#dde3f0',
        paddingTop: 44,
    },

    title: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#8fa7b3',
        fontSize: 16,
        flex: 1,
        textAlign: 'center'
    }
});