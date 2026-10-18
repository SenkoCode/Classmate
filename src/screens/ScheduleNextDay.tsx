import { useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { Header } from "../components/Header";
import { ScheduleList } from "../components/ScheduleList";
import { getTypeWeekText } from "../utils/utils";
import { useAppStore } from "../services/appStore";
import { StyleSheet } from "react-native";

export default function ScheduleNextDay() {
  const lesson = useAppStore((state) => state.scheduleNextDay);

  const fetchSchedules = useAppStore((state) => state.fetchSchedules);
  const typeWeek = useAppStore((state) => state.typeWeekNextDay);
  const weekTypeText = getTypeWeekText(typeWeek);

  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
    }, [fetchSchedules, typeWeek]),
  );

  return (
    <LinearGradient
      colors={["#0f172a", "#4338ca"]} // Ваши цвета из CSS (темно-синий и фиолетовый)
      start={{ x: 0, y: 0 }} // Верхний левый угол (аналог 148deg)
      end={{ x: 1, y: 1 }} // Правый нижний угол
      style={style.container}
    >
      <SafeAreaView style={style.container}>
        <Header text="Завтра" typeWeek={weekTypeText} />
        <ScheduleList weekData={lesson} needTracking={false} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
