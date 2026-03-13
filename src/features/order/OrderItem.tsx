import { Image, StyleSheet, View } from 'react-native';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import UniversalAdd from '@components/ui/UniversalAdd';
import { FC } from 'react';

const OrderItem: FC<{ item: any }> = ({ item }) => {
  const totalPrice = (item.count ?? 0) * (item.item.price ?? 0);

  return (
    <View style={styles.flexRow}>
      <View style={styles.imgContainer}>
        <Image source={{ uri: item.item.image }} style={styles.img} />
      </View>

      <View style={styles.infoContainer}>
        <CustomText numberOfLines={2} variant="h8" fontFamily={Fonts.Medium}>
          {item.item.name}
        </CustomText>
        <CustomText variant="h9">{item.item.quantity}</CustomText>
      </View>

      <View style={styles.actionContainer}>
        <UniversalAdd item={item.item} />
        <CustomText variant="h8" fontFamily={Fonts.Medium} style={styles.price}>
          ₹{totalPrice}
        </CustomText>
      </View>
    </View>
  );
};

export default OrderItem

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopWidth: 0.6,
    borderTopColor: Colors.border,
  },
  imgContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 15,
    marginRight: 12,
  },
  img: {
    width: 40,
    height: 40,
  },
  infoContainer: {
    flex: 1,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  price: {
    marginTop: 4,
  },
});
