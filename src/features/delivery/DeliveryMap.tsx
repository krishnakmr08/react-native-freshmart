import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
import LiveHeader from '@features/map/LiveHeader';
import LiveMap from '@features/map/LiveMap';
import DeliveryDetails from '@features/map/DeliveryDetails';
import OrderSummary from '@features/map/OrderSummary';
import { useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { hocStyles } from '@styles/GlobalStyles';
import CustomButton from '@components/ui/CustomButton';

type Location = {
  latitude: number;
  longitude: number;
};

const DeliveryMap = () => {
  const user = useAuthStore(state => state.user);
  const { setCurrentOrder } = useAuthStore();

  const route = useRoute();
  const orderDetails = route?.params as { _id: string };

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

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ latitude, longitude });
      },
      err => console.log('Error Fetching GeoLocation', err),
      {
        enableHighAccuracy: true,
        distanceFilter: 200,
      },
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  const acceptOrder = async () => {
    try {
      const data = await confirmOrder(orderData?._id, myLocation);

      if (data) {
        setCurrentOrder(data);
        Alert.alert('Order Accepted, Grab your package');
      } else {
        Alert.alert('There was an error');
      }

      fetchOrderDetails();
    } catch (error) {
      console.log('Accept order error', error);
    }
  };

  const orderPickedUp = async () => {
    try {
      const data = await sendLiveOrderUpdates(
        orderData?._id,
        myLocation,
        'arriving',
      );

      if (data) {
        setCurrentOrder(data);
        Alert.alert("Let's deliver it as soon as possible");
      } else {
        Alert.alert('There was an error');
      }

      fetchOrderDetails();
    } catch (error) {
      console.log('Pickup error', error);
    }
  };

  const orderDelivered = async () => {
    try {
      const data = await sendLiveOrderUpdates(
        orderData?._id,
        myLocation,
        'delivered',
      );

      if (data) {
        setCurrentOrder(null);
        Alert.alert('woohoo! you made it 🎉');
      } else {
        Alert.alert('There was an error');
      }

      fetchOrderDetails();
    } catch (error) {
      console.log('Delivery error', error);
    }
  };

  let message = 'Start this order';

  if (
    orderData?.deliveryPartner?._id === user?._id &&
    orderData?.status === 'confirmed'
  ) {
    message = 'Grab your order';
  } else if (
    orderData?.deliveryPartner?._id === user?._id &&
    orderData?.status === 'arriving'
  ) {
    message = 'Complete your order';
  } else if (
    orderData?.deliveryPartner?._id === user?._id &&
    orderData?.status === 'delivered'
  ) {
    message = 'your milestone';
  } else if (
    orderData?.deliveryPartner?._id !== user?._id &&
    orderData?.status !== 'available'
  ) {
    message = 'You missed it';
  }

  useEffect(() => {
    if (!myLocation || !orderData || !user) return;

    const updateLocation = async () => {
      try {
        if (
          orderData.deliveryPartner?._id === user._id &&
          orderData.status !== 'delivered' &&
          orderData.status !== 'cancelled'
        ) {
          await sendLiveOrderUpdates(
            orderData._id,
            myLocation,
            orderData.status,
          );

          await fetchOrderDetails();
        }
      } catch (err) {
        console.log('Live tracking failed', err);
      }
    };

    updateLocation();
  }, [myLocation]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator color="#000" size="small" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LiveHeader
        type="Delivery"
        title={message}
        secondTitle="Delivery in 10 minutes"
      />

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
              orderData?.deliveryPersonLocation || myLocation
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

          <View style={{ width: '82%' }}>
            <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
              Do you like our app ?
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
          style={{ opacity: 0.6, marginTop: 20 }}
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
                  title="Order picked Up"
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
    paddingBottom: 150,
    backgroundColor: Colors.backgroundSecondary,
    padding: 15,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    borderRadius: 15,
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    padding: 10,
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
  btnContainer: {
    padding: 10,
  },
});
