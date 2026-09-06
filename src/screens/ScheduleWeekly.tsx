import React, { useEffect, useState, useCallback } from "react";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { globalStyles } from "../style/style";
import { Header } from "../components/Header";
import { ScheduleList } from "../components/ScheduleList"; 
import { useDatabase } from "../components/DatabaseContex";
import { ScheduleListProps } from "../types/models";
import { transformDbToUiSchedule } from "../utils/convertDbToUI";
import { getDayNumber, getTypeWeek, getTypeWeekText } from "../utils/utils";
import { useAppStore } from "../services/appStore";

export default function ScheduleWeekly () {
    const fetchSchedules = useAppStore((state) => state.fetchSchedules);
    const typeWeek = useAppStore((state) => state.typeWeek);
    const weekTypeText = getTypeWeekText(typeWeek); 
    const lesson =useAppStore((state) => state.scheduleWeekly);

    useFocusEffect(
            useCallback(() => {
                fetchSchedules();
            }, [fetchSchedules])
        );

    return (
        <LinearGradient                 
                colors={['#0f172a', '#4338ca']} // Ваши цвета из CSS (темно-синий и фиолетовый)
                start={{ x: 0, y: 0 }}          // Верхний левый угол (аналог 148deg)
                end={{ x: 1, y: 1 }}            // Правый нижний угол
                style = {globalStyles.container}>
            <SafeAreaView style = { globalStyles.container }>
                <Header text="Неделя" typeWeek={weekTypeText}/>
                <ScheduleList weekData={lesson} needTracking = { false }/>
            </SafeAreaView>
        </LinearGradient>
    )
}