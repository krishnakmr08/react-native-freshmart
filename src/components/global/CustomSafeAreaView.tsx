import {
  StyleSheet,
  View,
  ViewStyle,
  SafeAreaView as RNSafeAreaView,
  Platform,
} from 'react-native';
import React, { FC } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
interface CustomSafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
const CustomSafeAreaView: FC<CustomSafeAreaViewProps> = ({
  children,
  style,
}) => {
  const PlatformSafeAreaView =
    Platform.OS === 'android' ? SafeAreaView : RNSafeAreaView;
  return (
    <PlatformSafeAreaView style={[styles.container, style]}>
      <View style={[styles.container, style]}>{children}</View>
    </PlatformSafeAreaView>
  );
};

export default CustomSafeAreaView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
