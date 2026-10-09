import AsyncStorage from "@react-native-async-storage/async-storage";
import { Settings } from "../types/models";

const KEYS = {
    GROUP : 'user_group',
    LAST_UPDATE : 'table_last_update',
    URL : 'url'
};

export const saveAppSettigns = async (group : string, date : Date | string, url : string) => {
    try
    {
        await AsyncStorage.setItem(KEYS.GROUP, group);
        await AsyncStorage.setItem(KEYS.LAST_UPDATE, date.toString());
        await AsyncStorage.setItem(KEYS.URL, url);
    }
    catch { }
};

export const loadAppSettings = async () : Promise<Settings> =>
{
    try {
        const group = await AsyncStorage.getItem(KEYS.GROUP);
        const lastUpdate = await AsyncStorage.getItem(KEYS.LAST_UPDATE);
        const url = await AsyncStorage.getItem(KEYS.URL);
        const data : Settings = {
            group : group || "",
            lastUpdate : lastUpdate || null,
            url : url || "https://docs.google.com/spreadsheets/d/1aUdgTonuua6JZHEFojLeo_jtSd1AO-1K/edit?gid=1197657310#gid=1197657310",
        };
        return data
    }
    catch
    {
        const data : Settings = {
            group : "",
            lastUpdate : null,
            url : ""
        };
        return data
    }
};