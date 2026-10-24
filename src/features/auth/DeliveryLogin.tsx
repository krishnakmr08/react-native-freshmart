import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import React, { FC, useState } from 'react';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomText from '@components/ui/CustomText';
import CustomInput from '@components/ui/CustomInput';
import CustomButton from '@components/ui/CustomButton';
import { screenHeight } from '@utils/Scaling';
import { Fonts } from '@utils/Constants';
import { resetAndNavigate } from '@utils/NavigationUtils';
import { deliveryLogin } from '@service/authService';

const DeliveryLogin: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Missing Details', 'Please enter your email and password.');
      return;
    }

    if (trimmedPassword.length < 8) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters.',
      );
      return;
    }

    setLoading(true);

    try {
      const success = await deliveryLogin(trimmedEmail, trimmedPassword);

      if (success) {
        resetAndNavigate('DeliveryDashboard');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (error) {
      console.log('Delivery login error:', error);

      Alert.alert('Login Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.lottieContainer}>
            <LottieView
              autoPlay
              loop
              style={styles.lottie}
              source={require('@assets/animations/delivery_man.json')}
              hardwareAccelerationAndroid
            />
          </View>

          <CustomText variant="h3" fontFamily={Fonts.Bold}>
            Delivery Partner Portal
          </CustomText>

          <CustomText variant="h6" fontFamily={Fonts.Bold} style={styles.text}>
            Faster than Flash
          </CustomText>

          <CustomInput
            value={email}
            onChangeText={setEmail}
            left={
              <Icon
                name="mail"
                color="#F8890E"
                style={styles.icon}
                size={RFValue(18)}
              />
            }
            placeholder="Email"
            inputMode="email"
            right={false}
          />

          <CustomInput
            value={password}
            onChangeText={setPassword}
            left={
              <Icon
                name="key-sharp"
                color="#F8890E"
                style={styles.icon}
                size={RFValue(18)}
              />
            }
            placeholder="Password"
            secureTextEntry
            right={false}
          />

          <CustomButton
            disabled={
              email.trim().length === 0 || password.trim().length < 8 || loading
            }
            title="Login"
            onPress={handleLogin}
            loading={loading}
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

export default DeliveryLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    alignItems: 'center',
  },

  lottieContainer: {
    height: screenHeight * 0.12,
    width: '100%',
  },

  lottie: {
    width: '100%',
    height: '100%',
  },

  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.8,
  },

  icon: {
    marginLeft: 10,
  },
});
