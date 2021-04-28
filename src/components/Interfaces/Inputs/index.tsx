import React, { forwardRef, LegacyRef } from 'react';
import { View, Text, StyleSheet, TextInputProps, TextInput } from 'react-native';

import {
    colorBackground,
    colorTextDescription,
    colorBorder,
    colorDisabledBorder,
    colorInputText,
    colorDisabledInputText
} from '../../../assets/styles/global';

interface InputsProps extends TextInputProps {
    title?: string
}

const Input = forwardRef(({ title, style, editable = true, ...props }: InputsProps, ref: LegacyRef<TextInput>) => {
    return (
        <View>
            <View style={title ? styles.rowTitle : {}}>
                <Text style={styles.title}>{title}</Text>
            </View>

            <TextInput
                {...props}
                {...{ ref }}
                editable={editable}
                style={[styles.input, style, {
                    color: editable ? colorInputText : colorDisabledInputText,
                    borderColor: editable ? colorBorder : colorDisabledBorder
                }]}
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
        color: colorTextDescription,
        backgroundColor: colorBackground,
        paddingHorizontal: 10
    },

    input: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
    },
});