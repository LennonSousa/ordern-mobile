import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Dimensions, ImageBackground, StatusBar } from 'react-native';

import api from '../../services/api';
import { ScrollView } from 'react-native-gesture-handler';

import { CategoriesContext } from '../../context/categoriesContext';
import CategoryItem from '../../components/Categories';

import globalStyles, { colorBackground } from '../../assets/styles/global';

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
    const { categories, handleCategories } = useContext(CategoriesContext);

    const [restaurant, setRestaurant] = useState<Restaurant>();

    useEffect(() => {
        api.get('restaurants')
            .then(res => {
                setRestaurant(res.data[0]);

                api.get('categories')
                    .then(res => {
                        handleCategories(res.data);
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
        <View style={globalStyles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colorBackground} />
            <View style={styles.containerCover}>
                <ImageBackground source={{ uri: restaurant?.cover }} style={styles.cover}>
                    <Image source={{ uri: restaurant?.avatar }} style={styles.avatar}></Image>
                </ImageBackground>
            </View>

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
        width: 90,
        height: 90,
        resizeMode: 'cover',
        borderRadius: 100
    },
});