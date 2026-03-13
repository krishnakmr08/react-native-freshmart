import { Colors, Fonts } from '@utils/Constants';
import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuthStore } from '@state/authStore';
import { getOrderById } from '@service/orderService';
import LiveHeader from './LiveHeader';
import CustomText from '@components/ui/CustomText';
import DeliveryDetails from './DeliveryDetails';
import OrderSummary from './OrderSummary';
import LiveMap from './LiveMap';

const STATUS_CONFIG = {
  pending: {
    msg: 'Packing your order',
    time: 'Arriving in 10 minutes',
  },
  confirmed: {
    msg: 'Arriving soon',
    time: 'Arriving in 8 minutes',
  },
  arriving: {
    msg: 'Order picked up',
    time: 'Arriving in 6 minutes',
  },
  delivered: {
    msg: 'Order delivered',
    time: 'Fastest Delivery',
  },
} as const;

const LiveTracking = () => {
  const currentOrder = useAuthStore(state => state.currentOrder);

  const [order, setOrder] = useState(currentOrder);

  useEffect(() => {
    if (!currentOrder?._id) return;

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(currentOrder._id);
        setOrder(data);
      } catch (err) {
        console.log('Failed to fetch order:', err);
      }
    };

    fetchOrder();
  }, [currentOrder?._id]);

  useEffect(() => {
    setOrder(currentOrder);
  }, [currentOrder]);

  const statusKey = (order?.status as keyof typeof STATUS_CONFIG) ?? 'pending';

  const { msg, time } = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pending;

  const deliveryPartner = order?.deliveryPartner;

  return (
    <View style={styles.container}>
      <LiveHeader type="Customer" title={msg} secondTitle={time} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {order?.deliveryLocation && order?.pickupLocation && (
          <LiveMap
            deliveryLocation={order.deliveryLocation}
            pickupLocation={order.pickupLocation}
            hasAccepted={order.status === 'confirmed'}
            hasPickedUp={order.status === 'arriving'}
            deliveryPersonLocation={order.deliveryPersonLocation}
          />
        )}

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Icon
              name={deliveryPartner ? 'phone' : 'shopping'}
              color={Colors.disabled}
              size={RFValue(20)}
            />
          </View>

          <View style={styles.cardContent}>
            <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
              {deliveryPartner?.name ||
                'We will soon assign a delivery partner'}
            </CustomText>

            {deliveryPartner && (
              <CustomText variant="h7" fontFamily={Fonts.Medium}>
                {deliveryPartner.phone}
              </CustomText>
            )}

            <CustomText variant="h9" fontFamily={Fonts.Medium}>
              {deliveryPartner ? 'For delivery instructions contact here' : msg}
            </CustomText>
          </View>
        </View>

        <DeliveryDetails details={order?.customer} />

        <OrderSummary order={order} />

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Icon
              name="cards-heart-outline"
              color={Colors.disabled}
              size={RFValue(20)}
            />
          </View>

          <View style={styles.cardContent}>
            <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
              Do you like our app?
            </CustomText>

            <CustomText variant="h8" fontFamily={Fonts.Medium}>
              Hit like and subscribe! If you’re enjoying, comment your
              excitement
            </CustomText>
          </View>
        </View>

        <CustomText
          fontFamily={Fonts.SemiBold}
          variant="h6"
          style={styles.footer}
        >
          Krishna Kumar x FreshMart
        </CustomText>
      </ScrollView>
    </View>
  );
};

export default LiveTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },

  scrollContent: {
    padding: 15,
    paddingBottom: 150,
    backgroundColor: Colors.backgroundSecondary,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 15,
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 0.7,
    borderColor: Colors.border,
  },

  cardContent: {
    flex: 1,
  },

  iconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footer: {
    opacity: 0.6,
    marginTop: 20,
  },
});
