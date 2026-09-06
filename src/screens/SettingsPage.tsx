import React, { useEffect, useState } from "react";
import { Text, Button } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { StyleSheet } from "react-native";

import { COLORS, globalStyles } from "../style/style";
import { Header } from "../components/Header";

import { updateSchedulesDatabase } from "../services/googleSheetsParser";

import { useDatabase } from "../components/DatabaseContex";
import { loadAppSettings, saveAppSettigns } from "../utils/settingsManager";
import { Settings } from "../types/models";
import { useAppStore } from "../services/appStore";

export default function SettingsPage() {
    const navigation = useNavigation<any>();
    const setIsShowLoadingPage = useAppStore((state) => state.setIsShowLoadingPage);
    const [getSettings, setSettings] = useState<Settings>();

    useEffect(() => {
        const load = async () => {
            const data = await loadAppSettings();
            setSettings(data);
        }
        load();
    }, [])

    return (
        <LinearGradient                 
            colors={['#0f172a', '#4338ca']} // Ваши цвета из CSS (темно-синий и фиолетовый)
            start={{ x: 0, y: 0 }}          // Верхний левый угол (аналог 148deg)
            end={{ x: 1, y: 1 }}            // Правый нижний угол
            style = {globalStyles.container}>
            <SafeAreaView>
                <Text style = {style.header}>Настройки</Text>
                <TouchableOpacity style = {style.button} onPress = {async () => {
                    await setIsShowLoadingPage(true);
                    await updateSchedulesDatabase();
                    await setIsShowLoadingPage(false);
                }}>
                    <Text style = {style.buttonText}>Обновить таблицу</Text>
                    <Ionicons name="refresh" size={26} color="#fff"/>
                </TouchableOpacity>

                <TouchableOpacity style = {style.button} onPress = {() => {
                    navigation.navigate("InputURLTablePage");    
                }}>
                    <Text style = {style.buttonText}>Изменить таблицу</Text>
                    <Ionicons name="create" size={26} color="#fff"/>
                </TouchableOpacity>

                <TouchableOpacity style = {style.button} onPress = {() => {
                    navigation.navigate("SelectTypeWeek");
                }}>
                    <Text style = {style.buttonText}>Сменить тип недели</Text>
                    <Ionicons name="swap-horizontal" size={26} color="#fff"/>
                </TouchableOpacity>

                <TouchableOpacity style = {style.button} onPress = {() => {
                    saveAppSettigns("", new Date(), "");
                }}>
                    <Text style = {style.buttonText}>Измененить группу</Text>
                    <Ionicons name="people" size={26} color="#fff"/>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    )
}

const style = StyleSheet.create({ 
    button: {
        height: 52,
        backgroundColor: '#6366F1',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
        marginHorizontal : 10,
        marginVertical : 5,

        alignContent : 'center',
        flexDirection : 'row',
        gap: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
        },
        header : {
            color : COLORS.text_primary,
            fontWeight : '800',
            marginHorizontal : 22,
            fontSize : 23,
            marginVertical : 20
        }
});