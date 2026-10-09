import { LinearGradient } from "expo-linear-gradient";
import { COLORS, globalStyles } from "../style/style";
import { useState } from "react";
import { KeyboardAvoidingView, View, TextInput, TouchableOpacity, Text, Platform, StyleSheet } from "react-native";
import { isGoogleSheetsUrl } from "../utils/utils";
import { loadAppSettings, saveAppSettigns } from "../utils/settingsManager";
import { useNavigation } from "@react-navigation/native";
import { updateSchedulesDatabase } from "../services/googleSheetsParser";
import { useAppStore } from "../services/appStore";
import { Alert } from 'react-native';

export default function InputURLTablePage() {
    const navigation = useNavigation();
    const setIsShowLoadingPage = useAppStore((state) => state.setIsShowLoadingPage);
    const [text, setText] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const url = "https://docs.google.com/spreadsheets/d/1aUdgTonuua6JZHEFojLeo_jtSd1AO-1K/edit?gid=1197657310#gid=1197657310";

    const handleSubmit = () => {
        if (isGoogleSheetsUrl(text))
        {
            setIsShowLoadingPage(true);
            setTimeout(async () => {
                try
                {
                    const settings = await loadAppSettings();
                    if (settings.lastUpdate == null) 
                        settings.lastUpdate = "";
                    saveAppSettigns(settings.group, settings.lastUpdate, text);
                    await updateSchedulesDatabase();
                }
                catch
                {

                }
                finally {
                    setIsShowLoadingPage(false);
                    navigation.goBack();
                }
            }, 50)
        }
        else {
            Alert.alert("Ошибка", "Неверный формат URL.", [{text : "Ок"}])
        }
    };

    return (
        <LinearGradient                 
            colors={['#0f172a', '#4338ca']} // Ваши цвета из CSS (темно-синий и фиолетовый)
            start={{ x: 0, y: 0 }}          // Верхний левый угол (аналог 148deg)
            end={{ x: 1, y: 1 }}            // Правый нижний угол
            style = {styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <View style={styles.formContainer}>
                    <TextInput
                        style={[
                        styles.input, 
                        isFocused && styles.inputFocused // Эффект подсветки при фокусе
                        ]}
                    placeholder="Введите сыллку на таблицу..."
                    placeholderTextColor="#94A3B8"
                    value={text}
                    onChangeText={setText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}/>

                    <TouchableOpacity 
                        style={styles.button} 
                        activeOpacity={0.8} // Эффект легкого затемнения при нажатии
                        onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Продолжить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button} 
                        activeOpacity={0.8} // Эффект легкого затемнения при нажатии
                        onPress={() =>
                        {   
                            setText(url);
                        }}>
                    <Text style={styles.buttonText}>Выбрать автоматически</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formContainer: {
    gap: 16, // Отступ между инпутом и кнопкой
  },
  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Легкая тень для iOS
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    // Тень для Android
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#6366F1', // Индиго цвет при фокусе
    borderWidth: 1.5,
  },
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});