import { View, StyleSheet } from 'react-native';
import React, { FC, memo } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

interface DeliveryDetailsProps {
  details?: {
    name?: string;
    phone?: string;
    address?: string;
  } | null;
}

const DeliveryDetails: FC<DeliveryDetailsProps> = ({ details }) => {
  const name = details?.name ?? 'Anonymous';
  const phone = details?.phone ?? 'XXXXXXXXXX';
  const address = details?.address ?? 'Address not available';

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.headerRow]}>
        <View style={styles.iconContainer}>
          <Icon name="bike-fast" color={Colors.disabled} size={RFValue(20)} />
        </View>

        <View style={styles.content}>
          <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
            Your delivery details
          </CustomText>

          <CustomText variant="h8" fontFamily={Fonts.Medium}>
            Details of your current order
          </CustomText>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon
            name="map-marker-outline"
            color={Colors.disabled}
            size={RFValue(20)}
          />
        </View>

        <View style={styles.content}>
          <CustomText variant="h8" fontFamily={Fonts.Medium}>
            Delivery Address
          </CustomText>

          <CustomText numberOfLines={2} variant="h8" fontFamily={Fonts.Regular}>
            {address}
          </CustomText>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon
            name="phone-outline"
            color={Colors.disabled}
            size={RFValue(20)}
          />
        </View>

        <View style={styles.content}>
          <CustomText variant="h8" fontFamily={Fonts.Medium}>
            {name} • {phone}
          </CustomText>

          <CustomText variant="h8" fontFamily={Fonts.Regular}>
            Receiver's contact number
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default memo(DeliveryDetails);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 15,
    marginVertical: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },

  headerRow: {
    borderBottomWidth: 0.7,
    borderColor: Colors.border,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },

  content: {
    flex: 1,
  },

  iconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
