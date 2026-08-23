import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import React, { useCallback, useEffect, useState } from 'react';

import { useFocusEffect, useRoute } from '@react-navigation/native';

import { useAuthStore } from '@state/authStore';

import {
  confirmOrder,
  sendLiveOrderUpdates,
  getOrderById,
} from '@service/orderService';

import { Colors, Fonts } from '@utils/Constants';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';

import CustomText from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';

import LiveHeader from '@features/map/LiveHeader';
import LiveMap from '@features/map/LiveMap';
import DeliveryDetails from '@features/map/DeliveryDetails';
import OrderSummary from '@features/map/OrderSummary';

import Geolocation from '@react-native-community/geolocation';

import { hocStyles } from '@styles/GlobalStyles';

type Location = {
  latitude: number;
  longitude: number;
};

const DeliveryMap = () => {
  const user = useAuthStore(state => state.user);
  const setCurrentOrder = useAuthStore(state => state.setCurrentOrder);

  const route = useRoute();

  const orderDetails = route.params as {
    _id: string;
  };

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [myLocation, setMyLocation] = useState<Location | null>(null);

  const fetchOrderDetails = async () => {
    try {
      const data = await getOrderById(orderDetails?._id);
      setOrderData(data);
    } catch (error) {
      console.log('Fetch order error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const getFreshLocation = useCallback(() => {
    console.log('DeliveryMap → getting fresh location');

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const location = {
          latitude,
          longitude,
        };

        console.log('DeliveryMap fresh location:', location);

        setMyLocation(location);
      },
      error => {
        console.log('DeliveryMap location error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      getFreshLocation();
    }, [getFreshLocation]),
  );

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const location = {
          latitude,
          longitude,
        };

        console.log('DeliveryMap live location:', location);

        setMyLocation(location);
      },
      error => {
        console.log('Error fetching GeoLocation:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 200,
        maximumAge: 0,
        timeout: 10000,
      },
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  const acceptOrder = async () => {
    if (!myLocation) {
      Alert.alert(
        'Location unavailable',
        'Getting your location. Please try again.',
      );
      return;
    }

    try {
      const data = await confirmOrder(orderData?._id, myLocation);

      if (data) {
        setCurrentOrder(data);

        Alert.alert(
          'Order Accepted 🚚',
          'The order is now assigned to you. Please pick up the package from the store.',
        );
      } else {
        Alert.alert(
          'Unable to accept order',
          'Something went wrong. Please try again.',
        );
      }

      await fetchOrderDetails();
    } catch (error) {
      console.log('Accept order error', error);

      Alert.alert('Error', 'Unable to accept the order. Please try again.');
    }
  };

  const orderPickedUp = async () => {
    if (!myLocation) {
      Alert.alert(
        'Location unavailable',
        'Getting your location. Please try again.',
      );
      return;
    }

    try {
      const data = await sendLiveOrderUpdates(
        orderData?._id,
        myLocation,
        'arriving',
      );

      if (data) {
        setCurrentOrder(data);

        Alert.alert(
          'Package Picked Up 📦',
          'The package is with you. Please head to the customer for delivery.',
        );
      } else {
        Alert.alert(
          'Unable to update order',
          'Something went wrong. Please try again.',
        );
      }

      await fetchOrderDetails();
    } catch (error) {
      console.log('Pickup error', error);

      Alert.alert('Error', 'Unable to update the pickup status.');
    }
  };

  const orderDelivered = async () => {
    if (!myLocation) {
      Alert.alert(
        'Location unavailable',
        'Getting your location. Please try again.',
      );
      return;
    }

    try {
      const data = await sendLiveOrderUpdates(
        orderData?._id,
        myLocation,
        'delivered',
      );

      if (data) {
        setCurrentOrder(null);

        Alert.alert(
          'Delivery Completed 🎉',
          'Great job! The order has been successfully delivered.',
        );
      } else {
        Alert.alert(
          'Unable to complete delivery',
          'Something went wrong. Please try again.',
        );
      }

      await fetchOrderDetails();
    } catch (error) {
      console.log('Delivery error', error);

      Alert.alert('Error', 'Unable to complete the delivery.');
    }
  };

  useEffect(() => {
    if (!myLocation) return;
    if (!orderData) return;
    if (!user) return;

    const isDeliveryPartner = orderData.deliveryPartner?._id === user._id;

    const isActiveOrder =
      orderData.status !== 'delivered' && orderData.status !== 'cancelled';

    if (!isDeliveryPartner || !isActiveOrder) {
      return;
    }

    const updateLocation = async () => {
      try {
        await sendLiveOrderUpdates(orderData._id, myLocation, orderData.status);
      } catch (error) {
        console.log('Live tracking failed', error);
      }
    };

    updateLocation();
  }, [myLocation, orderData, user]);

  let message = 'New delivery available';

  if (
    orderData?.deliveryPartner?._id === user?._id &&
    orderData?.status === 'confirmed'
  ) {
    message = 'Order accepted — pick up the package';
  } else if (
    orderData?.deliveryPartner?._id === user?._id &&
    orderData?.status === 'arriving'
  ) {
    message = 'Package picked up — head to the customer';
  } else if (orderData?.status === 'delivered') {
    message = 'Delivery completed 🎉';
  } else if (
    orderData?.deliveryPartner?._id !== user?._id &&
    orderData?.status !== 'available'
  ) {
    message = 'This order has already been assigned';
  }

  let secondTitle = 'Ready for pickup';

  if (orderData?.status === 'confirmed') {
    secondTitle = 'Pick up the package from the store';
  } else if (orderData?.status === 'arriving') {
    secondTitle = 'On the way to the customer';
  } else if (orderData?.status === 'delivered') {
    secondTitle = 'Successfully delivered';
  } else if (orderData?.status !== 'available') {
    secondTitle = 'Order status updated';
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator color="#000" size="small" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LiveHeader type="Delivery" title={message} secondTitle={secondTitle} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {orderData?.deliveryLocation && orderData?.pickupLocation && (
          <LiveMap
            deliveryLocation={orderData.deliveryLocation}
            pickupLocation={orderData.pickupLocation}
            hasAccepted={
              orderData?.deliveryPartner?._id === user?._id &&
              orderData?.status === 'confirmed'
            }
            hasPickedUp={orderData?.status === 'arriving'}
            deliveryPersonLocation={
              myLocation || orderData?.deliveryPersonLocation
            }
          />
        )}

        <DeliveryDetails details={orderData?.customer} />

        <OrderSummary order={orderData} />

        <View style={styles.flexRow}>
          <View style={styles.iconContainer}>
            <Icon
              name="cards-heart-outline"
              color={Colors.disabled}
              size={RFValue(20)}
            />
          </View>

          <View style={styles.likeContent}>
            <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
              Do you like our app?
            </CustomText>

            <CustomText variant="h9" fontFamily={Fonts.Medium}>
              Hit Like and subscribe button! If you are enjoying comment your
              excitement
            </CustomText>
          </View>
        </View>

        <CustomText
          fontFamily={Fonts.SemiBold}
          variant="h6"
          style={styles.footerText}
        >
          Krishna Kumar x FreshMart
        </CustomText>
      </ScrollView>

      {orderData?.status !== 'delivered' &&
        orderData?.status !== 'cancelled' && (
          <View style={[hocStyles.cartContainer, styles.btnContainer]}>
            {orderData?.status === 'available' && (
              <CustomButton
                disabled={false}
                title="Accept Order"
                onPress={acceptOrder}
                loading={false}
              />
            )}

            {orderData?.status === 'confirmed' &&
              orderData?.deliveryPartner?._id === user?._id && (
                <CustomButton
                  disabled={false}
                  title="Order Picked Up"
                  onPress={orderPickedUp}
                  loading={false}
                />
              )}

            {orderData?.status === 'arriving' &&
              orderData?.deliveryPartner?._id === user?._id && (
                <CustomButton
                  disabled={false}
                  title="Delivered"
                  onPress={orderDelivered}
                  loading={false}
                />
              )}
          </View>
        )}
    </View>
  );
};

export default DeliveryMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    padding: 15,
    paddingBottom: 150,
    backgroundColor: Colors.backgroundSecondary,
  },

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    borderRadius: 15,
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff',
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

  likeContent: {
    width: '82%',
  },

  footerText: {
    opacity: 0.6,
    marginTop: 20,
  },

  btnContainer: {
    padding: 10,
  },
});
