import { Animated, Easing } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { hocStyles } from '@styles/GlobalStyles';

interface CartAnimationWrapperProps {
  cartCount: number;
  children: React.ReactNode;
}

const CartAnimationWrapper: FC<CartAnimationWrapperProps> = ({
  cartCount,
  children,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: cartCount > 0 ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [cartCount]);

  const slideUpStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
    opacity: slideAnim,
  };

  return (
    <Animated.View style={[hocStyles.cartContainer, slideUpStyle]}>
      {children}
    </Animated.View>
  );
};

export default CartAnimationWrapper;
