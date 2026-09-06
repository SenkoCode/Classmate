export interface HeaderProps {
    text : string,
    typeWeek : string;
}

export interface ScheduleItem  {
    id : number,
    subject : string,
    teacher? : string,
    room? : string,
    time : string;
} 

export interface ScheduleListProps {
    title : string,
    data : ScheduleItem[];
}

export interface WeekScheduleListProps {
    weekData : ScheduleListProps[],
    needTracking : boolean;
}

export interface DataBaseScheduleItem {
    id : number,
    subject : string,
    teacher : string | null,
    room : string | null,
    day_of_week : number, // 0 - понедельник 6 - суббота
    lesson_number : number,
    week_type : "both" | "upper" | "lower";
}

export interface Settings {
    group : string,
    lastUpdate : string | null,
    url : string,
}

export type WeekType = "lower" | "upper";