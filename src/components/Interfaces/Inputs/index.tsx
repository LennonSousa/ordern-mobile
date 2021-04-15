import React, { forwardRef, LegacyRef } from 'react';
import { View, Text, StyleSheet, TextInputProps, TextInput } from 'react-native';

interface InputsProps extends TextInputProps {
    title?: string
}

const Input = forwardRef(({ title, style, ...props }: InputsProps, ref: LegacyRef<TextInput>) => {
    return (
        <View>
            <View style={title ? styles.rowTitle : {}}>
                <Text style={styles.title}>{title}</Text>
            </View>

            <TextInput
                {...props}
                {...{ref}}
                style={[styles.input, style]}
                placeholderTextColor={'#c8c8c8'}
            />
        </View>
    );
});

export default Input;

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