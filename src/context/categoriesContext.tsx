import React, { createContext, useState } from 'react';

import { Category } from '../components/Categories';

interface CategoriesContextData {
    categories: Category[] | undefined;
    handleCategories(categories: Category[]): void;
}

const CategoriesContext = createContext<CategoriesContextData>({} as CategoriesContextData);

const CategoriesProvider: React.FC = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    function handleCategories(categories: Category[]) {
        setCategories(categories);
    }

    return (
        <CategoriesContext.Provider value={{ categories, handleCategories }}>
            {children}
        </CategoriesContext.Provider>
    );
}

export { CategoriesContext, CategoriesProvider };