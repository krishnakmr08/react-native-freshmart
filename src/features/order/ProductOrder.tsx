import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuthStore } from '@state/authStore';
import { useCartStore } from '@state/cartStore';
import { hocStyles } from '@styles/GlobalStyles';
import BillDetails from './BillDetails';
import ArrowButton from '@components/ui/ArrowButton';
import OrderList from './OrderList';
import { navigate } from '@utils/NavigationUtils';
import { createOrder } from '@service/orderService';

const ProductOrder = () => {
  const [loading, setLoading] = useState(false);

  const { getTotalPrice, cart, clearCart } = useCartStore();
  const { user, setCurrentOrder, currentOrder } = useAuthStore();

  const totalItemPrice = getTotalPrice();

  const handlePlaceOrder = async () => {
    if (currentOrder !== null) {
      Alert.alert('Let your first order to be delivered');
      return;
    }

    const formattedData = cart.map(item => ({
      id: item._id,
      item: item._id,
      count: item.count,
    }));

    if (formattedData.length === 0) {
      Alert.alert('Add items to place order');
      return;
    }

    setLoading(true);

    const data = await createOrder(formattedData, totalItemPrice);

    if (data !== null) {
      setCurrentOrder(data);
      clearCart();
      navigate('OrderSuccess', { ...data });
    } else {
      Alert.alert('There was an error');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Checkout" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <OrderList />

        <View style={styles.rowCard}>
          <View style={styles.row}>
            <Image
              source={require('@assets/icons/coupon.png')}
              style={styles.iconSmall}
            />
            <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
              Use Coupons
            </CustomText>
          </View>
          <Icon name="chevron-right" size={RFValue(16)} color={Colors.text} />
        </View>

        <BillDetails totalItemPrice={totalItemPrice} />

        <View style={styles.rowCard}>
          <View>
            <CustomText fontFamily={Fonts.SemiBold} variant="h8">
              Cancellation policy
            </CustomText>
            <CustomText
              fontFamily={Fonts.SemiBold}
              variant="h9"
              style={styles.cancelText}
            >
              Order cannot be cancelled once packed for delivery. Refunds apply
              in case of unexpected delays.
            </CustomText>
          </View>
        </View>
      </ScrollView>

      <View style={hocStyles.cartContainer}>
        <View style={styles.absoluteContainer}>
          <View style={styles.addressContainer}>
            <View style={styles.row}>
              <Image
                source={require('@assets/icons/home.png')}
                style={styles.iconHome}
              />
              <View style={styles.addressText}>
                <CustomText variant="h8" fontFamily={Fonts.Medium}>
                  Delivering to Home
                </CustomText>
                <CustomText
                  variant="h9"
                  numberOfLines={2}
                  style={styles.subText}
                >
                  {user?.address || 'No address added'}
                </CustomText>
              </View>
            </View>

            <TouchableOpacity>
              <CustomText
                variant="h8"
                style={{ color: Colors.secondary }}
                fontFamily={Fonts.Medium}
              >
                Change
              </CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentGateway}>
            <View style={{ width: '30%' }}>
              <CustomText fontFamily={Fonts.Regular} fontSize={RFValue(6)}>
                💵 PAY USING
              </CustomText>
              <CustomText fontFamily={Fonts.Regular} variant="h9">
                Cash on Delivery
              </CustomText>
            </View>

            <View style={{ width: '70%' }}>
              <ArrowButton
                loading={loading}
                price={totalItemPrice}
                title="Place Order"
                onPress={handlePlaceOrder}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductOrder;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    paddingBottom: 250,
  },
  rowCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    flexDirection: 'row',
    borderRadius: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelText: { marginTop: 4, opacity: 0.6 },
  iconSmall: { width: 25, height: 25, marginRight: 10 },
  iconHome: { height: 20, width: 20, marginRight: 10 },
  addressText: { width: '75%' },
  subText: { opacity: 0.6 },
  paymentGateway: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 14,
    paddingTop: 10,
  },
  addressContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.7,
    borderColor: Colors.border,
  },
  absoluteContainer: {
    marginVertical: 15,
    marginBottom: Platform.OS === 'ios' ? 30 : 10,
  },
});
