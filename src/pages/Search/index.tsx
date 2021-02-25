import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Image,
    Text,
    StatusBar
} from 'react-native';

import { CategoriesContext } from '../../context/categoriesContext';

import Input from '../../components/Interfaces/Inputs';
import CategoryItem, { Category } from '../../components/Categories';

import searchResult from '../../assets/images/undraw_searching_p5ux.png';

import globalStyles from '../../assets/styles/global';

export default function Search() {
    const { categories } = useContext(CategoriesContext);

    const [results, setResults] = useState(categories)

    useEffect(() => {
        setResults(categories);
    }, []);

    function handleSearch(term: string) {
        if (term === "") {
            setResults(categories);
        }
        else if (categories) {

            let resultsUpdated: Category[] = [];

            categories.forEach(category => {
                const productsFound = category.products.filter(product => {
                    return product.title.toLocaleLowerCase().includes(term.toLocaleLowerCase());
                });

                if (productsFound.length > 0) resultsUpdated.push({
                    ...category, products: productsFound
                });
            });

            setResults(resultsUpdated);
        }
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={globalStyles.fieldsRow}>
                <View style={globalStyles.fieldsColumn}>
                    <Input
                        style={globalStyles.fieldsLogIn}
                        title='Nome do produto'
                        placeholder='Digite aqui para buscar'
                        onChangeText={(e) => { handleSearch(e) }}
                    />
                </View>
            </View>
            {
                results && results.length > 0 ? <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        results.map((category, index) => {
                            return <CategoryItem key={index} category={category} />
                        })
                    }
                </ScrollView> :
                    <>
                        <View style={[globalStyles.row, { marginVertical: 0 }]}>
                            <View style={[globalStyles.column, { alignItems: 'center', width: '90%' }]}>
                                <Image source={searchResult} style={
                                    {
                                        width: `90%`,
                                        height: 150,
                                        resizeMode: 'contain'
                                    }
                                } />
                            </View>
                        </View>
                        <View style={[globalStyles.row, { marginVertical: 0 }]}>
                            <View style={[globalStyles.column, { alignItems: 'center' }]}>
                                <Text style={globalStyles.titlePrimaryLight}>Produto não encontrado!</Text>
                                <Text style={globalStyles.textDescription}>Não encontramos nenhum produto pela sua busca.</Text>
                            </View>
                        </View>
                    </>
            }
        </SafeAreaView>
    )
}