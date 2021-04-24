import { OpenedSchedules } from '../OpenedSchedules';

export interface OpenedDay {
    id: number,
    week_day: number,
    opened: boolean,
    daySchedules: OpenedSchedules[]
}