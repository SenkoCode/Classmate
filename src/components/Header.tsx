import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../style/style";

import { HeaderProps } from '../types/models'

export const Header = ( {text, typeWeek} : HeaderProps) => {
    return (
    <View style = { globalStyles.header }>
        <Text style = { globalStyles.headerTitle }>{text}</Text>
        <Text style = { globalStyles.headerTextTypeWeek }>{typeWeek}</Text>
    </View>
    )
}