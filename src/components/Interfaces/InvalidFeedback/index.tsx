import React from 'react';

import { StyleSheet, Text } from 'react-native'

interface InvalidFeedbackProps {
    message?: string;
}

export default function InvalidFeedback({ message }: InvalidFeedbackProps) {
    return <Text style={styles.text}>{message}</Text>
}

const styles = StyleSheet.create({
    text: {
        color: '#cc0000',
        fontSize: 12,
    }
});