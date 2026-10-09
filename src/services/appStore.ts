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
    isChangedTypeWeek : boolean,
    setIsChangedTypeWeek : (flag : boolean) => void; 
    setTypeWeek : ( newCase : "current" | "lower" | "upper")  => void;

    schedulesToDay : ScheduleListProps[];
    scheduleWeekly : ScheduleListProps[];
    scheduleNextDay : ScheduleListProps[],

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
    isChangedTypeWeek : false,
    setIsChangedTypeWeek(flag) {
        set({isChangedTypeWeek : flag})
    },

    setTypeWeek : (newCase : "current" | "lower" | "upper") => {
        if (newCase == "current")
        {
            set({isChangedTypeWeek : false});
            newCase = getTypeWeek();
        }
        else{
            set({isChangedTypeWeek : true});
        }
        set({typeWeek : newCase})
    },

    schedulesToDay : [], // пары на сегодня
    scheduleWeekly : [], // пары на неделю
    scheduleNextDay : [],
    isLoading : false,
    isLoaded : false,

    db : null,
    setDbInstance : ( dbInstance : DataBaseService ) => {if (get().db == null) set({db : dbInstance})},

        fetchSchedules : async () => {
        try {
            const db = get().db;
            if (!db) return;
            
            if (get().isLoading) return;
            
            const todayStr = new Date().toDateString();

            set({ 
                isLoading: true, 
                dateLast : todayStr
            });

            const date = getDayNumber();

            // 1. Сначала запрашиваем и отображаем только СЕГОДНЯ (быстрый рендер)
            const dataToDay = await db.getLessons(date.toString(), get().typeWeek);
            const schedulesToDay = transformDbToUiSchedule(dataToDay);
            set({ schedulesToDay : schedulesToDay });

            // 2. Затем запрашиваем ЗАВТРА
            const dataNextDate = await db.getLessons((date + 1).toString(), get().typeWeek);
            const scheduleNextDay = transformDbToUiSchedule(dataNextDate);
            set({ scheduleNextDay : scheduleNextDay });

            // 3. В самую последнюю очередь грузим тяжелую НЕДЕЛЮ
            const dataWeekly = await db.getLessonsWeek(get().typeWeek);   
            const schedulesWeekly = transformDbToUiSchedule(dataWeekly);
            set({ scheduleWeekly : schedulesWeekly, isLoaded: true });
        }
        catch (error) {
            console.error("Ошибка загрузки расписания:", error);
        }
        finally {
            set({ isLoading : false });
        }
    },
}));