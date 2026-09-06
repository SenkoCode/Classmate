import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { COLORS, globalStyles } from "../style/style";
import { getRowDataFromXlsx } from "../services/googleSheetsParser";
import LoadingPage from "./LoadingPage";
import { saveAppSettigns } from "../utils/settingsManager";
import { LinearGradient } from "expo-linear-gradient";
import { useAppStore } from "../services/appStore";

interface GroupItem {
    id : string
    name: string;
}

export default function SelectGroup() {
    const [searchQuery, setSearchQuery] = useState(''); // Текст, который пишет пользователь
    const [allItems, setAllItems] = useState<GroupItem[]>([]); // Полный список групп с сервера
    const [selectedItem, setSelectedItem] = useState<GroupItem>(); // Какую группу выбрали сейчас
    const [isLoading, setIsLoading] = useState(true); // Крутится ли загрузка списка
    const checkFirstStart = useAppStore((state) => state.checkFirstStart);
        
    const filteredItem = useMemo(() => {
        if (!searchQuery.trim()) return allItems;
        const lower = searchQuery.toLowerCase().trim();
        return allItems.filter(item => item.name.toLowerCase().includes(lower));
    }, [allItems, searchQuery])

    const handleOnPreesed = (item : GroupItem) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        const loadData = async () => {
            const r = await getRowDataFromXlsx();
            const formated : GroupItem[] = r.map((name, index) => (
                {
                    id : `item-${index}`,
                    name : name
                }
            ))
            setAllItems(formated);
            setIsLoading(false);
        }

        loadData();
    }, [])

    if (isLoading)
    {
        return (
            <LoadingPage>
                
            </LoadingPage>
        );
    }

    return (
                <LinearGradient                 
                    colors={['#0f172a', '#4338ca']} // Ваши цвета из CSS (темно-синий и фиолетовый)
                    start={{ x: 0, y: 0 }}          // Верхний левый угол (аналог 148deg)
                    end={{ x: 1, y: 1 }}            // Правый нижний угол
                    style = {globalStyles.container}>
        <SafeAreaView style = { globalStyles.container }>
            <Text style = { globalStyles.headerSelectionGroup }>Выберите группу</Text>
            <TextInput
                style = { globalStyles.searchInput }
                placeholder="Поиск группы..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={COLORS.text_primary}
            />
            <FlatList
            style = {globalStyles.listContent}
            data={filteredItem}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <TouchableOpacity
                style = {[
                    globalStyles.itemCard,
                    selectedItem?.id === item.id && globalStyles.selectedCard
                ]}
                onPress={() => handleOnPreesed(item)}
                activeOpacity={0.7}>
                    <Text style = { globalStyles.itemText }>{item.name}</Text>
                </TouchableOpacity>
            )}
            numColumns={2}
            columnWrapperStyle={globalStyles.columnWrapper}
            contentContainerStyle={globalStyles.listContent}
            ListEmptyComponent={
                <Text style={globalStyles.emptyText}>
                    {searchQuery ? 'Ничего не найдено' : 'Нет доступных групп'}
                </Text>
                }
            showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style = { globalStyles.welcome_Button} onPress={() => {
        if (selectedItem) {
            const group = selectedItem.name; 
            const now = new Date();
            saveAppSettigns(group, now);
            checkFirstStart();
        }
      }}>
        <Text style = {globalStyles.welcome_Button_Text}>Выбрать</Text>
      </TouchableOpacity>
        </SafeAreaView>
        </LinearGradient>
    );
}