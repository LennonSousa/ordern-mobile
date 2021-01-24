import React, { createContext, useState } from 'react';

import { Restaurant } from '../components/Restaurant';

interface RestaurantContextData {
    restaurant: Restaurant | undefined;
    handleRestaurant(categories: Restaurant): void;
}

const RestaurantContext = createContext<RestaurantContextData>({} as RestaurantContextData);

const RestaurantProvider: React.FC = ({ children }) => {
    const [restaurant, setRestaurant] = useState<Restaurant | undefined>();

    function handleRestaurant(restaurantItem: Restaurant) {
        setRestaurant(restaurantItem);
    }

    return (
        <RestaurantContext.Provider value={{ restaurant, handleRestaurant }}>
            {children}
        </RestaurantContext.Provider>
    );
}

export { RestaurantContext, RestaurantProvider };