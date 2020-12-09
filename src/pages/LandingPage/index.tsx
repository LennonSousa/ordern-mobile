import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, TouchableHighlight, View, Image, Dimensions, ImageBackground, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import api from '../../services/api';
import { ScrollView } from 'react-native-gesture-handler';

import { ContextOrdering } from '../../context/orderingContext';
import CategoryItem, { Category } from '../../components/Categories';

interface Restaurant {
    id: number,
    title: string,
    phone: string,
    description: string,
    min_order: number,
    cover: string,
    avatar: string,
    zip_code: string,
    street: string,
    number: string,
    group: string,
    city: string,
    country: string
}

export default function LandingPage() {
    const navigation = useNavigation();

    const { order } = useContext(ContextOrdering);
    const [amountOrderItems, setAmountOrderItems] = useState(0);

    const [restaurant, setRestaurant] = useState<Restaurant>();
    const [categories, setCategories] = useState<Category[]>()

    useEffect(() => {
        api.get('restaurants')
            .then(res => {
                setRestaurant(res.data[0]);

                api.get('categories')
                    .then(res => {
                        setCategories(res.data);
                    })
                    .catch(err => {
                        console.log('error get categories');
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log('error get restaurants');
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (order) {
            let totalAmount = 0;
            order.orderItems.forEach(item => {
                totalAmount = totalAmount + item.amount;
            });

            setAmountOrderItems(totalAmount);
        }
    }, [order]);

    return (
        <View style={styles.container}>
            <View style={styles.containerCover}>
                <ImageBackground source={{ uri: restaurant?.cover }} style={styles.cover}>
                    <Image source={{ uri: restaurant?.avatar }} style={styles.avatar}></Image>
                </ImageBackground>
            </View>

            <ScrollView horizontal>
                <TouchableOpacity >
                    <Feather name="plus" size={20} color="#fff" />
                </TouchableOpacity>
            </ScrollView>

            <ScrollView>
                {
                    categories && categories.map((category, index) => {
                        return <CategoryItem key={index} category={category} />
                    })
                }
            </ScrollView>

            {
                order && <View>
                    <TouchableHighlight style={styles.footerButton} underlayColor="#ff0000" onPress={() => { navigation.navigate('Cart'); }}>
                        <View style={styles.footerButtonRow}>
                            <View style={styles.footerButtonColumnIcon}>
                                <View style={styles.footerButtonIconRow}>
                                    <View style={styles.footerButtonIconColumnBag}>
                                        <Feather name="shopping-bag" size={20} color="#fff" />
                                    </View>
                                    <View style={styles.footerButtonIconColumnAmount}>
                                        <Text style={styles.footerButtonIconColumnAmountText}>{amountOrderItems}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.footerButtonColumnText}>
                                <Text style={styles.footerButtonText}>Ver sacola</Text>
                            </View>

                            <View style={styles.footerButtonColumnTotal}>
                                <Text style={styles.footerButtonText}>{`R$ ${Number(order.total).toFixed(2).replace('.', ',')}`}</Text>
                            </View>
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
        backgroundColor: '#e2e2e2',
    },

    containerCover: {
        alignItems: 'center'
    },

    cover: {
        width: Dimensions.get('window').width,
        height: 110,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center'
    },

    avatar: {
        width: 75,
        height: 75,
        resizeMode: 'cover',
        borderRadius: 100
    },

    footerButton: {
        backgroundColor: '#cc0000',
        height: 45,
        justifyContent: 'center'
    },

    footerButtonRow: {
        flexDirection: 'row',
    },

    footerButtonColumnIcon: {
        flex: 3,
        alignItems: 'center',
    },

    footerButtonIconRow: {
        flexDirection: 'row',
    },

    footerButtonIconColumnBag: {
        flex: 0.5,
        alignItems: 'flex-end',
    },

    footerButtonIconColumnAmount: {
        flex: 0.5,
        alignItems: 'flex-start'
    },

    footerButtonIconColumnAmountText: {
        width: 20,
        backgroundColor: '#ffffff',
        color: '#cc0000',
        borderRadius: 10,
        textAlign: 'center',
    },

    footerButtonColumnText: {
        flex: 4,
    },

    footerButtonColumnTotal: {
        flex: 3,
        alignItems: 'center',
    },

    footerButtonText: {
        color: '#ffffff',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
        textAlign: 'center',
    },
});