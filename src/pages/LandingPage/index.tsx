import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
    StyleSheet,
    ScrollView,
    SectionList,
    View,
    Dimensions,
    ImageBackground,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TouchableHighlight,
    Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import api from '../../services/api';

import { RestaurantContext } from '../../context/restaurantContext';
import { OpenedDaysContext } from '../../context/openedDaysContext';
import { HighlightsContext } from '../../context/highlightsContext';
import { CategoriesContext } from '../../context/categoriesContext';

import Highlights from '../../components/Highlights';
import CategoryItem from '../../components/Categories';
import ProductItem, { Product } from '../../components/Products';
import LandingPageShimmer from '../../components/Shimmers/Landing';
import CategoriesShimmer from '../../components/Shimmers/Categories';
import { dayOfWeekAsInteger } from '../../utils/dayOfWeekAsInteger';
import { convertMinutesToHours } from '../../utils/convertHourToMinutes';

import globalStyles, {
    colorHighLight,
    colorPrimaryLight,
    colorPrimaryDark,
    colorTextDescription,
    colorHeaderBackground,
    colorSecundary,
    colorBackground,
} from '../../assets/styles/global';

export default function LandingPage() {
    const navigation = useNavigation();

    const STATUS_BAR_HEIGHT = getStatusBarHeight();
    const HEADER_HEIGHT = STATUS_BAR_HEIGHT > 24 ? 140 + STATUS_BAR_HEIGHT : 140;
    const TOOLS_HEIGHT = 70;

    const { restaurant, handleRestaurant } = useContext(RestaurantContext);
    const { highlights, handleHighlights } = useContext(HighlightsContext);
    const { categories, handleCategories } = useContext(CategoriesContext);

    const sectionListCategories = useRef<SectionList>(null);
    const horizontalSectionListCategories = useRef<SectionList>(null);

    const { isOpened, openedDays, handleOpenedDays } = useContext(OpenedDaysContext);

    const scrollY = new Animated.Value(0);

    // const [state, setState] = useState(true);

    // const AnimatedStatusBar = Animated.createAnimatedComponent(StatusBar);

    const [businessTimeModal, setbusinessTimeModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const animatedEvent = Animated.event([{
        nativeEvent: {
            contentOffset: { y: scrollY }
        },
    }],
        { useNativeDriver: false });

    // const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    //     let y = nativeEvent.contentOffset.y;

    //     scrollY.setValue(y); // set scroll animation value here

    //     if (y > 100 && state) {
    //         setState(false);
    //     }
    //     if (y < 100 && !state) {
    //         setState(true);
    //     }
    // };

    useEffect(() => {
        api.get('stores')
            .then(res => {
                handleRestaurant(res.data[0]);

                api.get('highlights/landing')
                    .then(res => {
                        handleHighlights(res.data);

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
            api.get('stores')
                .then(res => {
                    handleRestaurant(res.data[0]);

                    api.get('highlights/landing')
                        .then(res => {
                            handleHighlights(res.data);

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
        <View style={globalStyles.container}>
            {
                restaurant ? <>
                    <Animated.View style={
                        [
                            styles.containerCover,
                            {
                                height: scrollY.interpolate({
                                    inputRange: [0, HEADER_HEIGHT],
                                    outputRange: [HEADER_HEIGHT, STATUS_BAR_HEIGHT > 24 ? (TOOLS_HEIGHT + STATUS_BAR_HEIGHT) : TOOLS_HEIGHT],
                                    extrapolate: 'clamp'
                                }),
                                position: 'relative',
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
                                    }),
                                }]}
                            ></Animated.Image>
                        </ImageBackground>

                        <Animated.View style={[styles.toolsHeader, styles.withShadow, {
                            backgroundColor: scrollY.interpolate({
                                inputRange: [105, STATUS_BAR_HEIGHT > 24 ? (HEADER_HEIGHT + STATUS_BAR_HEIGHT) : HEADER_HEIGHT],
                                outputRange: ['transparent', colorHeaderBackground],
                                extrapolate: 'clamp'
                            }),
                            shadowOpacity: scrollY.interpolate({
                                inputRange: [105, STATUS_BAR_HEIGHT > 24 ? (HEADER_HEIGHT + STATUS_BAR_HEIGHT) : HEADER_HEIGHT],
                                outputRange: [0, 0.25],
                                extrapolate: 'clamp'
                            }),
                            elevation: scrollY.interpolate({
                                inputRange: [105, STATUS_BAR_HEIGHT > 24 ? (HEADER_HEIGHT + STATUS_BAR_HEIGHT) : HEADER_HEIGHT],
                                outputRange: [0, 5],
                                extrapolate: 'clamp'
                            }),
                            height: STATUS_BAR_HEIGHT > 24 ? (TOOLS_HEIGHT + STATUS_BAR_HEIGHT) : TOOLS_HEIGHT,
                        }]}>
                            <View style={
                                {
                                    flex: 0.3, justifyContent: 'center', alignItems: 'center'
                                }
                            }>
                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Search') }}
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
                categories && <SectionList
                    horizontal
                    sections={categories.map((category, index) => {
                        return {
                            index,
                            title: category.title,
                            data: category.products.map(product => { return product }),
                            paused: category.paused,
                        }
                    })}
                    keyExtractor={item => String(item.id)}
                    renderItem={() => <View></View>}
                    renderSectionHeader={({ section: { index, title, paused } }) =>
                        !paused ? <TouchableHighlight
                            style={{
                                paddingHorizontal: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            underlayColor={colorSecundary}
                            onPress={() => {
                                horizontalSectionListCategories.current?.scrollToLocation({ sectionIndex: index, itemIndex: 0 });
                                sectionListCategories.current?.scrollToLocation({ sectionIndex: index, itemIndex: 0 });
                            }}
                        >
                            <View style={{ height: 50, justifyContent: 'center' }}>
                                <Text style={[globalStyles.subTitlePrimary, { alignSelf: 'center', color: colorPrimaryLight }]}>{title}</Text>
                            </View>
                        </TouchableHighlight> : null
                    }
                    showsHorizontalScrollIndicator={false}
                    ref={horizontalSectionListCategories}
                />
            }

            {
                categories ?
                    <SectionList
                        ListHeaderComponent={
                            restaurant && restaurant.highlights && highlights && highlights.length > 0 ? <View style={{ flex: 1, backgroundColor: colorBackground, }}>
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
                            </View> : <View></View>
                        }
                        sections={categories.map(category => {
                            return {
                                title: category.title,
                                data: category.products.map(product => { return product }),
                                paused: category.paused,
                            }
                        })}
                        keyExtractor={item => String(item.id)}
                        renderItem={({ item }) => <ProductItem product={item} />}
                        renderSectionHeader={({ section: { title, paused } }) => <CategoryItem title={title} paused={paused} />}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        stickySectionHeadersEnabled
                        showsVerticalScrollIndicator={false}
                        onScroll={animatedEvent}
                        ref={sectionListCategories}
                    /> :
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
        </View>
    )
}

const styles = StyleSheet.create({
    containerCover: {
        alignItems: 'center',
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
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 10,
        position: 'absolute',
        bottom: -10,
        paddingBottom: 10,
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