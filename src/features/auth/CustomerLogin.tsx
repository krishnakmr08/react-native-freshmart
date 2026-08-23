import {
  Alert,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';

import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import ProductSlider from '@components/login/ProductSlider';
import CustomText from '@components/ui/CustomText';
import CustomInput from '@components/ui/CustomInput';
import CustomButton from '@components/ui/CustomButton';

import { Colors, Fonts, lightColors } from '@utils/Constants';
import { resetAndNavigate } from '@utils/NavigationUtils';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';

import Logo from '@assets/images/appstore.png';
import { customerLogin } from '@service/authService';

const bottomColors = [...lightColors].reverse();

const CustomerLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [gestureSequence, setGestureSequence] = useState<string[]>([]);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const keyboardOffsetHeight = useKeyboardOffsetHeight();

  const handleGesture = ({ nativeEvent }: any) => {
    if (nativeEvent.state !== State.END) return;

    const { translationX, translationY } = nativeEvent;

    let direction = '';

    if (Math.abs(translationX) > Math.abs(translationY)) {
      direction = translationX > 0 ? 'right' : 'left';
    } else {
      direction = translationY > 0 ? 'down' : 'up';
    }

    const newSequence = [...gestureSequence, direction].slice(-5);

    setGestureSequence(newSequence);

    if (newSequence.join(' ') === 'up up down left right') {
      setGestureSequence([]);
      resetAndNavigate('DeliveryLogin');
    }
  };

  const handleAuth = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number',
      );
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const success = await customerLogin(phoneNumber);

      if (success) {
        resetAndNavigate('ProductDashboard');
      } else {
        Alert.alert(
          'Login Failed',
          'Please check your mobile number and try again.',
        );
      }
    } catch (error) {
      console.log('Customer login error:', error);

      Alert.alert('Login Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: keyboardOffsetHeight === 0 ? 0 : -keyboardOffsetHeight * 0.82,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [keyboardOffsetHeight, animatedValue]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <CustomSafeAreaView>
        <ProductSlider />

        <PanGestureHandler onHandlerStateChange={handleGesture}>
          <Animated.ScrollView
            bounces={false}
            style={{
              transform: [{ translateY: animatedValue }],
            }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.subContainer}
          >
            <LinearGradient colors={bottomColors} style={styles.gradient} />

            <View style={styles.content}>
              <Image source={Logo} style={styles.logo} />

              <CustomText variant="h2" fontFamily={Fonts.Bold}>
                India's last minute app
              </CustomText>

              <CustomText
                variant="h5"
                fontFamily={Fonts.SemiBold}
                style={styles.text}
              >
                Log in or sign up
              </CustomText>

              <CustomInput
                value={phoneNumber}
                onChangeText={text => setPhoneNumber(text.slice(0, 10))}
                onClear={() => setPhoneNumber('')}
                placeholder="Enter mobile number"
                inputMode="numeric"
                right
                left={
                  <CustomText
                    variant="h6"
                    style={styles.phoneText}
                    fontFamily={Fonts.SemiBold}
                  >
                    + 91
                  </CustomText>
                }
              />

              <CustomButton
                disabled={phoneNumber.length !== 10}
                onPress={handleAuth}
                title="Continue"
                loading={loading}
              />
            </View>
          </Animated.ScrollView>
        </PanGestureHandler>
      </CustomSafeAreaView>

      <View style={styles.footer}>
        <SafeAreaView>
          <CustomText fontSize={RFValue(6)}>
            By Continuing, you agree to our Terms and Services & Privacy
          </CustomText>
        </SafeAreaView>
      </View>

      <TouchableOpacity
        style={styles.absoluteSwitch}
        onPress={() => resetAndNavigate('DeliveryLogin')}
      >
        <Icon name="bike-fast" color="#000" size={RFValue(18)} />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

export default CustomerLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  absoluteSwitch: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 10,
    zIndex: 99,
    width: 55,
    height: 55,
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },

  gradient: {
    width: '100%',
    paddingTop: 60,
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginVertical: 10,
  },

  subContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },

  content: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.8,
  },

  phoneText: {
    marginLeft: 10,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    width: '100%',
    padding: 10,
    backgroundColor: '#f8f9fc',
    borderTopWidth: 0.8,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
