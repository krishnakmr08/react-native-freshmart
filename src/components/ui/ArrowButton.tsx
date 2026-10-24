import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';

interface ArrowButtonProps {
  title: string;
  onPress: () => void;
  price?: number;
  loading: boolean;
}

const ArrowButton: FC<ArrowButtonProps> = ({
  loading,
  price,
  title,
  onPress,
}) => {
  const hasPrice = price !== undefined && price !== 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
      style={[
        styles.btn,
        {
          justifyContent: hasPrice ? 'space-between' : 'center',
        },
      ]}
    >
      {hasPrice && (
        <View>
          <CustomText
            variant="h7"
            style={styles.whiteText}
            fontFamily={Fonts.Medium}
          >
            ₹{price + 34}.0
          </CustomText>

          <CustomText
            variant="h9"
            fontFamily={Fonts.Medium}
            style={styles.whiteText}
          >
            TOTAL
          </CustomText>
        </View>
      )}

      <View style={styles.flexRow}>
        <CustomText
          variant="h6"
          style={styles.whiteText}
          fontFamily={Fonts.Medium}
        >
          {title}
        </CustomText>

        {loading ? (
          <ActivityIndicator color="#fff" style={styles.loader} size="small" />
        ) : (
          <Icon name="arrow-right" color="#fff" size={RFValue(25)} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ArrowButton;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.secondary,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 15,
  },

  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  whiteText: {
    color: '#fff',
  },

  loader: {
    marginHorizontal: 5,
  },
});
