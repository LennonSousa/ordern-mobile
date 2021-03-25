import React from 'react';
import { View } from 'react-native';
import { BorderlessButton, BorderlessButtonProperties } from 'react-native-gesture-handler';

import globalStyles from '../../../assets/styles/global';

const ButtonListItem: React.FC<BorderlessButtonProperties> = ({ ...children }) => {
    return (
        <View style={{ overflow: 'hidden' }}>
            <View style={globalStyles.containerItem}>
                <BorderlessButton
                    {...children}
                >
                </BorderlessButton>
            </View>
        </View>
    );
}

export default ButtonListItem;