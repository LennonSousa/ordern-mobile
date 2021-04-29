import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Text, TouchableHighlight, ActivityIndicator, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import globalStyles, { colorPrimaryDark } from '../../../assets/styles/global';

import orderConfirmedImg from '../../../assets/images/successful_purchase.png';

export let statusModal: 'hidden' | 'waiting' | 'success' | 'order-confirmed' | 'error';

interface WaitingModalProps {
    status: 'hidden' | 'waiting' | 'success' | 'order-confirmed' | 'error',
    message: string;
}

export default function WaitingModal({ status, message }: WaitingModalProps) {
    const [modalWaiting, setModalWaiting] = useState(false);
    const [circleWaiting, setCircleWaiting] = useState(true);
    const [successWaiting, setSuccessWaiting] = useState(false);
    const [orderConfirmedWaiting, setOrderConfirmedWaiting] = useState(false);
    const [errorWaiting, setErrorWaiting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(message);

    useEffect(() => {
        if (status === 'waiting') {
            setCircleWaiting(true);
            setSuccessWaiting(false);
            setErrorWaiting(false);

            setModalWaiting(true);
        }
        else if (status === 'success') {
            setCircleWaiting(false);
            setSuccessWaiting(true);

            setModalWaiting(true);
        }
        else if (status === 'order-confirmed') {
            setCircleWaiting(false);
            setOrderConfirmedWaiting(true);

            setModalWaiting(true);
        }
        else if (status === 'error') {
            setCircleWaiting(false);
            setErrorWaiting(true);
            setErrorMessage(message);

            setModalWaiting(true);
        }
        else if (status === 'hidden') {
            setModalWaiting(false);

            setCircleWaiting(true);
            setSuccessWaiting(false);
            setErrorWaiting(false);
        }
    }, [status, message]);

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalWaiting}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={styles.modalView}>
                        <View style={{ marginVertical: 5 }}>
                            {
                                circleWaiting && <ActivityIndicator size="large" color="#fe3807" />
                            }
                            {
                                successWaiting && <FontAwesome5 name="check-circle" size={48} color="#33cc33" />
                            }
                            {
                                orderConfirmedWaiting &&
                                <View style={[globalStyles.row, { width: '80%', height: 200 }]}>
                                    <View style={globalStyles.column}>
                                        <View style={globalStyles.row}>
                                            <View style={[globalStyles.column, { alignItems: 'center' }]}>
                                                <Image source={orderConfirmedImg} style={styles.imageSuccessCart} />
                                            </View>
                                        </View>

                                        <View style={globalStyles.row}>
                                            <View style={[globalStyles.column, { alignItems: 'center' }]}>
                                                <Text style={globalStyles.titlePrimaryLight}>Sucesso!</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            }
                            {
                                errorWaiting && <View >
                                    <View style={{ marginVertical: 5, alignItems: 'center' }}>
                                        <FontAwesome5 name="times-circle" size={48} color="#fe3807" />
                                    </View>


                                    <View style={{ marginVertical: 5 }}>
                                        <Text style={[globalStyles.subTitlePrimary, { textAlign: 'center' }]}>{errorMessage}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', width: '100%' }}>
                                        <View style={{ flex: 1 }}>
                                            <TouchableHighlight
                                                underlayColor={colorPrimaryDark}
                                                style={globalStyles.footerButton}
                                                onPress={() => setModalWaiting(false)}
                                            >
                                                <Text style={globalStyles.footerButtonText}>Entendi!</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    imageSuccessCart: {
        height: '100%',
        resizeMode: 'contain'
    },
});