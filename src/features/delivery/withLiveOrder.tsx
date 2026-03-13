import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type { LatLng } from 'react-native-maps';
import { Colors, Fonts } from '@utils/Constants';
import { useAuthStore } from '@state/authStore';

import { hocStyles } from '@styles/GlobalStyles';
import { navigate } from '@utils/NavigationUtils';

import CustomText from '@components/ui/CustomText';
import { sendLiveOrderUpdates } from '@service/orderService';

const withLiveOrder = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): FC<P> => {
  const WithLiveOrder: FC<P> = props => {
    const { currentOrder, user } = useAuthStore();
    const [myLocation, setMyLocation] = useState<LatLng | null>(null);

    useEffect(() => {
      if (!currentOrder) return;

      const watchId = Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setMyLocation({ latitude, longitude });
        },
        error => console.log('Location error:', error),
        {
          enableHighAccuracy: true,
          distanceFilter: 200,
        },
      );

      return () => Geolocation.clearWatch(watchId);
    }, [currentOrder]);

    useEffect(() => {
      if (!myLocation) return;
      if (!currentOrder) return;
      if (!user) return;

      const isDeliveryPartner = currentOrder.deliveryPartner?._id === user._id;

      const isActiveOrder =
        currentOrder.status !== 'delivered' &&
        currentOrder.status !== 'cancelled';

      if (isDeliveryPartner && isActiveOrder) {
        sendLiveOrderUpdates(currentOrder._id, myLocation, currentOrder.status);
      }
    }, [myLocation, currentOrder, user]);

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />

        {currentOrder && (
          <View
            style={[
              hocStyles.cartContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
              },
            ]}
          >
            <View style={styles.flexRow}>
              <View style={styles.img}>
                <Image
                  source={require('@assets/icons/bucket.png')}
                  style={{ width: 20, height: 20 }}
                />
              </View>

              <View style={{ width: '62%' }}>
                <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
                  #{currentOrder?.orderId}
                </CustomText>
                <CustomText variant="h9" fontFamily={Fonts.Medium}>
                  {currentOrder?.deliveryLocation?.address}
                </CustomText>
              </View>

              <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                  navigate('DeliveryMap', {
                    ...currentOrder,
                  })
                }
              >
                <CustomText
                  variant="h8"
                  fontFamily={Fonts.Medium}
                  style={{ color: Colors.secondary }}
                >
                  Continue
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return WithLiveOrder;
};

export default withLiveOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    paddingVertical: 10,
  },
  img: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 0.7,
    borderColor: Colors.secondary,
    borderRadius: 5,
  },
});
