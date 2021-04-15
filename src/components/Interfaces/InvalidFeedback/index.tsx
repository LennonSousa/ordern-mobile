import React from 'react';

import { StyleSheet, Text } from 'react-native'

import { colorPrimaryLight } from '../../../assets/styles/global';

interface InvalidFeedbackProps {
    message?: string;
}

export default function InvalidFeedback({ message }: InvalidFeedbackProps) {
    return <Text style={styles.text}>{message}</Text>
}

const styles = StyleSheet.create({
    text: {
        color: colorPrimaryLight,
        fontSize: 12,
    }
});