import React, { createContext, useState } from 'react';
import { getDay, getHours, getMinutes } from 'date-fns';

import api from '../services/api';

import { OpenedDay } from '../components/Restaurant/OpenedDays';

import { convertHourToMinutes } from '../utils/convertHourToMinutes';

interface OpenedDaysContextData {
    isOpened: boolean;
    openedDays: OpenedDay[] | undefined;
    handleOpenedDays(): void;
}

const OpenedDaysContext = createContext<OpenedDaysContextData>({} as OpenedDaysContextData);

const OpenedDaysProvider: React.FC = ({ children }) => {
    const [openedDays, setOpenedDays] = useState<OpenedDay[] | undefined>();
    const [isOpened, setIsOpened] = useState(false);

    async function handleOpenedDays() {
        try {
            setOpenedDays(undefined);

            const res = await api.get('restaurant/opened-days');

            setOpenedDays(res.data);

            const items: OpenedDay[] = res.data;

            const weekDay = getDay(Date.now());

            const todayAvailable = items.find(item => { return item.week_day === weekDay && item.opened });

            if (todayAvailable) {
                const now = Date.now();
                const minutesNow = convertHourToMinutes(`${getHours(now)}:${getMinutes(now)}`);

                let foundOpened = false;

                todayAvailable.daySchedules.forEach(daySchedule => {
                    if (minutesNow >= daySchedule.from && minutesNow <= daySchedule.to)
                        foundOpened = true;
                });

                if (foundOpened)
                    setIsOpened(true);
                else
                    setIsOpened(false);
            }
            else
                setIsOpened(false);
        }
        catch {
            console.log('error get restaurant opened days');
        }
    }

    return (
        <OpenedDaysContext.Provider value={{ isOpened, openedDays, handleOpenedDays }}>
            {children}
        </OpenedDaysContext.Provider>
    );
}

export { OpenedDaysContext, OpenedDaysProvider };