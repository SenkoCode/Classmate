import { memo, useEffect, useRef } from 'react';
import { SectionList, Text, View, Animated, Dimensions, StyleSheet } from 'react-native'; 
import { WeekScheduleListProps } from '../types/models';
import { COLORS } from '../style/style';
import { ScheduleItem } from '../types/models';
import { CustomProgressBar } from './ProgressBar';
import { isCurrentSchedule } from '../utils/utils';

const { width } = Dimensions.get('window'); 

interface LessonsCardProps {
  item: ScheduleItem;
  needTracking: boolean;
  index: number;
}

const LessonCard = memo(({ item, needTracking, index }: LessonsCardProps) => {
    const isActive = needTracking && isCurrentSchedule(item.time);

    const cardX = useRef(new Animated.Value(-width)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        cardX.setValue(-width);
        cardOpacity.setValue(1);

        const delay = index * 40; 

        Animated.sequence([
            Animated.delay(delay), 
            Animated.parallel([
                Animated.timing(cardX, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ])
        ]).start();
    }, [item.id]);

    return (
      <Animated.View 
        style={{ 
          opacity: cardOpacity, 
          transform: [{ translateX: cardX }] 
        }}
      >
        <View style={isActive ? style.card_active : style.card}>
          <Text style={style.cardTextSubject}>{item.subject}</Text>
          <Text style={style.cardTextTeacher}>{item.teacher}</Text>
          <Text style={style.cardTextRoom}>{item.room}</Text>
          <Text style={style.cardTextTime}>{item.time}</Text>
          {isActive && item.teacher ? <CustomProgressBar timeRange={item.time} /> : null}
        </View>
      </Animated.View>
    );
}); 

LessonCard.displayName = 'LessonCard';

export const ScheduleList = memo(({ weekData, needTracking }: WeekScheduleListProps) => {
  return (
    <View style={{ flex: 1 }}>
      <SectionList
        sections={weekData}
        keyExtractor={(item) => item.id.toString()}
        stickySectionHeadersEnabled={true} 
        contentContainerStyle={style.listContent}
        showsVerticalScrollIndicator={false}
        
        renderSectionHeader={({ section: { title } }) => (
          <View>
            <Text style={style.cardHeader}>{title}</Text>
          </View>
        )}
        
        renderItem={({ item, index }) => (
          <LessonCard item={item} needTracking={needTracking} index={index} />
        )}
      />
    </View>
  );
});

ScheduleList.displayName = 'ScheduleList';

const style = StyleSheet.create({
    headerTextDayOfWeek : {
        textAlign : 'center',
        fontSize : 18,
        paddingTop : 6,
        color : COLORS.text_primary
    },
        card : {
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

        paddingTop : 10,
        paddingHorizontal :20,

        paddingBottom : 5
    },
    cardTextTeacher : {
        paddingHorizontal :20,
        color : COLORS.text_primary,
        fontSize : 15
    },
    cardTextRoom : {
        paddingHorizontal :20,
        color : COLORS.text_primary,
        fontSize : 15
    },
    cardTextTime : {
        paddingHorizontal :20,
        color : COLORS.text_secondary,
        marginTop : 2,
        fontSize : 15
    },
    listContent : {
        paddingHorizontal: 8,
        paddingBottom: 30,
    },
});