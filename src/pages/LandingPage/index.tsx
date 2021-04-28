import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
    StyleSheet,
    ScrollView,
    SectionList,
    View,
    Dimensions,
    Text,
    TouchableOpacity,
    Modal,
    TouchableHighlight,
    Animated,
    RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import api from '../../services/api';

import { StoreContext } from '../../context/storeContext';
import { Store } from '../../components/Store';

import Highlights, { Highlight } from '../../components/Highlights';
import CategoryItem from '../../components/Categories';
import ProductItem, { Product } from '../../components/Products';
import ShimmerHeaderLandingPage from '../../components/Shimmers/HeaderLandingPage';
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
            {
                store ? <Animated.View
                    style={
                        [styles.headerContainer, {
                            top: scrollY.interpolate({
                                inputRange: [0, 100],
                                outputRange: [0, -100],
                                extrapolateLeft: 'clamp',
                            }),
                        }]
                    }
                >
                    <Animated.Image
                        style={[styles.cover, {
                            height: scrollY.interpolate({
                                inputRange: [-30, 50],
                                outputRange: [HEADER_HEIGHT + 20, HEADER_HEIGHT],
                                extrapolateRight: 'clamp',
                            })
                        }]}
                        source={{ uri: store?.cover }}
                    />

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


                </Animated.View> : <ShimmerHeaderLandingPage headerHeight={HEADER_HEIGHT} />
            }

            {
                store && <Animated.View style={[styles.toolsHeader, {
                    top: STATUS_BAR_HEIGHT > 24 ? (TOOLS_HEIGHT + STATUS_BAR_HEIGHT) : TOOLS_HEIGHT,
                    zIndex: scrollY.interpolate({
                        inputRange: [105, STATUS_BAR_HEIGHT > 24 ? (HEADER_HEIGHT + STATUS_BAR_HEIGHT) : HEADER_HEIGHT],
                        outputRange: [4, 0],
                        extrapolate: 'clamp'
                    }),
                    opacity: scrollY.interpolate({
                        inputRange: [0, STATUS_BAR_HEIGHT],
                        outputRange: [1, 0],
                        extrapolate: 'clamp'
                    }),
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
                </Animated.View>
            }

            {
                store && <Animated.SectionList
                    style={[styles.horizontalSectionList, {
                        opacity: scrollY.interpolate({
                            inputRange: [105, STATUS_BAR_HEIGHT > 24 ? (HEADER_HEIGHT + STATUS_BAR_HEIGHT) : HEADER_HEIGHT],
                            outputRange: [0, 1],
                            extrapolate: 'clamp'
                        }),
                        zIndex: scrollY.interpolate({
                            inputRange: [105, STATUS_BAR_HEIGHT > 24 ? (HEADER_HEIGHT + STATUS_BAR_HEIGHT) : HEADER_HEIGHT],
                            outputRange: [0, 2],
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
                                //horizontalSectionListCategories.current?.scrollToLocation({ sectionIndex: index, itemIndex: 0 });

                                sectionListCategories.current?.scrollToLocation({ sectionIndex: index, itemIndex: 0, viewOffset: 80 });
                            }}
                        >
                            <Animated.View
                                style={{
                                    height: 70,
                                    justifyContent: 'center',
                                }}
                            >
                                <Animated.Text style={
                                    [
                                        globalStyles.subTitlePrimary, {
                                            alignSelf: 'center',
                                            color: colorPrimaryLight,
                                            borderBottomColor: colorPrimaryLight,
                                            borderBottomWidth: index === selectedItemSectionHeader ? 2 : 0,
                                        }
                                    ]
                                }>{title}</Animated.Text>
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
                        style={{ zIndex: 5 }}
                        ListHeaderComponent={
                            store.highlights && store.productsHighlights.length > 0 ?
                                <View style={{ paddingTop: 10, marginTop: HEADER_HEIGHT, zIndex: 4 }}>
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
                        refreshControl={<RefreshControl
                            style={{ paddingTop: HEADER_HEIGHT }}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />}
                        stickySectionHeadersEnabled
                        showsVerticalScrollIndicator={false}
                        onScroll={animatedEvent}
                        onViewableItemsChanged={(info) => {
                            const product: Product = info.viewableItems.length > 0 ? info.viewableItems[info.viewableItems.length >= 1 ? info.viewableItems.length - 1 : 0].item : null;

                            let sectionIndex = 0;

                            if (product === null) return;

                            horizontalSectionListCategories.current?.props.sections.forEach((section, index) => {
                                if (product.category && section.data[0].category.id && section.data[0].category.id === product.category.id) {
                                    sectionIndex = index;
                                    selectedItemSectionHeader.setValue(index);
                                }
                            });

                            product.category && horizontalSectionListCategories.current?.scrollToLocation({ sectionIndex, itemIndex: 0 });
                        }}
                        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 100 }}
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
        </View >
    )
}

const styles = StyleSheet.create({
    containerCover: {
        alignItems: 'center',
    },

    headerContainer: {
        height: HEADER_HEIGHT,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        overflow: 'hidden',
    },

    cover: {
        position: 'absolute',
        width: '100%',
        resizeMode: "cover",
        top: 0,
        left: 0,
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

    toolsHeader: {
        position: 'absolute',
        flexDirection: 'row',
        left: 0,
        alignItems: 'center',
        height: STATUS_BAR_HEIGHT > 24 ? (TOOLS_HEIGHT + STATUS_BAR_HEIGHT) : TOOLS_HEIGHT,
        width: '100%',
    },

    horizontalSectionList: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        top: 0,
        left: 0,
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