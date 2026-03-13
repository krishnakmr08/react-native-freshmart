import { Pressable, StyleSheet, View, SafeAreaView } from 'react-native';
import React, { FC, memo } from 'react';
import { useAuthStore } from '@state/authStore';
import { navigate } from '@utils/NavigationUtils';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';

interface LiveHeaderProps {
  type: 'Customer' | 'Delivery';
  title: string;
  secondTitle: string;
}

const LiveHeader: FC<LiveHeaderProps> = ({ type, title, secondTitle }) => {
  const isCustomer = type === 'Customer';

  const currentOrder = useAuthStore(state => state.currentOrder);
  const setCurrentOrder = useAuthStore(state => state.setCurrentOrder);

  const handleBack = () => {
    if (isCustomer) {
      if (currentOrder?.status === 'delivered') {
        setCurrentOrder(null);
      }

      navigate('ProductDashboard');
      return;
    }

    navigate('DeliveryDashboard');
  };

  const textColor = isCustomer ? styles.whiteText : styles.blackText;

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Icon
            name="chevron-back"
            size={RFValue(18)}
            color={isCustomer ? '#fff' : '#000'}
          />
        </Pressable>

        <CustomText variant="h8" fontFamily={Fonts.Medium} style={textColor}>
          {title}
        </CustomText>

        <CustomText variant="h4" fontFamily={Fonts.SemiBold} style={textColor}>
          {secondTitle}
        </CustomText>
      </View>
    </SafeAreaView>
  );
};

export default memo(LiveHeader);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },

  backButton: {
    position: 'absolute',
    left: 20,
  },

  whiteText: {
    color: '#fff',
  },

  blackText: {
    color: '#000',
  },
});
