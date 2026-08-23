import React, { FC, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@utils/Constants';
import SidebarItem from './SideBarItem';

const ITEM_HEIGHT = 100;

interface SidebarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const Sidebar: FC<SidebarProps> = ({
  selectedCategory,
  categories,
  onCategoryPress,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const indicatorPosition = useSharedValue(0);

  useEffect(() => {
    const targetIndex = categories.findIndex(
      category => category._id === selectedCategory?._id,
    );

    if (targetIndex === -1) return;

    const targetPosition = targetIndex * ITEM_HEIGHT;

    indicatorPosition.value = withTiming(targetPosition, {
      duration: 400,
    });

    scrollViewRef.current?.scrollTo({
      y: targetPosition,
      animated: true,
    });
  }, [selectedCategory?._id, categories]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: indicatorPosition.value,
        },
      ],
    };
  });

  return (
    <View style={styles.sideBar}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {categories.map(category => (
          <SidebarItem
            key={category._id}
            category={category}
            selected={selectedCategory?._id === category._id}
            onPress={() => onCategoryPress(category)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sideBar: {
    width: '24%',
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },

  scrollContent: {
    paddingBottom: 50,
  },

  indicator: {
    position: 'absolute',
    right: 0,
    top: 10,
    width: 4,
    height: 60,
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
});
