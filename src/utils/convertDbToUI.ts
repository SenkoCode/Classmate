import { DataBaseScheduleItem, ScheduleListProps, ScheduleItem,} from "../types/models"

export const LESSON_TIMES: Record<number, string> = {
    1: "08:30 - 10:00",
    2: "10:15 - 11:45",
    3: "12:15 - 13:45",
    4: "14:00 - 15:35",
    5: "15:50 - 17:25",
};

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
            time: LESSON_TIMES[lesson.lesson_number]
        };

        acc[dayKey].data.push(uiItem);

        return acc;
    }, {});
    
    return Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b)
        .map(dayKey => grouped[dayKey]);
}
