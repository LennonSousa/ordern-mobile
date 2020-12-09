import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';

import api from '../../services/api';
import { ScrollView } from 'react-native-gesture-handler';

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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
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
    }
});