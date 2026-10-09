import { TouchableOpacity, View, Text, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles, COLORS } from "../style/style";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../services/appStore";

export default function SelectTypeWeek() {
    const setTypeWeek = useAppStore((state) => state.setTypeWeek);
    const navigation = useNavigation();
    const handleSelect = (type : "current" | "lower" | "upper") => {
        setTypeWeek(type);
        (navigation as any).navigate('MainTabs', {
            screen : 'ScheduleToDay', 
        });
    }

    return (
        <LinearGradient                 
            colors={['#0f172a', '#4338ca']} // Ваши цвета из CSS (темно-синий и фиолетовый)
            start={{ x: 0, y: 0 }}          // Верхний левый угол (аналог 148deg)
            end={{ x: 1, y: 1 }}            // Правый нижний угол
            style = {style.container}>
        <SafeAreaView>
            <Text style = { style.header }>Выберите тип недели</Text>
            <TouchableOpacity style = { style.button } onPress={() => {
                handleSelect('current');
            }}>
                <Text style = { style.buttonText }>Текущая</Text>
            </TouchableOpacity>
            <TouchableOpacity style = { style.button } onPress={() => {
                handleSelect('upper');
            }}>
                <Text style = { style.buttonText }>Вверхняя</Text>
            </TouchableOpacity>
            <TouchableOpacity style = { style.button } onPress={() => {
                handleSelect('lower');
            }}>
                <Text style = { style.buttonText }>Нижняя</Text>
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
        marginVertical : 5
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
        },
                container : {
        flex : 1
    },
});