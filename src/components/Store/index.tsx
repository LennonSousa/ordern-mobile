import { OpenedDay } from '../Store/OpenedDays'
import { Category } from '../Categories';
import { Highlight } from '../Highlights';

export interface Store {
    id: string;
    title: string;
    phone: string;
    description: string;
    min_order: number;
    cover: string;
    avatar: string;
    zip_code: string;
    street: string;
    number: string;
    group: string;
    complement: string;
    city: string;
    state: string;
    latitude: string;
    longitude: string;
    free_shipping: number;
    highlights: boolean;
    highlights_title: string;
    categories: Category[];
    openedDays: OpenedDay[];
    productsHighlights: Highlight[];
    opened: boolean;
}