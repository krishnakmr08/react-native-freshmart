import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import { FC } from 'react';

interface WalletItemProps {
  icon: string;
  label: string;
}

const WalletItem: FC<WalletItemProps> = ({ icon, label }) => {
  return (
    <View style={styles.walletItemContainer}>
      <Icon name={icon} color={Colors.text} size={RFValue(20)} />

      <CustomText variant="h8" fontFamily={Fonts.Medium}>
        {label}
      </CustomText>
    </View>
  );
};

export default WalletItem;

const styles = StyleSheet.create({
  walletItemContainer: {
    alignItems: 'center',
  },
});
