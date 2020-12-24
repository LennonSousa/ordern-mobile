import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContextOrdering } from '../../context/orderingContext';
import OrderItems from '../../components/OrderItems';
import Header from '../../components/PageHeader';
import { BorderlessButton } from 'react-native-gesture-handler';

export default function Cart() {
    const { order } = useContext(ContextOrdering);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Header title="Sacola" showCancel={false} showClearBag={true} />
            {
                order ? <ScrollView>
                    <View>
                        <Text style={styles.titles}>Entrega</Text>
                    </View>
                    <View>
                        <Text style={styles.titles}>Itens</Text>
                        {
                            order.orderItems.map(item => {
                                return <OrderItems key={item.id} orderItem={item} />
                            })
                        }
                    </View>

                    {/* Divider*/}
                    <View style={styles.divider}></View>

                    <View style={styles.totalRow}>
                        <View style={styles.totalColumnText}>
                            <Text style={styles.totalSubTitleText}>Subtotal</Text>
                        </View>
                        <View style={styles.totalColumnValue}>
                            <Text style={styles.totalSubTitleValue}>{`R$ ${Number(order.sub_total).toFixed(2).replace('.', ',')}`}</Text>
                        </View>
                    </View>

                    <View style={styles.totalRow}>
                        <View style={styles.totalColumnText}>
                            <Text style={styles.totalSubTitleText}>Taxa de entrega</Text>
                        </View>
                        <View style={styles.totalColumnValue}>
                            <Text style={styles.totalSubTitleValue}>{`R$ ${Number(order.delivery_tax).toFixed(2).replace('.', ',')}`}</Text>
                        </View>
                    </View>

                    <View style={styles.totalRow}>
                        <View style={styles.totalColumnText}>
                            <Text style={styles.totalTitleText}>Total</Text>
                        </View>
                        <View style={styles.totalColumnValue}>
                            <Text style={styles.totalTitleValue}>{`R$ ${Number(order.total).toFixed(2).replace('.', ',')}`}</Text>
                        </View>
                    </View>

                    <View style={styles.fieldsRow}>
                            <View style={styles.fieldsColumn}>
                                <BorderlessButton onPress={() => {
                                    navigation.navigate('Payments');
                                }}>
                                    <View style={styles.menuRow}>
                                        <View style={styles.menuColumn}>
                                            <Text>Forma de pagamento</Text>
                                        </View>
                                    </View>
                                    <View style={styles.menuDescriptionRow}>
                                        <View style={styles.menuDescriptionColumn}>
                                            <Text style={styles.textsDescriptionMenu}>Escolha a forma que você irá pagar.</Text>
                                        </View>
                                    </View>
                                </BorderlessButton>
                            </View>
                        </View>
                </ScrollView> :
                    <Text>Sacola vaiza!</Text>
            }

            <View>
                <TouchableHighlight style={styles.footerButton} onPress={() => { navigation.navigate('Shipment') }}>
                    <Text style={styles.footerButtonText}>Continuar</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
        },

        divider: {
            borderTopColor: '#e6e6e6',
            borderTopWidth: 1,
            marginHorizontal: 5,
            marginVertical: 15
        },

        fieldsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 15,
        },
    
        fieldsColumn: {
            flex: 1,
        },

        menuRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    
        menuColumn: {
            flex: 0.8,
        },

        menuIconColumn: {
            flex: 0.2,
            alignItems: 'flex-end',
        },
    
        textsMenu: {
            fontFamily: 'Nunito_600SemiBold',
            fontSize: 22,
            color: '#262626'
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

        titles: {
            fontFamily: 'Nunito_300Light',
            fontSize: 18,
            color: '#8c8c8c',
            marginVertical: 10,
        },

        totalRow: {
            flexDirection: 'row'
        },

        totalColumnText: {
            flex: 0.5,
            marginVertical: 5,
        },

        totalColumnValue: {
            flex: 0.5,
            marginVertical: 5,
        },

        totalSubTitleText: {
            fontFamily: 'Nunito_300Light',
            fontSize: 16,
            color: '#8c8c8c',
        },

        totalSubTitleValue: {
            fontFamily: 'Nunito_300Light',
            fontSize: 16,
            color: '#8c8c8c',
            textAlign: 'right',
        },

        totalTitleText: {
            fontFamily: 'Nunito_600SemiBold',
            fontSize: 18,
            color: '#595959',
        },

        totalTitleValue: {
            fontFamily: 'Nunito_600SemiBold',
            fontSize: 18,
            color: '#595959',
            textAlign: 'right',
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
    }
)