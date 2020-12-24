import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';
import stripeapi from '../../services/stripeapi';

import { CustomerContext } from '../../context/customerContext';
import { CustomerPayment } from '../../components/CustomerPayments';
import Input from '../../components/Interfaces/Inputs';
import InvalidFeedback from '../../components/Interfaces/InvalidFeedback';
import { BorderlessButton } from 'react-native-gesture-handler';

interface Card {
    [key: string]: string;
}

const validatiionSchema = Yup.object().shape({
    cvc: Yup.number().required('Obrigatório!'),
});

export default function Payment() {
    const navigation = useNavigation();
    const { customer, handleCustomer } = useContext(CustomerContext);

    const [selectedCard, setSelectedCard] = useState<CustomerPayment>();
    const [pendingPayment, setPendingPayment] = useState(false);

    async function requestPayment(card: Card) {
        const creditCardToken = await getCreditCardToken(card);

        console.log('Token gerado', creditCardToken);

        console.log('Enviando requisição ao backend...');

        api.post('dopayments', {
            "amount": 1560,
            "tokenId": creditCardToken.data.id
        }).then(() => {
            console.warn('Payment succeeded!');
        })
            .catch(error => {
                console.warn('Payment failed', { error });
            })
            .finally(() => {
                console.warn('Payment finished!');
            });
    }

    const getCreditCardToken = async (creditCardData: Card) => {
        const response = await stripeapi.post('tokens',
            Object.keys(creditCardData)
                .map(key => key + '=' + creditCardData[key])
                .join('&')
        );
        return response;

        // return fetch('https://api.stripe.com/v1/tokens', {
        //     headers: {
        //         // Use the correct MIME type for your server
        //         Accept: 'application/json',
        //         // Use the correct Content Type to send data in request body
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         // Use the Stripe publishable key as Bearer
        //         Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`
        //     },
        //     // Use a proper HTTP method
        //     method: 'post',
        //     // Format the credit card data to a string of key-value pairs
        //     // divided by &
        //     body: Object.keys(creditCardData)
        //         .map(key => key + '=' + creditCardData[key])
        //         .join('&')
        // }).then(response => response.json());
    }

    return (
        <View style={styles.container}>
            <View style={styles.fieldsRow}>
                <View style={styles.fieldsColumn}>
                    <View style={styles.menuRow}>
                        <View style={styles.menuColumn}>
                            <Text>Pagamento</Text>
                        </View>
                        <View style={styles.menuIconColumn}>
                            <TouchableHighlight
                                style={styles.buttonNewItem}
                                underlayColor="#e8e8e8"
                                onPress={() => {
                                    navigation.navigate('PaymentsCustomer');
                                }}
                            >
                                <View>
                                    <Feather name="plus" size={24} color="#cc0000" />
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={styles.menuDescriptionRow}>
                        <View style={styles.menuDescriptionColumn}>
                            <Text style={styles.textsDescriptionMenu}>Escolha uma forma de pagamento ou adicione uma nova.</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.containerMenu}>
                <View style={styles.containerItem}>
                    <View style={styles.fieldsRow}>
                        <View style={styles.fieldsColumn}>
                            <View style={styles.menuRow}>
                                <View style={styles.colTitleButtonItem}>
                                    <BorderlessButton onPress={() => { setSelectedCard(undefined) }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={styles.colTitleButtonItem}>
                                                <Feather name="dollar-sign" size={24} color="#cc0000" />
                                                <Text style={{ color: '#8c8c8c' }}>Dinheiro</Text>
                                            </View>
                                            <View style={styles.colIconButtonItem}>
                                                {
                                                    !selectedCard && <Feather name="check" size={24} color="#cc0000" />
                                                }
                                            </View>
                                        </View>
                                    </BorderlessButton>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {
                    customer && customer.payment && customer.payment.map((payment, index) => {
                        return <View key={index} style={styles.containerItem}>
                            <View style={styles.fieldsRow}>
                                <View style={styles.fieldsColumn}>
                                    <View style={styles.menuRow}>
                                        <View style={styles.colTitleButtonItem}>
                                            <BorderlessButton onPress={() => { setSelectedCard(payment) }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={styles.colTitleButtonItem}>
                                                        <Text style={{ color: '#8c8c8c' }}>{`${payment.card_number} - ${payment.valid}`}</Text>
                                                    </View>
                                                    <View style={styles.colIconButtonItem}>
                                                        {       
                                                            selectedCard && selectedCard.id === payment.id && <Feather name="check" size={24} color="#cc0000" />
                                                        }
                                                    </View>
                                                </View>
                                            </BorderlessButton>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    })
                }
            </ScrollView>

            {
                selectedCard ? <Formik
                    initialValues={
                        {
                            cvc: ''
                        }
                    }
                    onSubmit={async values => {
                        if (selectedCard) {
                            requestPayment({
                                'card[number]': selectedCard.card_number,
                                'card[exp_month]': selectedCard.valid.substring(0, 1),
                                'card[exp_year]': selectedCard.valid.substring(2, 3),
                                'card[cvc]': values.cvc,
                                'card[name]': selectedCard.name
                            });
                        }

                    }}
                    validationSchema={validatiionSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <View>
                            <View style={styles.fieldsRow}>
                                <View style={{ flex: 0.5 }}>
                                    <Input
                                        style={styles.fieldsLogIn}
                                        title='Código de segurança'
                                        keyboardType='number-pad'
                                        onChangeText={handleChange('cvc')}
                                        onBlur={handleBlur('cvc')}
                                        value={values.cvc}
                                    />
                                    <InvalidFeedback message={errors.cvc}></InvalidFeedback>
                                </View>
                            </View>

                            <TouchableHighlight style={styles.footerButton} onPress={handleSubmit as any}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.footerButtonText}>Continuar</Text>
                                    {
                                        !pendingPayment ? <ActivityIndicator size="large" color="#ffffff" /> :
                                            <Feather name="chevron-right" size={24} color="#cc0000" />
                                    }
                                </View>
                            </TouchableHighlight>
                        </View>
                    )}
                </Formik> :
                    <View>
                        <TouchableHighlight style={styles.footerButton} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.footerButtonText}>Continuar</Text>
                                {
                                    !pendingPayment ? <ActivityIndicator size="large" color="#ffffff" /> :
                                        <Feather name="chevron-right" size={24} color="#cc0000" />
                                }
                            </View>
                        </TouchableHighlight>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    containerMenu: {
        paddingHorizontal: 15,
    },

    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    menuColumn: {
        flex: 0.8,
    },

    menuDescriptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    menuDescriptionColumn: {
        flex: 1,
    },

    textsDescriptionMenu: {
        fontFamily: 'Nunito_300Light',
        fontSize: 14,
        color: '#8c8c8c'
    },

    menuIconColumn: {
        flex: 0.2,
        alignItems: 'flex-end',
    },

    fieldsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },

    fieldsColumn: {
        flex: 1,
    },

    buttonNewItem: {
        padding: 10,
        borderRadius: 5,
    },

    colTitleButtonItem: {
        flex: 0.9,
    },

    colIconButtonItem: {
        flex: 0.1,
    },

    containerItem: {
        marginVertical: 5,
        padding: 10,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 8
    },

    buttonTypeAddressCustomer: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#e8e8e8',
        alignItems: 'center',
    },

    buttonAction: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#cc0000',
        alignItems: 'center',
    },

    buttonConfirm: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ffcc00',
        alignItems: 'center',
    },

    fieldsLogIn: {
        marginVertical: 8,
    },

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