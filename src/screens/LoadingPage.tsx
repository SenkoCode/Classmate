import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { globalStyles } from "../style/style";

export default function LoadingPage() {
    
    return (
        <LinearGradient                 
                    colors={['#0f172a', '#4338ca']} // Ваши цвета из CSS (темно-синий и фиолетовый)
                    start={{ x: 0, y: 0 }}          // Верхний левый угол (аналог 148deg)
                    end={{ x: 1, y: 1 }}            // Правый нижний угол
                    style = {style.container}>
            <SafeAreaView style = {style.loader}>
                <ActivityIndicator size="large" color="#ffffff" />
            </SafeAreaView>
        </LinearGradient>
    );

}


const style = StyleSheet.create({
    loader : {
        justifyContent : 'center',
        alignItems : 'center',
        flex : 1
    },
    container : {
        flex : 1
    },
});