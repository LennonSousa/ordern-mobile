import React, { ReactNode } from 'react';
import { Text, TouchableHighlight, TouchableHighlightProps, View } from 'react-native';

interface ButtonsProps extends TouchableHighlightProps {
    title?: string;
    children?: ReactNode;
}

import globalStyles, { colorPrimaryDark } from '../../../assets/styles/global';

const Button: React.FC<ButtonsProps> = ({ title, onPress, children, ...props }) => {
    return (
        <TouchableHighlight
            onPress={onPress}
            underlayColor={colorPrimaryDark}
            style={props.disabled ? globalStyles.disabledButtonLogIn : globalStyles.buttonLogIn}
            {...props}
        >
            <View>
                {children}
                {title && <Text style={globalStyles.buttonTextLogIn}>{title}</Text>}
            </View>

        </TouchableHighlight>
    );
}

export default Button;