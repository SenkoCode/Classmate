import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../style/style";
import {
  getRowDataFromXlsx,
  updateSchedulesDatabase,
} from "../services/googleSheetsParser";
import LoadingPage from "./LoadingPage";
import { saveAppSettigns } from "../utils/settingsManager";
import { LinearGradient } from "expo-linear-gradient";
import { useAppStore } from "../services/appStore";

interface GroupItem {
  id: string;
  name: string;
}

export default function SelectGroup() {
  const [searchQuery, setSearchQuery] = useState(""); // Текст, который пишет пользователь
  const [allItems, setAllItems] = useState<GroupItem[]>([]); // Полный список групп с сервера
  const [selectedItem, setSelectedItem] = useState<GroupItem>(); // Какую группу выбрали сейчас
  const [isLoading, setIsLoading] = useState(true); // Крутится ли загрузка списка
  const checkFirstStart = useAppStore((state) => state.checkFirstStart);

  const filteredItem = useMemo(() => {
    if (!searchQuery.trim()) return allItems;
    const lower = searchQuery.toLowerCase().trim();
    return allItems.filter((item) => item.name.toLowerCase().includes(lower));
  }, [allItems, searchQuery]);

  const handleOnPreesed = (item: GroupItem) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    const loadData = async () => {
      const r = await getRowDataFromXlsx();
      const formated: GroupItem[] = r.map((name, index) => ({
        id: `item-${index}`,
        name: name,
      }));
      setAllItems(formated);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }

  return (
    <LinearGradient
      colors={["#0f172a", "#4338ca"]} // Ваши цвета из CSS (темно-синий и фиолетовый)
      start={{ x: 0, y: 0 }} // Верхний левый угол (аналог 148deg)
      end={{ x: 1, y: 1 }} // Правый нижний угол
      style={style.container}
    >
      <SafeAreaView style={style.container}>
        <Text style={style.headerSelectionGroup}>Выберите группу</Text>
        <TextInput
          style={style.searchInput}
          placeholder="Поиск группы..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={COLORS.text_primary}
        />
        <FlatList
          style={style.listContent}
          data={filteredItem}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                style.itemCard,
                selectedItem?.id === item.id && style.selectedCard,
              ]}
              onPress={() => handleOnPreesed(item)}
              activeOpacity={0.7}
            >
              <Text style={style.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          numColumns={2}
          columnWrapperStyle={style.columnWrapper}
          contentContainerStyle={style.listContent}
          ListEmptyComponent={
            <Text style={style.emptyText}>
              {searchQuery ? "Ничего не найдено" : "Нет доступных групп"}
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity
          style={style.welcome_Button}
          onPress={async () => {
            if (selectedItem) {
              const group = selectedItem.name;
              const now = new Date();
              await saveAppSettigns(group, now, "");
              await setIsLoading(true);
              await updateSchedulesDatabase();
              await setIsLoading(false);
              await checkFirstStart();
            }
          }}
        >
          <Text style={style.welcome_Button_Text}>Выбрать</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  welcome_Button: {
    alignItems: "center",
    backgroundColor: COLORS.text_secondary,
    justifyContent: "flex-end",
    padding: 10,
    margin: 15,
    width: 150,
    alignSelf: "flex-end",
    borderRadius: 15,
  },
  welcome_Button_Text: {
    color: COLORS.text_primary,
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  searchInput: {
    height: 48,
    margin: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background_card,
    color: COLORS.text_primary,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginHorizontal: 4,
  },
  itemCard: {
    flex: 1 / 2,
    maxWidth: "50%",
    backgroundColor: COLORS.background_card,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 10,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.border,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 60,
  },
  selectedCard: {
    backgroundColor: COLORS.selection_background_card,
    borderWidth: 3,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text_primary,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
  headerSelectionGroup: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 20,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 30,
  },
});
