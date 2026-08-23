import {
  Platform,
  StyleSheet,
  View,
  Animated as RNAnimated,
  TouchableOpacity,
} from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { NoticeHeight, screenHeight } from '@utils/Scaling';
import {
  CollapsibleContainer,
  CollapsibleScrollView,
  CollapsibleHeaderContainer,
  useCollapsibleContext,
  withCollapsibleContext,
} from '@r0b0t3d/react-native-collapsible';
import NoticeAnimation from './NoticeAnimation';
import Visuals from './Visuals';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedHeader from './AnimatedHeader';
import StickySearchBar from './StickySearchBar';
import Content from '@components/dashboard/Content';
import withCart from '@features/cart/withCart';
import withLiveStatus from '@features/map/withLiveStatus';

const NOTICE_HEIGHT = -(NoticeHeight + 12);

const ProductDashboard: FC = () => {
  const noticePosition = useRef(new RNAnimated.Value(NOTICE_HEIGHT)).current;

  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const insets = useSafeAreaInsets();

  const { scrollY, expand } = useCollapsibleContext();

  const previousScroll = useRef<number>(0);

  const backToTopStyle = useAnimatedStyle(() => {
    const isScrollingUp =
      scrollY.value < previousScroll.current && scrollY.value > 180;

    const opacity = withTiming(isScrollingUp ? 1 : 0, {
      duration: 300,
    });

    const translateY = withTiming(isScrollingUp ? 0 : 10, {
      duration: 300,
    });

    previousScroll.current = scrollY.value;

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const hideNotice = () => {
    RNAnimated.timing(noticePosition, {
      toValue: NOTICE_HEIGHT,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  const showNotice = () => {
    RNAnimated.timing(noticePosition, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  const showNoticeTemporarily = () => {
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }

    showNotice();

    noticeTimerRef.current = setTimeout(() => {
      hideNotice();
    }, 3500);
  };

  useEffect(() => {
    showNotice();

    noticeTimerRef.current = setTimeout(() => {
      hideNotice();
    }, 2500);

    return () => {
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  return (
    <NoticeAnimation noticePosition={noticePosition}>
      <Visuals />

      <Animated.View style={[styles.backToTopButton, backToTopStyle]}>
        <TouchableOpacity
          onPress={() => {
            scrollY.value = 0;
            expand();
          }}
          style={styles.backToTopContent}
        >
          <Icon
            name="arrow-up-circle-outline"
            color="white"
            size={RFValue(12)}
          />

          <CustomText
            variant="h9"
            style={styles.backToTopText}
            fontFamily={Fonts.SemiBold}
          >
            Back to top
          </CustomText>
        </TouchableOpacity>
      </Animated.View>

      <CollapsibleContainer
        style={[styles.panelContainer, { marginTop: insets.top }]}
      >
        <CollapsibleHeaderContainer containerStyle={styles.transparent}>
          <AnimatedHeader showNotice={showNoticeTemporarily} />

          <StickySearchBar />
        </CollapsibleHeaderContainer>

        <CollapsibleScrollView
          nestedScrollEnabled
          style={styles.panelContainer}
          showsVerticalScrollIndicator={false}
        >
          <Content />

          <View style={styles.footerContainer}>
            <CustomText
              fontFamily={Fonts.Bold}
              fontSize={RFValue(32)}
              style={styles.footerTitle}
            >
              FreshMart 🛒
            </CustomText>

            <CustomText
              fontSize={RFValue(12)}
              fontFamily={Fonts.Bold}
              style={styles.footerText}
            >
              Developed By Krishna Kumar
            </CustomText>
          </View>
        </CollapsibleScrollView>
      </CollapsibleContainer>
    </NoticeAnimation>
  );
};

export default withLiveStatus(
  withCart(withCollapsibleContext(ProductDashboard)),
);

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
  },

  transparent: {
    backgroundColor: 'transparent',
  },

  backToTopButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: Platform.OS === 'ios' ? screenHeight * 0.18 : 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 200,
  },

  backToTopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  backToTopText: {
    color: '#ffffff',
  },

  footerContainer: {
    backgroundColor: '#F8F8F8',
    padding: 20,
  },

  footerTitle: {
    opacity: 0.2,
  },

  footerText: {
    marginTop: 10,
    paddingBottom: 100,
    opacity: 0.2,
  },
});
