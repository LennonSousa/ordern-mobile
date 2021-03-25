import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
    children: ReactNode
}

export default class PageFooter extends Component<Props> {
    render() {
        return <View style={styles.footerContainer}>
            {this.props.children}
        </View>
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        height: 70,
        borderTopColor: '#f2f2f2',
        borderTopWidth: 1,
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000000",
        shadowOffset: {
            width: 5,
            height: 0
        },
        shadowOpacity: 0.12,
        shadowRadius: 3.84,
        elevation: 10
    }
});