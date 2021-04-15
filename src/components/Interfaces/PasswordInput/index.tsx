import React, { forwardRef, LegacyRef, useState } from 'react';
import { View, Text, StyleSheet, TextInputProps, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BorderlessButton } from 'react-native-gesture-handler';

interface InputsProps extends TextInputProps {
    title?: string;
}

const Input = forwardRef(({ title, style, ...props }: InputsProps, ref: LegacyRef<TextInput>) => {
    const [passwordHide, setPasswordHide] = useState(true);

    return (
        <View>
            <View style={title ? styles.rowTitle : {}}>
                <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.rowEye}>
                <BorderlessButton onPress={() => { setPasswordHide(!passwordHide) }}>
                    {
                        passwordHide ? <Feather name="eye" style={styles.eye} size={18} /> :
                            <Feather name="eye-off" style={styles.eye} size={18} />
                    }
                </BorderlessButton>
            </View>

            <TextInput
                {...props}
                {...{ ref }}
                style={[styles.input, style]}
                placeholderTextColor={'#c8c8c8'}
                textContentType='password'
                autoCapitalize='none'
                secureTextEntry={passwordHide}
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

    rowEye: {
        top: 43,
        right: 10,
        zIndex: 999,
        textAlign: 'center',
        flexDirection: 'row',
        position: 'absolute'
    },

    eye: {
        color: '#8c8c8c',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10
    },
});