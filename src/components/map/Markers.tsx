
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { Marker, type LatLng } from 'react-native-maps';

interface MarkersProps {
  deliveryLocation?: LatLng | null;
  pickupLocation?: LatLng | null;
  deliveryPersonLocation?: LatLng | null;
}

const Markers = ({
  deliveryLocation,
  pickupLocation,
  deliveryPersonLocation,
}: MarkersProps) => {
  const renderMarker = (
    coordinate: LatLng,
    asset: number,
    identifier: string,
  ) => (
    <Marker
      key={identifier}
      identifier={identifier}
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={Platform.OS === 'ios'}
      image={Platform.OS === 'android' ? asset : undefined}
    >
      {Platform.OS === 'ios' && (
        <Image
          source={asset}
          style={styles.icon}
          resizeMode="contain"
          fadeDuration={0}
        />
      )}
    </Marker>
  );

  return (
    <>
      {deliveryLocation &&
        renderMarker(
          deliveryLocation,
          require('@assets/icons/my_pin.png'),
          'delivery',
        )}

      {pickupLocation &&
        renderMarker(
          pickupLocation,
          require('@assets/icons/store.png'),
          'pickup',
        )}

      {deliveryPersonLocation &&
        renderMarker(
          deliveryPersonLocation,
          require('@assets/icons/delivery.png'),
          'delivery-person',
        )}
    </>
  );
};

export default Markers;

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
  },
});
