import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { getScheduleProgress } from '../utils/utils';
import { COLORS } from '../style/style';
import { BlurView } from 'expo-blur';

interface CustomProgressBarProps {
    timeRange: string;
}

export const CustomProgressBar = ({ timeRange }: CustomProgressBarProps) => {
    const [progress, setProgress] = useState(getScheduleProgress(timeRange));

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(getScheduleProgress(timeRange));
        }, 60000);
        return () => clearInterval(timer);
    }, [timeRange]);

    return (
        <View style={styles.container}>
            <View style = {styles.track}>
                <View style={[styles.bar, { width: `${progress}%` }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '93%',
        paddingTop : 5,
        marginHorizontal: 12,
        marginBottom :4
    },
    track: {
        height: 7,                                   
        borderWidth: 1.5,
        backgroundColor : "#141415",
        overflow: 'hidden', 
        borderRadius : 23       
    },
    bar: {
        height: '100%',
        borderRadius: 7,
        backgroundColor: COLORS.border, 
        borderWidth: 1,
        padding : 1,
    },
});
