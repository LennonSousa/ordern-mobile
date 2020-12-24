import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import stripe from 'tipsi-stripe';

stripe.setOptions({
    publishableKey: 'pk_test_51I1cqjKzYHbNMhs91n4GYeyeo5VMe27LlB0X93C3UUUrKIrfADPDRmWqOyf9W8DZeyXShWP10CKik9cVdm7zmcUF005zn84KY5',
});

export default function Payment() {
    function requestPayment() {
        return stripe
            .paymentRequestWithCardForm()
            .then((stripeTokenInfo: any) => {
                console.warn('Token created', { stripeTokenInfo });
            })
            .catch((error: Error) => {
                console.warn('Payment failed', { error });
            });
    }

    return (
        <ScrollView>
            <View>
                <TouchableHighlight style={styles.footerButton} onPress={requestPayment()}>
                    <Text style={styles.footerButtonText}>Fazer pagamento</Text>
                </TouchableHighlight>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    footerButton: {
        backgroundColor: '#cc0000',
        borderRadius: 5,
        marginVertical: 15,
        height: 50,
        justifyContent: 'center'
    },

    footerButtonText: {
        color: '#ffffff',
        alignSelf: 'center',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
    },
});