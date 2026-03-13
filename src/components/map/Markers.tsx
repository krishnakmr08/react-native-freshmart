import React from 'react';
import { StyleSheet } from 'react-native';
import { Marker, LatLng } from 'react-native-maps';

type MarkersProps = {
  deliveryLocation?: LatLng | null;
  pickupLocation?: LatLng | null;
  deliveryPersonLocation?: LatLng | null;
};

const Markers = ({
  deliveryLocation,
  pickupLocation,
  deliveryPersonLocation,
}: MarkersProps) => {
  return (
    <>
      {deliveryLocation && (
        <Marker
          coordinate={deliveryLocation}
          image={require('@assets/icons/my_pin.png')}
          style={styles.marker}
        />
      )}

      {pickupLocation && (
        <Marker
          coordinate={pickupLocation}
          image={require('@assets/icons/store.png')}
          style={styles.marker}
        />
      )}

      {deliveryPersonLocation && (
        <Marker
          coordinate={deliveryPersonLocation}
          image={require('@assets/icons/delivery.png')}
          style={styles.delivery}
        />
      )}
    </>
  );
};

export default Markers;

const styles = StyleSheet.create({
  marker: {
    width: 20,
    height: 20,
  },
  delivery: {
    position: 'absolute',
    zIndex: 99,
    width: 20,
    height: 20,
  },
});
