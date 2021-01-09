import { getDay, getHours, getMinutes } from 'date-fns';

import { Product } from '../components/Products';

import { convertHourToMinutes } from './convertHourToMinutes';

export default function verifyProductAvailable(product: Product) {
    if (product.paused)
        return "paused";

    // Not paused!

    if (product.available_all)
        return "available"; // Not paused and always available!

    const weekDay = getDay(Date.now());

    const todayAvailable = product.availables.find(item => { return item.week_day === weekDay && item.available });

    if (!todayAvailable) // Not available today
        return "not-available";

    // Available today
    if (todayAvailable.all_day) // Available through all today
        return "available";
    else {
        const now = Date.now();
        const minutesNow = convertHourToMinutes(`${getHours(now)}:${getMinutes(now)}`);

        if (todayAvailable.shift_01) {
            if (minutesNow >= todayAvailable.shift_01_from
                && minutesNow <= todayAvailable.shift_01_to) // Available today in first shift time
                return "available";
        }

        if (todayAvailable.shift_02) {
            if (minutesNow >= todayAvailable.shift_02_from
                && minutesNow <= todayAvailable.shift_02_to) // Available today in second shift time
                return "available";
        }

        return "not-available";
    }
}