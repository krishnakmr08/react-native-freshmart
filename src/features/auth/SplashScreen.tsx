import { Alert, Image, StyleSheet, View } from 'react-native';
import React, { FC, use, useCallback, useEffect } from 'react';
import Logo from '@assets/images/icon.png';
import { screenHeight, screenWidth } from '@utils/Scaling';
import { resetAndNavigate } from '@utils/NavigationUtils';
import GeoLocation from '@react-native-community/geolocation';
import { useAuthStore } from '@state/authStore';
import { tokenStorage } from '@state/storage';
import { jwtDecode } from 'jwt-decode';
import { Colors } from '@utils/Constants';
import { refetchUser, refresh_tokens } from '@service/authService';

GeoLocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
});

interface DecodedToken {
  exp: number;
}

const SplashScreen: FC = () => {
  const setUser = useAuthStore(state => state.setUser);

  const tokenCheck = useCallback(async () => {
    const accessToken = tokenStorage.getString('accessToken');
    const refreshToken = tokenStorage.getString('refreshToken');

    // No tokens → Login
    if (!accessToken || !refreshToken) {
      resetAndNavigate('CustomerLogin');
      return;
    }

    try {
      const currentTime = Date.now() / 1000;

      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);

      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);

      // Refresh token expired → Login
      if (decodedRefreshToken.exp < currentTime) {
        Alert.alert('Session Expired', 'Please login again');

        resetAndNavigate('CustomerLogin');
        return;
      }

      // Access token expired → Refresh it
      if (decodedAccessToken.exp < currentTime) {
        const newAccessToken = await refresh_tokens();

        if (!newAccessToken) {
          resetAndNavigate('CustomerLogin');
          return;
        }
      }

      // Get latest user from server
      const user = await refetchUser(setUser);

      // Failed to fetch user
      if (!user) {
        resetAndNavigate('CustomerLogin');
        return;
      }

      console.log(user.role)

      // Role-based navigation
      if (user.role === 'Customer') {
        resetAndNavigate('ProductDashboard');
      } else if (user.role === 'DeliveryPartner') {
        resetAndNavigate('DeliveryDashboard');
      } else {
        resetAndNavigate('CustomerLogin');
      }
    } catch (error) {
      console.log('Token check error:', error);

      Alert.alert('Error', 'There was an error refreshing token');

      resetAndNavigate('CustomerLogin');
    }
  }, [setUser]);

  useEffect(() => {
    const initialStartup = async () => {
      try {
        GeoLocation.requestAuthorization();
        await tokenCheck();
      } catch (error) {
        console.log('Startup error:', error);

        Alert.alert(
          'Location Required',
          'Sorry, we need location service to give you a better shopping experience.',
        );
      }
    };

    const timeoutId = setTimeout(initialStartup, 1000);

    return () => clearTimeout(timeoutId);
  }, [tokenCheck]);

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logoImage} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.active,
  },

  logoImage: {
    height: screenHeight * 0.5,
    width: screenWidth * 0.5,
    resizeMode: 'contain',
  },
});
