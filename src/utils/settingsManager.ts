import AsyncStorage from "@react-native-async-storage/async-storage";
import { Settings } from "../types/models";

const KEYS = {
    GROUP : 'user_group',
    LAST_UPDATE : 'table_last_update',
    URL : 'url'
};

export const saveAppSettigns = async (group : string, date : Date, url : string) => {
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
            group : group || null,
            lastUpdate : lastUpdate || null,
            url : url || null, 
        };
        return data
    }
    catch
    {
        const data : Settings = {
            group : null,
            lastUpdate : null,
            url : null
        };
        return data
    }
};