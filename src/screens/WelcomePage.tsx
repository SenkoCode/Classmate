import { Text, TouchableOpacity, View  } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; 
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "../style/style";

export default function WelcomePage() {
    const navigation = useNavigation<any>();

    return (
        <LinearGradient                 
            colors={['#0f172a', '#4338ca']} // Ваши цвета из CSS (темно-синий и фиолетовый)
            start={{ x: 0, y: 0 }}          // Верхний левый угол (аналог 148deg)
            end={{ x: 1, y: 1 }}            // Правый нижний угол
            style = {globalStyles.container}>
            <SafeAreaView style = {globalStyles.container}>
                <Text style = {globalStyles.welcome_Header}>Добро пожаловать в ClassMate — цифрового помощника студентов МГПК.</Text>
                <Text style = {globalStyles.welcome_Text}>Приложение создано специально для того, чтобы вы всегда были в курсе своего расписания: названия пар, преподаватели, кабинеты и время занятий — всё собрано в одном удобном приложении.</Text>
                <Text style = {globalStyles.welcome_Text}>ClassMate помогает организовать учебный день, избавляя от бумажных расписаний и путаницы. Просто открой приложение — и ты точно знаешь, куда идти и что тебя ждёт.</Text>
                <View style = {{
                    flex : 1,
                    alignItems : "flex-end",
                    justifyContent : "flex-end"
                }} />
                <TouchableOpacity style={globalStyles.welcome_Button} onPress={() => {
                    navigation.navigate("SelectionPage");
                }}> 
                    <Text style = { globalStyles.welcome_Button_Text }>Далее</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}