import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../style/style";
import { useNavigation } from '@react-navigation/native';

import { HeaderProps } from '../types/models'
import { useAppStore } from "../services/appStore";

export const Header = ( {text, typeWeek} : HeaderProps) => {
    const navigation = useNavigation<any>();
    const changedTypeWeek = useAppStore(state => state.isChangedTypeWeek);

    const displayTypeWeek = changedTypeWeek ? typeWeek + " • Изменено" : typeWeek;

    return (
    <View style = { style.header }>
        <Text style = { style.headerTitle }>{text}</Text>
        <TouchableOpacity style={style.headerBtn} onPress={() => {
            navigation.navigate("SelectTypeWeek");
        }}>
            <Text style = { style.headerTextTypeWeek }>{displayTypeWeek}</Text>
        </TouchableOpacity>
    </View>
    )
}

const style = StyleSheet.create({
    headerBtn : {
        backgroundColor : COLORS.border,
        paddingHorizontal : 20,
        paddingVertical : 5,
        borderRadius : 20,
        marginTop : 5
    },
    header : {
        alignItems : 'center',
        height : 70,
        justifyContent : 'center',
        marginBottom : 12,
        color : COLORS.text_primary,
    },
    headerTitle : {
        textAlign : 'center',
        fontSize : 20,
        paddingTop : 10,
        paddingBottom : 5,
        color : COLORS.text_primary
    },
    headerTextTypeWeek : {
        textAlign : 'center',
        fontSize : 18,
        color : COLORS.text_primary
    },
});