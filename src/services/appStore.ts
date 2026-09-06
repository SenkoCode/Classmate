import { create } from "zustand";
import { getTypeWeek, getDayNumber } from "../utils/utils";
import { transformDbToUiSchedule } from "../utils/convertDbToUI";
import { ScheduleListProps, WeekType } from "../types/models";
import { DataBaseService } from "./dataBaseServices";
import { loadAppSettings } from "../utils/settingsManager";

interface ScheduleState {
    isShowLoadingPage : boolean,
    setIsShowLoadingPage : (newState : boolean) => Promise<void>;

    isFirstStart : boolean,
    checkFirstStart : () => Promise<void>,

    dateLast : string | null,
    setDateLast : (date : string) => void,
    typeWeek : WeekType,
    setTypeWeek : ( newCase : "current" | "lower" | "upper")  => void;

    schedulesToDay : ScheduleListProps[];
    scheduleWeekly : ScheduleListProps[];

    isLoading : boolean;
    isLoaded : boolean;

    db : null | DataBaseService;
    setDbInstance : (dbInstance : DataBaseService) => void;

    fetchSchedules : () => Promise<void>;
}

export const useAppStore = create<ScheduleState>((set, get) => ({
    isShowLoadingPage : false,
    setIsShowLoadingPage : async (newState : boolean) => set({isShowLoadingPage : newState}),

    isFirstStart : false,
    checkFirstStart : async () => {
        const settings = await loadAppSettings();
        if (settings.group && settings.lastUpdate) 
            set({isFirstStart : false});
        else 
            set({isFirstStart : true});
    },

    dateLast : null,
    setDateLast : (date : string) => set({dateLast : date}),

    typeWeek : getTypeWeek(),
    setTypeWeek : (newCase : "current" | "lower" | "upper") => {
        if (newCase == "current")
        {
            newCase = getTypeWeek();
        }
        console.log('Changed type week: ' + newCase);
        set({typeWeek : newCase})
    },

    schedulesToDay : [], // пары на сегодня
    scheduleWeekly : [], // пары на неделю
    isLoading : false,
    isLoaded : false,

    db : null,
    setDbInstance : ( dbInstance : DataBaseService ) => {if (get().db == null) set({db : dbInstance})},

    fetchSchedules : async () => {
        try {
            const db = get().db;
            if (!db) return;
            const todayStr = new Date().toDateString();
            if (get().isLoaded && get().dateLast != todayStr)

            if (get().isLoading) return;
            
             set({ 
                isLoading: true, 
                schedulesToDay: [], 
                scheduleWeekly: [],
                dateLast : todayStr
            });

            const date = getDayNumber();

            const dataToDay = await db.getLessons(date.toString(), get().typeWeek);
            const schedulesToDay = transformDbToUiSchedule(dataToDay);

            set({schedulesToDay : schedulesToDay});

            const dataWeekly = await db.getLessonsWeek(get().typeWeek);   
            const schedulesWeekly = transformDbToUiSchedule(dataWeekly);

            set({scheduleWeekly : schedulesWeekly});
        }
        catch {

        }
        finally {
            set({isLoading : false});
        }
    },
}));