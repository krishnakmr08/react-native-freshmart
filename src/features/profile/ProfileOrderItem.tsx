import { StyleSheet, View } from 'react-native';
import React, { FC } from 'react';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import { formatISOToCustom } from '@utils/DateUtils';

interface CartItem {
  _id: string;
  item: any;
  count: number;
}

interface Order {
  orderId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: 'available' | 'confirmed' | 'arriving' | 'delivered';
}

const ProfileOrderItem: FC<{ item: Order; index: number }> = ({
  item,
  index,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          borderTopWidth: index === 0 ? 0.7 : 0,
        },
      ]}
    >
      <View style={styles.flexRowBetween}>
        <CustomText variant="h8" fontFamily={Fonts.Medium}>
          #{item.orderId}
        </CustomText>

        <CustomText
          variant="h8"
          fontFamily={Fonts.Medium}
          style={{ textTransform: 'capitalize' }}
        >
          {item.status}
        </CustomText>
      </View>

      <View style={styles.flexRowBetween}>
        <View style={styles.itemsContainer}>
          {item.items.map((i, index) => (
            <CustomText variant="h8" numberOfLines={1} key={index}>
              {i.count}x {i.item?.name}
            </CustomText>
          ))}
        </View>

        <View style={styles.priceContainer}>
          <CustomText
            variant="h5"
            fontFamily={Fonts.SemiBold}
            style={styles.price}
          >
            ₹{item.totalPrice}
          </CustomText>

          <CustomText variant="h9">
            {formatISOToCustom(item.createdAt)}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default ProfileOrderItem;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.7,
    paddingVertical: 15,
    opacity: 0.9,
  },

  flexRowBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  itemsContainer: {
    width: '50%',
  },

  priceContainer: {
    alignItems: 'flex-end',
  },

  price: {
    marginTop: 10,
  },
});
