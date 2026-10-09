import { DataBaseScheduleItem, ScheduleListProps, ScheduleItem,} from "../types/models"

export const LESSON_TIMES: Record<number, string> = {
    1: "08:45 - 09:30 | 09:35 - 10:20",
    2: "10:30 - 11:15 | 11:35 - 12:20",
    3: "13:00 - 13:45 | 13:50 - 14:35",
    4: "14:45 - 15:30 | 15:35 - 16:20",
    5: "16:30 - 17:15 | 17:20 - 18:05",
};

export const LESSON_TIME_SUNDAY : Record<number, string> = {
    1 : "09:00 - 09:45 | 09:50 - 10:35",
    2 : "10:45 - 11:30 | 11:35 - 12:20",
    3 : "12:30 - 13:15 | 13:20 - 14:05"
}

export const DAYS_NAMES: Record<number, string> = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
};

export function transformDbToUiSchedule(dbLessons: DataBaseScheduleItem[]): ScheduleListProps[] {
    const grouped = dbLessons.reduce<Record<number, ScheduleListProps>>((acc, lesson) => {
        const dayKey = lesson.day_of_week;

        if (!acc[dayKey]) {
            acc[dayKey] = {
                title: DAYS_NAMES[dayKey] || "Неизвестный день",
                data: []
            };
        }
        
        const uiItem: ScheduleItem = {
            id : lesson.id,
            subject: lesson.subject,
            teacher: lesson.teacher ? lesson.teacher : "",
            room: lesson.room ? lesson.room : "",
            time: dayKey === 6 ? LESSON_TIME_SUNDAY[lesson.lesson_number] : LESSON_TIMES[lesson.lesson_number]
        };

        acc[dayKey].data.push(uiItem);

        return acc;
    }, {});
    
    return Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b)
        .map(dayKey => grouped[dayKey]);
}
