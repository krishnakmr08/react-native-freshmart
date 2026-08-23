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
  available: {
    msg: 'Packing your order',
    time: 'Waiting for delivery partner',
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

  cancelled: {
    msg: 'Order cancelled',
    time: 'Order cancelled',
  },
} as const;

const LiveTracking = () => {
  const currentOrder = useAuthStore(state => state.currentOrder);

  const [order, setOrder] = useState(currentOrder);

  // • Fetch the latest order from backend
  useEffect(() => {
    if (!currentOrder?._id) return;

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(currentOrder._id);

        if (data) {
          setOrder(data);
        }
      } catch (error) {
        console.log('Failed to fetch order:', error);
      }
    };

    fetchOrder();
  }, [currentOrder?._id]);

  // • Keep local order synchronized with Zustand currentOrder
  useEffect(() => {
    setOrder(currentOrder);
  }, [currentOrder]);

  const statusKey =
    (order?.status as keyof typeof STATUS_CONFIG) ?? 'available';

  const { msg, time } = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.available;

  const deliveryPartner = order?.deliveryPartner;

  // • Map state
  const hasAccepted = order?.status === 'confirmed';
  const hasPickedUp = order?.status === 'arriving';

  return (
    <View style={styles.container}>
      <LiveHeader type="Customer" title={msg} secondTitle={time} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* • Live map */}
        {order?.deliveryLocation && order?.pickupLocation && (
          <LiveMap
            deliveryLocation={order.deliveryLocation}
            pickupLocation={order.pickupLocation}
            deliveryPersonLocation={order.deliveryPersonLocation}
            hasAccepted={hasAccepted}
            hasPickedUp={hasPickedUp}
          />
        )}

        {/* • Delivery partner card */}
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

        {/* • Customer delivery details */}
        <DeliveryDetails details={order?.customer} />

        {/* • Order summary */}
        {order && <OrderSummary order={order} />}

        {/* • Feedback card */}
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

        {/* • Footer */}
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
