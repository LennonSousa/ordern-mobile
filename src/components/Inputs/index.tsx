import React from 'react';
import { View, Text, StyleSheet, TextInputProps, TextInput } from 'react-native';

interface InputsProps extends TextInputProps {
    title?: string
}

export default function Inputs({ title, style, ...props }: InputsProps) {
    return (
        <View>
            <View style={title ? styles.rowTitle : {}}>
                <Text style={styles.title}>{title}</Text>
            </View>

            <TextInput
                {...props}
                style={[styles.input, style]}
                placeholderTextColor={'#c8c8c8'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    rowTitle: {
        bottom: -15,
        left: 10,
        zIndex: 999,
        textAlign: 'center',
        flexDirection: 'row'
    },

    title: {
        color: '#8c8c8c',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10
    },

    input: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        color: '#4d4d4d',
        borderColor: '#c8c8c8',
        borderWidth: 1,
    },
});