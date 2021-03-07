import React, { createContext, useState } from 'react';

import { Highlight } from '../components/Highlights';

interface HighlightsContextData {
    highlights: Highlight[] | undefined;
    handleHighlights(restaurantItem: Highlight[] | undefined): void;
}

const HighlightsContext = createContext<HighlightsContextData>({} as HighlightsContextData);

const HighlightsProvider: React.FC = ({ children }) => {
    const [highlights, setHighlights] = useState<Highlight[] | undefined>([]);

    function handleHighlights(highlightsItem: Highlight[]) {
        setHighlights(highlightsItem);
    }

    return (
        <HighlightsContext.Provider value={{ highlights, handleHighlights }}>
            {children}
        </HighlightsContext.Provider>
    );
}

export { HighlightsContext, HighlightsProvider };