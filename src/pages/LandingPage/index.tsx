import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    ImageBackground,
    StatusBar,
    RefreshControl,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TouchableHighlight,
    Animated
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import api from '../../services/api';

import { RestaurantContext } from '../../context/restaurantContext';
import { OpenedDaysContext } from '../../context/openedDaysContext';
import { CategoriesContext } from '../../context/categoriesContext';

import Highlights, { Highlight } from '../../components/Highlights';
import CategoryItem from '../../components/Categories';
import LandingPageShimmer from '../../components/Shimmers/Landing';
import CategoriesShimmer from '../../components/Shimmers/Categories';
import { dayOfWeekAsInteger } from '../../utils/dayOfWeekAsInteger';
import { convertMinutesToHours } from '../../utils/convertHourToMinutes';

import globalStyles, {
    colorBackground,
    colorHighLight,
    colorPrimaryLight,
    colorPrimaryDark,
    colorTextDescription,
    colorHeaderBackground
} from '../../assets/styles/global';

export default function LandingPage() {
    const { restaurant, handleRestaurant } = useContext(RestaurantContext);
    const { categories, handleCategories } = useContext(CategoriesContext);

    const { isOpened, openedDays, handleOpenedDays } = useContext(OpenedDaysContext);

    const [highlights, setHighlights] = useState<Highlight[]>([]);

    const [scrollY] = useState(new Animated.Value(0));
    const [businessTimeModal, setbusinessTimeModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        api.get('restaurants')
            .then(res => {
                handleRestaurant(res.data[0]);

                api.get('highlights/landing')
                    .then(res => {
                        setHighlights(res.data);

                        api.get('categories')
                            .then(res => {
                                handleCategories(res.data);

                                handleOpenedDays();
                            })
                            .catch(err => {
                                console.log('error get categories');
                                console.log(err);
                            });
                    })
                    .catch(err => {
                        console.log('error get highlights');
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log('error get restaurants');
                console.log(err);
            });
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleCategories(undefined);
    }, []);

    useEffect(() => {
        if (refreshing) {
            api.get('restaurants')
                .then(res => {
                    handleRestaurant(res.data[0]);

                    api.get('highlights/landing')
                        .then(res => {
                            setHighlights(res.data);

                            api.get('categories')
                                .then(res => {
                                    handleCategories(res.data);

                                    handleOpenedDays();
                                })
                                .catch(err => {
                                    console.log('error get categories');
                                    console.log(err);
                                });
                        })
                        .catch(err => {
                            console.log('error get highlights');
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log('error get restaurants');
                    console.log(err);
                });

            setRefreshing(false);
        }
    }, [refreshing]);

    return (
        <SafeAreaView style={globalStyles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colorBackground} />
            {
                restaurant ? <>
                    <Animated.View style={
                        [
                            styles.containerCover,
                            {
                                height: scrollY.interpolate({
                                    inputRange: [0, 110],
                                    outputRange: [110, 40],
                                    extrapolate: 'clamp'
                                }),
                                position: 'relative'
                            }
                        ]}
                    >
                        <ImageBackground
                            source={{ uri: restaurant.cover }}
                            style={styles.cover}
                        >
                            <Animated.Image
                                source={{ uri: restaurant.avatar }}
                                style={[styles.avatar, {
                                    width: scrollY.interpolate({
                                        inputRange: [0, 110],
                                        outputRange: [90, 40],
                                        extrapolate: 'clamp'
                                    }),
                                    height: scrollY.interpolate({
                                        inputRange: [0, 110],
                                        outputRange: [90, 40],
                                        extrapolate: 'clamp'
                                    }),
                                    opacity: scrollY.interpolate({
                                        inputRange: [0, 110],
                                        outputRange: [1, 0.25],
                                        extrapolate: 'clamp'
                                    })
                                }]}
                            ></Animated.Image>
                        </ImageBackground>

                        <Animated.View style={[styles.toolsHeader, globalStyles.row, styles.withShadow, {
                            backgroundColor: scrollY.interpolate({
                                inputRange: [105, 110],
                                outputRange: ['transparent', colorHeaderBackground],
                                extrapolate: 'clamp'
                            }),
                            shadowOpacity: scrollY.interpolate({
                                inputRange: [105, 110],
                                outputRange: [0, 0.25],
                                extrapolate: 'clamp'
                            }),
                            elevation: scrollY.interpolate({
                                inputRange: [105, 110],
                                outputRange: [0, 5],
                                extrapolate: 'clamp'
                            })
                        }]}>
                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => { setbusinessTimeModal(true) }}
                                    style={{
                                        width: 95,
                                        height: 30,
                                        justifyContent: 'center'
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Feather
                                            name="search"
                                            size={24}
                                            color={colorPrimaryLight}
                                            style={{ flex: 0.3, paddingHorizontal: 5 }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 0.4 }}></View>

                            <View style={{ flex: 0.3, alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => { setbusinessTimeModal(true) }}
                                    style={{
                                        width: 95,
                                        height: 30,
                                        backgroundColor: isOpened ? colorHighLight : colorPrimaryLight,
                                        borderRadius: 5,
                                        justifyContent: 'center'
                                    }}
                                >
                                    {
                                        openedDays ? <View style={{
                                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Feather
                                                name={isOpened ? "thumbs-up" : "thumbs-down"}
                                                size={24}
                                                color="#ffffff"
                                                style={{ flex: 0.3, paddingHorizontal: 5 }}
                                            />
                                            <Text
                                                style={[globalStyles.textsButtonBorderMenu, { flex: 0.7, color: "#ffffff", textAlign: 'center' }]}>{isOpened ? "Aberto" : "Fechado"}
                                            </Text>
                                        </View> :
                                            <ActivityIndicator size="small" color="#ffffff" />
                                    }
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </Animated.View>
                </> :
                    <LandingPageShimmer />
            }

            {
                categories ? <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{
                        nativeEvent: {
                            contentOffset: { y: scrollY }
                        },
                    }],
                        { useNativeDriver: false })}
                >
                    {
                        restaurant && restaurant.highlights && highlights.length > 0 && <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 10 }}>
                            <Text style={globalStyles.titlePrimaryLight}>{restaurant.highlights_title}</Text>

                            <View style={{ height: 200, marginTop: 20 }}>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {
                                        highlights && highlights.map((highlight, index) => {
                                            return <Highlights key={index} highlight={highlight} />
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    }

                    {
                        categories && categories.map((category, index) => {
                            return <CategoryItem key={index} category={category} />
                        })
                    }
                </ScrollView> :
                    <CategoriesShimmer />
            }

            { /*Modal choose card brand*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={businessTimeModal}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={styles.modalView}>
                        <View style={{ marginVertical: 5 }}>
                            <FontAwesome5 name="business-time" size={48} color="#fe3807" />
                        </View>

                        <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                            <View style={{ marginVertical: 5 }}>
                                <Text style={[globalStyles.subTitlePrimary, { textAlign: 'center' }]}>Nossos horários</Text>
                            </View>

                            {
                                openedDays && openedDays.map((weekDay, index) => {
                                    return (
                                        weekDay.opened && <View key={index} style={styles.containerCardBrands}>
                                            <View style={globalStyles.row}>
                                                <View style={globalStyles.column}>
                                                    <View style={globalStyles.menuRow}>
                                                        <View style={globalStyles.colTitleButtonItem}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={globalStyles.colTitleButtonItem}>
                                                                    <Text style={globalStyles.textsButtonBorderMenu}>{dayOfWeekAsInteger(weekDay.week_day)}</Text>
                                                                </View>
                                                            </View>

                                                            {
                                                                weekDay.daySchedules.map((schedule, index) => {
                                                                    return <View key={index} style={{ flexDirection: 'row' }}>
                                                                        <View style={globalStyles.colTitleButtonItem}>
                                                                            <Text style={globalStyles.textsButtonBorderMenu}>{`${convertMinutesToHours(schedule.from)} - ${convertMinutesToHours(schedule.to)}`}</Text>
                                                                        </View>
                                                                    </View>
                                                                })
                                                            }


                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>

                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <View style={{ flex: 1 }}>
                                <TouchableHighlight
                                    underlayColor={colorPrimaryDark}
                                    style={globalStyles.footerButton}
                                    onPress={() => { setbusinessTimeModal(false) }}
                                >
                                    <Text style={globalStyles.footerButtonText}>Entendi</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    containerCover: {
        alignItems: 'center'
    },

    cover: {
        width: Dimensions.get('window').width,
        height: '100%',
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center'
    },

    avatar: {
        resizeMode: 'cover',
        borderRadius: 100
    },

    toolsHeader: {
        width: Dimensions.get('window').width,
        height: 40,
        position: 'absolute',
        bottom: -10,
    },

    withShadow: {
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowColor: "#000",
        shadowRadius: 3.84,
    },

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
        elevation: 5,
        width: '80%',
        height: '80%'
    },

    containerCardBrands: {
        marginVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderColor: colorTextDescription,
        borderWidth: 1,
    },
});