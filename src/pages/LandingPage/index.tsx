import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
    StyleSheet,
    ScrollView,
    SectionList,
    View,
    Dimensions,
    ImageBackground,
    Image,
    Text,
    TouchableOpacity,
    Modal,
    TouchableHighlight,
    Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import api from '../../services/api';

import { StoreContext } from '../../context/storeContext';

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
    colorSecondary,
    colorBackground,
} from '../../assets/styles/global';

const STATUS_BAR_HEIGHT = getStatusBarHeight();
const HEADER_HEIGHT = STATUS_BAR_HEIGHT > 24 ? 140 + STATUS_BAR_HEIGHT : 140;
const TOOLS_HEIGHT = 70;

export default function LandingPage() {
    const navigation = useNavigation();



    const { store, handleStore } = useContext(StoreContext);

    const sectionListCategories = useRef<SectionList>(null);
    const horizontalSectionListCategories = useRef<SectionList>(null);

    const scrollY = new Animated.Value(0);
    let selectedItemSectionHeader = new Animated.Value(0);

    // const [state, setState] = useState(true);

    // const AnimatedStatusBar = Animated.createAnimatedComponent(StatusBar);

    const [businessTimeModal, setbusinessTimeModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const animatedEvent = Animated.event([{
        nativeEvent: {
            contentOffset: { y: scrollY }
        },
    }],
        { useNativeDriver: false }
    );

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
        api.get('store')
            .then(res => {
                handleStore(res.data);
            })
            .catch(err => {
                console.log('error get store');
                console.log(err);
            });
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
    }, []);

    useEffect(() => {
        if (refreshing) {
            handleStore(undefined);

            api.get('store')
                .then(res => {
                    handleStore(res.data);
                    setRefreshing(false);
                })
                .catch(err => {
                    console.log('error get store');
                    console.log(err);
                    setRefreshing(false);
                });

        }
    }, [refreshing]);

    return (
        <View style={globalStyles.container}>
            <Animated.View
                style={
                    [styles.headerContainer, {
                        height: scrollY.interpolate({
                            inputRange: [-100, 0],
                            outputRange: [HEADER_HEIGHT + 100, HEADER_HEIGHT],
                            extrapolateRight: 'clamp'
                        }),
                        top: scrollY.interpolate({
                            inputRange: [0, 100],
                            outputRange: [0, -100],
                            extrapolateLeft: 'clamp',
                        }),
                    }]
                }
            >
                <ImageBackground style={styles.cover} source={{ uri: store?.cover }}>
                    <View style={styles.avatarContainer}>
                        <Animated.Image
                            source={{ uri: store?.avatar }}
                            style={[styles.avatar, {
                                opacity: scrollY.interpolate({
                                    inputRange: [0, 110],
                                    outputRange: [1, 0],
                                    extrapolate: 'clamp'
                                }),
                            }]}
                        />
                    </View>
                </ImageBackground>


                {
                    store && <View >
                        <View style={styles.toolsHeader}>
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
                                            color={colorHeaderBackground}
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
                                        backgroundColor: store.opened ? colorHighLight : colorPrimaryLight,
                                        borderRadius: 5,
                                        justifyContent: 'center'
                                    }}
                                >
                                    <View style={{
                                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Feather
                                            name={store.opened ? "thumbs-up" : "thumbs-down"}
                                            size={24}
                                            color="#ffffff"
                                            style={{ flex: 0.3, paddingHorizontal: 5 }}
                                        />
                                        <Text
                                            style={[globalStyles.textsButtonBorderMenu, {
                                                flex: 0.7, color: "#ffffff", textAlign: 'center'
                                            }]}
                                        >{store.opened ? "Aberto" : "Fechado"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            </Animated.View>

            {
                store && <Animated.SectionList
                    style={[styles.horizontalSectionList, {
                        opacity: scrollY.interpolate({
                            inputRange: [105, STATUS_BAR_HEIGHT > 24 ? (HEADER_HEIGHT + STATUS_BAR_HEIGHT) : HEADER_HEIGHT],
                            outputRange: [0, 1],
                            extrapolate: 'clamp'
                        }),
                        backgroundColor: colorHeaderBackground,
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
                    }]}
                    horizontal
                    sections={store.categories.map((category, index) => {
                        return {
                            index,
                            title: category.title,
                            data: category.products.map(product => { return product }),
                            paused: category.paused,
                        }
                    })}
                    keyExtractor={item => item.id}
                    renderItem={() => <View></View>}
                    renderSectionHeader={({ section: { index, title, paused } }) =>
                        !paused ? <TouchableHighlight
                            style={{
                                paddingHorizontal: 20,
                                paddingTop: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            underlayColor={colorSecondary}
                            onPress={() => {
                                horizontalSectionListCategories.current?.scrollToLocation({ sectionIndex: index, itemIndex: 0 });
                                sectionListCategories.current?.scrollToLocation({ sectionIndex: index, itemIndex: 0 });
                            }}
                        >
                            <Animated.View
                                style={{
                                    height: 70,
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={
                                    [
                                        globalStyles.subTitlePrimary, {
                                            alignSelf: 'center',
                                            color: colorPrimaryLight,
                                            borderBottomColor: colorPrimaryLight,
                                            borderBottomWidth: Number(index) === Number(selectedItemSectionHeader) ? 2 : 0,
                                        }
                                    ]
                                }>{title}</Text>
                            </Animated.View>
                        </TouchableHighlight> : null
                    }
                    showsHorizontalScrollIndicator={false}
                    ref={horizontalSectionListCategories}
                />
            }

            {
                store && store.categories ?
                    <SectionList
                        style={{ zIndex: 0 }}
                        ListHeaderComponent={
                            store.highlights && store.productsHighlights.length > 0 ?
                                <View style={{ marginTop: HEADER_HEIGHT }}>
                                    <Text style={globalStyles.titlePrimaryLight}>{store.highlights_title}</Text>

                                    <View style={{ height: 200, marginTop: 20 }}>
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                        >
                                            {
                                                store.productsHighlights.map((highlight, index) => {
                                                    return <Highlights key={index} highlight={highlight} />
                                                })
                                            }
                                        </ScrollView>
                                    </View>
                                </View> : <View></View>
                        }
                        sections={store.categories.map((category, index) => {
                            return {
                                index,
                                title: category.title,
                                data: category.products.map(product => { return product }),
                                paused: category.paused,
                            }
                        })}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <ProductItem product={item} />}
                        renderSectionHeader={({ section: { title, paused } }) => <CategoryItem title={title} paused={paused} />}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        stickySectionHeadersEnabled
                        showsVerticalScrollIndicator={false}
                        onScroll={animatedEvent}
                        onViewableItemsChanged={(info) => {
                            const product: Product = info.viewableItems[info.viewableItems.length - 1].item;

                            let itemToSelect = 0;

                            horizontalSectionListCategories.current?.props.sections.forEach((section, index) => {
                                if (product.category && section.data[0].category.id && section.data[0].category.id === product.category.id) {
                                    itemToSelect = index;
                                    selectedItemSectionHeader = new Animated.Value(index);
                                }
                            });

                            product.category && horizontalSectionListCategories.current?.scrollToLocation({ sectionIndex: itemToSelect, itemIndex: 0 });
                        }}
                        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }}
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
                                store && store.openedDays.map((weekDay, index) => {
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

    horizontalSectionList: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        top: 0,
        left: 0,
        zIndex: 3,
    },

    cover: {
        resizeMode: "cover",
        flex: 1
    },

    avatarContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatar: {
        width: 90,
        height: 90,
        resizeMode: 'cover',
        borderRadius: 100
    },

    headerContainer: {
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 5,
    },

    toolsHeader: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-end',
        height: STATUS_BAR_HEIGHT > 24 ? (TOOLS_HEIGHT + STATUS_BAR_HEIGHT) : TOOLS_HEIGHT,
        width: Dimensions.get('window').width,
        zIndex: 4,
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