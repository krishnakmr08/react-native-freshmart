import React, { FC, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { io, Socket } from 'socket.io-client';
import CustomText from '@components/ui/CustomText';
import { useAuthStore } from '@state/authStore';
import { hocStyles } from '@styles/GlobalStyles';
import { Colors, Fonts } from '@utils/Constants';
import { navigate } from '@utils/NavigationUtils';
import { getOrderById } from '@service/orderService';
import { SOCKET_URL } from '@service/config';

let socket: Socket | null = null;

const withLiveStatus = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): FC<P> => {
  const WithLiveStatusComponent: FC<P> = props => {
    const { currentOrder, setCurrentOrder } = useAuthStore();

    const routeName = useNavigationState(
      state => state.routes[state.index]?.name,
    );

    const socketRef = useRef<Socket | null>(null);

    const fetchOrderDetails = useCallback(
      async (orderId: string) => {
        try {
          const data = await getOrderById(orderId);
          setCurrentOrder(data);
        } catch (err) {
          console.log('Order fetch error:', err);
        }
      },
      [setCurrentOrder],
    );

    useEffect(() => {
      if (!socket) {
        socket = io(SOCKET_URL, {
          transports: ['websocket'],
        });
      }

      socketRef.current = socket;
    }, []);

    useEffect(() => {
      if (!currentOrder?._id || !socketRef.current) return;

      const orderId = currentOrder._id;
      const socketInstance = socketRef.current;

      socketInstance.emit('joinRoom', orderId);

      const updateHandler = () => {
        console.log('Live order update');
        fetchOrderDetails(orderId);
      };

      socketInstance.off('liveTrackingUpdates');
      socketInstance.off('orderConfirmed');

      socketInstance.on('liveTrackingUpdates', updateHandler);
      socketInstance.on('orderConfirmed', updateHandler);

      return () => {
        socketInstance.off('liveTrackingUpdates', updateHandler);
        socketInstance.off('orderConfirmed', updateHandler);
      };
    }, [currentOrder?._id, fetchOrderDetails]);

    const firstItem = currentOrder?.items?.[0]?.item?.name || 'Your order';

    const itemsLength = currentOrder?.items?.length ?? 0;

    const extraItems = Math.max(itemsLength - 1, 0);

    const showBanner = currentOrder && routeName === 'ProductDashboard';

    return (
      <View style={{ flex: 1 }}>
        <WrappedComponent {...props} />

        {showBanner && (
          <View
            style={[
              hocStyles.cartContainer,
              { flexDirection: 'row', alignItems: 'center' },
            ]}
          >
            <View style={styles.flexRow}>
              <View style={styles.img}>
                <Image
                  source={require('@assets/icons/bucket.png')}
                  style={{ width: 20, height: 20 }}
                />
              </View>

              <View style={{ width: '65%' }}>
                <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
                  Order is {currentOrder.status}
                </CustomText>

                <CustomText variant="h9" fontFamily={Fonts.Medium}>
                  {firstItem}
                  {extraItems > 0 && ` and ${extraItems} more items`}
                </CustomText>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigate('LiveTracking')}
              style={styles.btn}
            >
              <CustomText
                fontFamily={Fonts.Medium}
                variant="h8"
                style={{ color: Colors.secondary }}
              >
                View
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return React.memo(WithLiveStatusComponent);
};

export default withLiveStatus;

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 15,
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    paddingVertical: 4,
    borderWidth: 0.7,
    borderColor: Colors.secondary,
    borderRadius: 5,
  },
});
