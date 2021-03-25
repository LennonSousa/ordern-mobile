import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import globalStyles, { colorPrimaryLight } from '../../assets/styles/global';

import aboutImage from '../../assets/images/about.png';

const { expo } = require('../../../app.json');

export default function About() {
    const navigation = useNavigation();

    return (
        <ScrollView style={globalStyles.container} >
            <View style={{ marginBottom: 20 }}>
                <View style={[globalStyles.row, { marginVertical: 0, height: 250 }]}>
                    <View style={[globalStyles.column, { alignItems: 'center' }]}>
                        <Image source={aboutImage} style={styles.imageContent} />
                    </View>
                </View>
                <View style={[globalStyles.row, { marginVertical: 0 }]}>
                    <View style={[globalStyles.column, { alignItems: 'center' }]}>
                        <Text style={globalStyles.titlePrimaryLight}>Plataforma OrderN</Text>
                        <Text style={globalStyles.textDescription}>Este aplicativo é forneceido, desenvolvido e gerado pela plataforma OrderN.</Text>
                    </View>
                </View>

                <View style={globalStyles.fieldsRow}>
                    <View style={globalStyles.fieldsColumn}>
                        <BorderlessButton onPress={() => {
                            navigation.navigate('PrivacyTerms', { type: "terms" });
                        }}>
                            <View style={globalStyles.menuRow}>
                                <View style={globalStyles.menuColumn}>
                                    <Text>Termos de uso</Text>
                                </View>
                                <View style={globalStyles.menuIconColumn}>
                                    <Feather name="chevron-right" size={24} color={colorPrimaryLight} />
                                </View>
                            </View>
                        </BorderlessButton>
                    </View>
                </View>

                <View style={globalStyles.fieldsRow}>
                    <View style={globalStyles.fieldsColumn}>
                        <BorderlessButton onPress={() => {
                            navigation.navigate('PrivacyTerms', { type: "privacy" });
                        }}>
                            <View style={globalStyles.menuRow}>
                                <View style={globalStyles.menuColumn}>
                                    <Text>Políticas de privacidade</Text>
                                </View>
                                <View style={globalStyles.menuIconColumn}>
                                    <Feather name="chevron-right" size={24} color={colorPrimaryLight} />
                                </View>
                            </View>
                        </BorderlessButton>
                    </View>
                </View>

                <View style={globalStyles.fieldsRow}>
                    <Text style={[globalStyles.textsDescriptionMenu, { textAlign: 'center' }]}>{`Versão do aplicativo: ${expo.version}`}</Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create(
    {
        imageContent: {
            height: '75%',
            resizeMode: 'contain'
        },
    });