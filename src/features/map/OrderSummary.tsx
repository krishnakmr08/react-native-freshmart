import { Image, StyleSheet, View } from 'react-native';
import React, { FC, memo } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import BillDetails from '@features/order/BillDetails';

interface OrderItem {
  count: number;
  item: {
    name: string;
    image: string;
    price: number;
    quantity: string;
  };
}

interface Order {
  orderId?: string;
  items?: OrderItem[];
}

interface OrderSummaryProps {
  order?: Order | null;
}

const OrderSummary: FC<OrderSummaryProps> = ({ order }) => {
  const items = (order?.items ?? []).filter(item => item?.item);

  const totalPrice = items.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.count,
    0,
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon
            name="shopping-outline"
            color={Colors.disabled}
            size={RFValue(20)}
          />
        </View>

        <View>
          <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
            Order summary
          </CustomText>

          <CustomText variant="h9" fontFamily={Fonts.Medium}>
            Order ID - #{order?.orderId ?? '----'}
          </CustomText>
        </View>
      </View>

      {/* Order Items */}
      {items.map((cartItem, index) => (
        <View style={styles.row} key={index}>
          <View style={styles.imgContainer}>
            <Image source={{ uri: cartItem.item.image }} style={styles.img} />
          </View>

          <View style={styles.itemInfo}>
            <CustomText
              numberOfLines={2}
              variant="h8"
              fontFamily={Fonts.Medium}
            >
              {cartItem.item.name}
            </CustomText>

            <CustomText variant="h9">{cartItem.item.quantity}</CustomText>
          </View>

          <View style={styles.priceContainer}>
            <CustomText variant="h8" fontFamily={Fonts.Medium}>
              ₹{cartItem.item.price * cartItem.count}
            </CustomText>

            <CustomText variant="h9" fontFamily={Fonts.Medium}>
              {cartItem.count}x
            </CustomText>
          </View>
        </View>
      ))}

      {/* Bill */}
      <BillDetails totalItemPrice={totalPrice} />
    </View>
  );
};

export default memo(OrderSummary);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 15,
    marginVertical: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderBottomWidth: 0.7,
    borderColor: Colors.border,
  },

  iconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imgContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  img: {
    width: 40,
    height: 40,
  },

  itemInfo: {
    flex: 1,
  },

  priceContainer: {
    alignItems: 'flex-end',
  },
});
