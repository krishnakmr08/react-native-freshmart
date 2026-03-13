
import { Image, StyleSheet, View } from 'react-native';
import { Colors, Fonts } from '@utils/Constants';
import { useCartStore } from '@state/cartStore';
import CustomText from '@components/ui/CustomText';
import OrderItem from './OrderItem';

const OrderList = () => {
  const cartItems = useCartStore(state => state.cart);

  const totalItems = cartItems?.reduce((acc, cart) => acc + cart?.count, 0);

  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <View style={styles.imgContainer}>
          <Image
            source={require('@assets/icons/clock.png')}
            style={styles.img}
          />
        </View>

        <View>
          <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
            Delivery in 12 minutes
          </CustomText>

          <CustomText
            variant="h8"
            style={styles.subText}
            fontFamily={Fonts.SemiBold}
          >
            Shipment of {totalItems || 0} item
          </CustomText>
        </View>
      </View>

      {cartItems?.map(item => (
        <OrderItem key={item._id} item={item} />
      ))}
    </View>
  );
};

export default OrderList

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  imgContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 15,
    marginRight: 12,
  },
  img: {
    width: 30,
    height: 30,
  },
  subText: {
    opacity: 0.5,
  },
});
