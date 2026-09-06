import { useEffect, useState} from 'react';
import { NavigationContainer, useFocusEffect} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import ScheduleToDay from './src/screens/ScheduleToDay';
import ScheduleWeekly from './src/screens/ScheduleWeekly';
import SettingsPage from './src/screens/SettingsPage';
import WelcomePage from './src/screens/WelcomePage';

import { BottomTabParramList } from './src/navigation/types';
import { COLORS }  from './src/style/style'

import { loadAppSettings } from './src/utils/settingsManager'; 

import { DatabaseProvider, useDatabase } from './src/components/DatabaseContex';

import SelectGroup from './src/screens/SelectGroup';
import SelectTypeWeek from './src/screens/SelectTypeWeek';
import { useAppStore } from './src/services/appStore';
import InputURLTablePage from './src/screens/InputURLTablePage';
import LoadingPage from './src/screens/LoadingPage';

const Tab = createBottomTabNavigator<BottomTabParramList>();
const RootStack = createNativeStackNavigator();

function MainRoot() {
  return (
              <Tab.Navigator
          initialRouteName="ScheduleToDay"
          screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.text_secondary,   // Цвет активной вкладки
          tabBarInactiveTintColor: COLORS.text_primary,
          tabBarStyle: { paddingBottom: 40, paddingTop : 8, height:80, backgroundColor : COLORS.secondary}, 
          headerStyle: { backgroundColor: COLORS.secondary },   
          headerTintColor: COLORS.secondary,                       
          headerTitleStyle: { fontWeight: 'bold' },

          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'alert-circle-outline'; 

            if (route.name === 'ScheduleToDay') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'ScheduleWeekly') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'SettingsPage') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
      })}
        
      >
          <Tab.Screen 
            name="ScheduleToDay" 
            component={ScheduleToDay} 
            options={{ title: 'Сегодня' }} 
          />

          <Tab.Screen 
            name="ScheduleWeekly" 
            component={ScheduleWeekly} 
            options={{ title: 'Неделя' }} 
          />

          <Tab.Screen 
            name="SettingsPage" 
            component={SettingsPage} 
            options={{ title: 'Настройки' }} 
          />
        </Tab.Navigator>
  );
}

export default function App() {
  const checkFirstStart = useAppStore((state) => state.checkFirstStart);
  const isFirstStart = useAppStore((state) => state.isFirstStart);
  const isShowLoadingPage = useAppStore((state) => state.isShowLoadingPage);

  useEffect(() => {
    checkFirstStart();
  }, [checkFirstStart]);

  if (isShowLoadingPage) {
    return <LoadingPage />;
  }

  return (
    <DatabaseProvider>
      <NavigationContainer>
        {isFirstStart ? (
          // Стек приветствия
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="WelcomePage" component={WelcomePage} />
            <RootStack.Screen name="SelectionPage" component={SelectGroup} />
          </RootStack.Navigator>
        ) : (
          // Основной стек
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen
              name="MainTabs"
              component={MainRoot}
              options={{ gestureEnabled: false }}
            />
            <RootStack.Screen name="SelectTypeWeek" component={SelectTypeWeek} />
            <RootStack.Screen name="InputURLTablePage" component={InputURLTablePage} />
          </RootStack.Navigator>
        )}
      </NavigationContainer>
    </DatabaseProvider>
  );
}