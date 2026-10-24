import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCartStore } from '@state/cartStore';
import CartAnimationWrapper from './CartAnimationWrapper';
import CartSummary from './CartSummary';

const withCart = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): FC<P> => {
  const WithCartComponent: FC<P> = props => {
    const cart = useCartStore(state => state.cart);

    const cartCount = cart.reduce((acc, item) => acc + item.count, 0);

    const firstItemImage = cart.length > 0 ? cart[0].item?.image ?? null : null;

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />

        <CartAnimationWrapper cartCount={cartCount}>
          <CartSummary cartCount={cartCount} cartImage={firstItemImage} />
        </CartAnimationWrapper>
      </View>
    );
  };

  return React.memo(WithCartComponent);
};

export default withCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
