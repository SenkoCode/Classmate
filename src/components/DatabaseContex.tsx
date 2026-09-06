import React, {createContext, useContext, useEffect, useState} from "react";
import { Text } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { dbService } from "../services/dataBaseServices";
import LoadingPage from "../screens/LoadingPage";

import { globalStyles } from "../style/style";

const DatabaseContext = createContext<typeof dbService | null>(null);

export const DatabaseProvider : React.FC<{ children : React.ReactNode}> = ({ children }) => {
    const [isDbReady, setIsDbReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const setupDatabase = async () => {
            try {
                await dbService.initDB();
                setIsDbReady(true);
            }
            catch (e)
            {
                console.log(e);
                setError(String(e));
            }
        }

        setupDatabase();
    }, []);

    if (error) {
    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={{ color: 'red', padding: 20 }}>Ошибка: {error}</Text>
        </SafeAreaView>
    );
}

    if (!isDbReady)
    {
        return (
            <LoadingPage>

            </LoadingPage>
        );
    }

    return (
        <DatabaseContext.Provider value={dbService}>
            {children}
        </DatabaseContext.Provider>
    );
}

export const useDatabase = () => {
    const contex = useContext(DatabaseContext);
    if (!contex) {
        throw new Error('useDatabase должен использоватся внутри DatabaseProvider');
    }
    return contex;
}