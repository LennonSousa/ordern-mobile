import React from 'react';
import { Text, TouchableHighlight, TouchableHighlightProps } from 'react-native';

interface ButtonsProps extends TouchableHighlightProps {
    title?: string;
}

import globalStyles from '../../../assets/styles/global';

export default function Buttons({ title, onPress, ...props }: ButtonsProps) {
    return (
        <TouchableHighlight
            {...props}
            onPress={onPress}
            underlayColor='#cc0000'
            style={props.disabled ? globalStyles.disabledButtonLogIn : globalStyles.buttonLogIn}
        >
            <Text style={globalStyles.buttonTextLogIn}>{title}</Text>
        </TouchableHighlight>
    );
}