import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51I1cqjKzYHbNMhs91n4GYeyeo5VMe27LlB0X93C3UUUrKIrfADPDRmWqOyf9W8DZeyXShWP10CKik9cVdm7zmcUF005zn84KY5';

interface Card {
    [key: string]: string;
}

export default function Payment() {
    const [card, setCard] = useState<Card>({
        'card[number]': '4242424242424242',
        'card[exp_month]': '12',
        'card[exp_year]': '2021',
        'card[cvc]': '314'
    });

    async function requestPayment() {
        const creditCardToken = await getCreditCardToken(card);

        console.log(creditCardToken);
    }

    const getCreditCardToken = (creditCardData: Card) => {
        return fetch('https://api.stripe.com/v1/tokens', {
            headers: {
                // Use the correct MIME type for your server
                Accept: 'application/json',
                // Use the correct Content Type to send data in request body
                'Content-Type': 'application/x-www-form-urlencoded',
                // Use the Stripe publishable key as Bearer
                Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`
            },
            // Use a proper HTTP method
            method: 'post',
            // Format the credit card data to a string of key-value pairs
            // divided by &
            body: Object.keys(creditCardData)
                .map(key => key + '=' + creditCardData[key])
                .join('&')
        }).then(response => response.json());
    }

    return (
        <ScrollView>
            <View>
                <TouchableHighlight style={styles.footerButton} onPress={requestPayment}>
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