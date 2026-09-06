import React from "react";
import { StyleSheet } from "react-native";

export const COLORS = {
    primary : "#12063a",
    secondary : "#141415",
    border : "#00BFFF",
    text_primary : "#ffffff",
    text_secondary : "#00BFFF",
    background_card : "#1A1A1A",
    selection_background_card : "#347991",
    border_active : "#2bb10d"
}

export const globalStyles = StyleSheet.create({
    container : {
        flex : 1
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
    headerTextDayOfWeek : {
        textAlign : 'center',
        fontSize : 18,
        paddingTop : 6,
        color : COLORS.text_primary
    },
    headerTextTypeWeek : {
        textAlign : 'center',
        fontSize : 18,
        paddingTop : 5,
        color : COLORS.text_secondary
    },
    card : {
        paddingLeft : 20,
        paddingRight : 20,
        paddingTop : 10,
        paddingBottom : 10,

        marginTop : 5,
        marginLeft : 20,
        marginRight : 20,
        marginBottom : 10,

        backgroundColor : COLORS.background_card,
        borderRadius : 23,
        borderColor : COLORS.border,
        borderWidth : 1,
        shadowColor: COLORS.border,
        elevation: 5,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    card_active : {
        paddingLeft : 20,
        paddingRight : 20,
        paddingTop : 10,
        paddingBottom : 10,

        marginTop : 10,
        marginLeft : 20,
        marginRight : 20,

        backgroundColor : COLORS.background_card,
        borderRadius : 23,
        borderColor : COLORS.border_active,
        borderWidth : 2,
        shadowColor: COLORS.border_active,
        elevation: 5,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    cardHeader : {
        textAlign : 'center',
        color : COLORS.text_primary,
        paddingTop : 7,
        paddingBottom : 7,
        fontSize : 18
    },
    cardTextSubject : {
        color : COLORS.text_primary,
        fontSize : 16,

        paddingBottom : 5
    },
    cardTextTeacher : {
        color : COLORS.text_primary,
        fontSize : 15
    },
    cardTextRoom : {
        color : COLORS.text_primary,
        fontSize : 15
    },
    cardTextTime : {
        color : COLORS.text_secondary,
        marginTop : 2,
        fontSize : 15
    },
    listContent : {
        paddingHorizontal: 8,
        paddingBottom: 30,
    },
    cardRow : {
        flexDirection : "row",
        justifyContent : "space-between",
        alignItems : "flex-start",
        marginBottom : 8
    },
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
    centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 48,
    margin: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background_card,
    color : COLORS.text_primary,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: 4,
  },
  itemCard: {
    flex: 1 / 2,
    maxWidth: '50%',
    backgroundColor: COLORS.background_card,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 10,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderWidth : 1,
    borderColor : COLORS.border,
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
    fontWeight: '500',
    color: COLORS.text_primary,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
  headerSelectionGroup : {
    color : '#ffffff',
    fontSize : 20,
    fontWeight : "bold",
    paddingLeft : 20
  },
})