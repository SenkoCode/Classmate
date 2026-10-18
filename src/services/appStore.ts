import { create } from "zustand";
import { getTypeWeek, getDayNumber } from "../utils/utils";
import { transformDbToUiSchedule } from "../utils/convertDbToUI";
import { ScheduleListProps, WeekType } from "../types/models";
import { DataBaseService } from "./dataBaseServices";
import { loadAppSettings } from "../utils/settingsManager";

interface ScheduleState {
  isShowLoadingPage: boolean;
  setIsShowLoadingPage: (newState: boolean) => Promise<void>;

  isFirstStart: boolean;
  checkFirstStart: () => Promise<void>;

  dateLast: string | null;
  setDateLast: (date: string) => void;

  tommor: Date;
  typeWeekToDay: WeekType;
  typeWeekNextDay: WeekType;
  isChangedTypeWeek: boolean;
  setIsChangedTypeWeek: (flag: boolean) => void;
  setTypeWeek: (newCase: "current" | "lower" | "upper") => void;

  schedulesToDay: ScheduleListProps[];
  scheduleWeekly: ScheduleListProps[];
  scheduleNextDay: ScheduleListProps[];

  isLoading: boolean;
  isLoaded: boolean;

  db: null | DataBaseService;
  setDbInstance: (dbInstance: DataBaseService) => void;

  fetchSchedules: () => Promise<void>;
}

export const useAppStore = create<ScheduleState>((set, get) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    isShowLoadingPage: false,
    setIsShowLoadingPage: async (newState: boolean) =>
      set({ isShowLoadingPage: newState }),

    isFirstStart: false,
    checkFirstStart: async () => {
      const settings = await loadAppSettings();
      if (settings.group && settings.lastUpdate) set({ isFirstStart: false });
      else set({ isFirstStart: true });
    },

    dateLast: null,
    setDateLast: (date: string) => set({ dateLast: date }),

    tommor: tomorrow,
    typeWeekToDay: getTypeWeek(),
    typeWeekNextDay: getTypeWeek(tomorrow),
    isChangedTypeWeek: false,
    setIsChangedTypeWeek(flag) {
      set({ isChangedTypeWeek: flag });
    },

    setTypeWeek: (newCase: "current" | "lower" | "upper") => {
      if (newCase == "current") {
        set({
          isChangedTypeWeek: false,
          typeWeekToDay: getTypeWeek(),
          typeWeekNextDay: getTypeWeek(tomorrow),
        });
      } else {
        set({
          isChangedTypeWeek: true,
          typeWeekToDay: newCase,
          typeWeekNextDay: newCase,
        });
      }
    },

    // setTypeWeek: (newCase: "current" | "lower" | "upper") => {
    //   if (newCase == "current") {
    //     set({ isChangedTypeWeek: false });
    //     newCase = getTypeWeek();
    //   } else {
    //     set({ isChangedTypeWeek: true });
    //   }
    //   set({ typeWeekToDay: newCase });
    // },

    schedulesToDay: [],
    scheduleWeekly: [],
    scheduleNextDay: [],
    isLoading: false,
    isLoaded: false,

    db: null,
    setDbInstance: (dbInstance: DataBaseService) => {
      if (get().db == null) set({ db: dbInstance });
    },

    fetchSchedules: async () => {
      try {
        const db = get().db;
        if (!db) return;

        if (get().isLoading) return;

        const todayStr = new Date().toDateString();

        set({
          isLoading: true,
          dateLast: todayStr,
        });

        const date = getDayNumber();

        const dataToDay = await db.getLessons(
          date.toString(),
          get().typeWeekToDay,
        );
        const schedulesToDay = transformDbToUiSchedule(dataToDay);
        set({ schedulesToDay: schedulesToDay });
        const dataNextDate = await db.getLessons(
          (date + 1).toString(),
          get().typeWeekNextDay,
        );
        const scheduleNextDay = transformDbToUiSchedule(dataNextDate);
        set({ scheduleNextDay: scheduleNextDay });

        const dataWeekly = await db.getLessonsWeek(get().typeWeekNextDay);
        const schedulesWeekly = transformDbToUiSchedule(dataWeekly);
        set({ scheduleWeekly: schedulesWeekly, isLoaded: true });
      } catch (error) {
        console.error("Ошибка загрузки расписания:", error);
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
