import { StyleSheet, Text, TouchableOpacity, View  } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; 
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../style/style";

export default function WelcomePage() {
    const navigation = useNavigation<any>();

    return (
        <LinearGradient                 
            colors={['#0f172a', '#4338ca']} // Ваши цвета из CSS (темно-синий и фиолетовый)
            start={{ x: 0, y: 0 }}          // Верхний левый угол (аналог 148deg)
            end={{ x: 1, y: 1 }}            // Правый нижний угол
            style = {style.container}>
            <SafeAreaView style = {style.container}>
                <Text style = {style.welcome_Header}>Добро пожаловать в ClassMate — цифрового помощника студентов МГПК.</Text>
                <Text style = {style.welcome_Text}>Приложение создано специально для того, чтобы вы всегда были в курсе своего расписания: названия пар, преподаватели, кабинеты и время занятий — всё собрано в одном удобном приложении.</Text>
                <Text style = {style.welcome_Text}>ClassMate помогает организовать учебный день, избавляя от бумажных расписаний и путаницы. Просто открой приложение — и ты точно знаешь, куда идти и что тебя ждёт.</Text>
                <View style = {{
                    flex : 1,
                    alignItems : "flex-end",
                    justifyContent : "flex-end"
                }} />
                <TouchableOpacity style={style.welcome_Button} onPress={() => {
                    navigation.navigate("SelectionPage");
                }}> 
                    <Text style = { style.welcome_Button_Text }>Далее</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const style = StyleSheet.create({
    welcome_Header : {
        color : COLORS.text_primary,
        fontSize : 20,
        padding : 15
    },
    welcome_Text : {
        color : COLORS.text_primary,
        fontSize : 17,
        paddingStart : 15,
        paddingEnd : 15,
        paddingBottom : 5
    },
    welcome_Button : {
        alignItems : "center",
        backgroundColor : COLORS.text_secondary,
        justifyContent : "flex-end",
        padding : 10,
        margin : 15,
        width : 150,
        alignSelf : "flex-end",
        borderRadius : 15
    },
    welcome_Button_Text : {
        color : COLORS.text_primary,
        fontSize : 16,
    },
    container : {
        flex : 1
    },
});