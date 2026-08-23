import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@utils/Constants';
import { useAuthStore } from '@state/authStore';

import DeliveryHeader from '@components/delivery/DeliveryHeader';
import TabBar from '@components/delivery/TabBar';
import DeliveryOrderItem from '@components/delivery/DeliveryOrderItem';
import CustomText from '@components/ui/CustomText';

import Geolocation from '@react-native-community/geolocation';

import { reverseGeocode } from '@service/mapService';
import { fetchOrders } from '@service/orderService';
import withLiveOrder from './withLiveOrder';

const DeliveryDashboard = () => {
  const { user, setUser, currentOrder } = useAuthStore();

  const [selectedTab, setSelectedTab] = useState<'available' | 'delivered'>(
    'available',
  );

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const previousOrderRef = useRef(currentOrder);

  const updateUserLocation = useCallback(() => {
    console.log('Getting fresh dashboard location...');

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        console.log('DASHBOARD CURRENT LOCATION:', {
          latitude,
          longitude,
        });

        reverseGeocode(latitude, longitude, setUser);
      },
      error => {
        console.log('Dashboard location error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );
  }, [setUser]);

  useFocusEffect(
    useCallback(() => {
      console.log('DeliveryDashboard focused');

      updateUserLocation();

      return () => {
        console.log('DeliveryDashboard unfocused');
      };
    }, [updateUserLocation]),
  );

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const orders = await fetchOrders(selectedTab, user?._id, user?.branch);

      setData(orders);
    } catch (error) {
      console.log('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?._id && user?.branch) {
      fetchData();
    }
  }, [selectedTab, user?._id, user?.branch]);

  useEffect(() => {
    const previousOrder = previousOrderRef.current;

    const orderWasCompleted = previousOrder !== null && currentOrder === null;

    if (orderWasCompleted) {
      console.log('Current order became null. Refreshing orders...');

      fetchData();
    }

    previousOrderRef.current = currentOrder;
  }, [currentOrder]);

  const renderOrderItem = ({ item, index }: { item: any; index: number }) => {
    return <DeliveryOrderItem item={item} index={index} />;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <DeliveryHeader name={user?.name} email={user?.email} />
      </SafeAreaView>

      <View style={styles.subContainer}>
        <TabBar selectedTab={selectedTab} onTabChange={setSelectedTab} />

        <FlatList
          data={data}
          renderItem={renderOrderItem}
          keyExtractor={item => item.orderId}
          contentContainerStyle={styles.flatlistContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchData(true)}
            />
          }
          ListEmptyComponent={() => {
            if (loading) {
              return (
                <View style={styles.center}>
                  <ActivityIndicator color={Colors.secondary} size="small" />
                </View>
              );
            }

            return (
              <View style={styles.center}>
                <CustomText>No Orders found yet!</CustomText>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  subContainer: {
    flex: 1,
    padding: 6,
    backgroundColor: Colors.backgroundSecondary,
  },

  flatlistContainer: {
    padding: 2,
  },

  center: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withLiveOrder(DeliveryDashboard);
