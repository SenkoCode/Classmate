import { memo, useEffect, useRef } from 'react';
import { SectionList, Text, View, Animated, Dimensions } from 'react-native'; 
import { WeekScheduleListProps } from '../types/models';
import { globalStyles } from '../style/style';
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
        <View style={isActive ? globalStyles.card_active : globalStyles.card}>
          <Text style={globalStyles.cardTextSubject}>{item.subject}</Text>
          <Text style={globalStyles.cardTextTeacher}>{item.teacher}</Text>
          <Text style={globalStyles.cardTextRoom}>{item.room}</Text>
          {isActive && item.teacher ? <CustomProgressBar timeRange={item.time} /> : null}
          <Text style={globalStyles.cardTextTime}>{item.time}</Text>
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
        contentContainerStyle={globalStyles.listContent}
        showsVerticalScrollIndicator={false}
        
        renderSectionHeader={({ section: { title } }) => (
          <View>
            <Text style={globalStyles.cardHeader}>{title}</Text>
          </View>
        )}
        
        // 6. Передаем index из параметров renderItem прямо в карточку
        renderItem={({ item, index }) => (
          <LessonCard item={item} needTracking={needTracking} index={index} />
        )}
      />
    </View>
  );
});

ScheduleList.displayName = 'ScheduleList';
