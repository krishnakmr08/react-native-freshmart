import React, { FC, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { LatLng } from 'react-native-maps';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { screenHeight } from '@utils/Scaling';
import { Colors } from '@utils/Constants';
import { useMapRefStore } from '@state/mapStore';
import MapViewComponent from '@components/map/MapViewComponent';
import { handleFitToPath } from '@components/map/mapUtils';

interface LiveMapProps {
  deliveryPersonLocation?: LatLng | null;
  pickupLocation?: LatLng | null;
  deliveryLocation?: LatLng | null;
  hasPickedUp: boolean;
  hasAccepted: boolean;
}

const LiveMap: FC<LiveMapProps> = ({
  deliveryLocation,
  deliveryPersonLocation,
  pickupLocation,
  hasAccepted,
  hasPickedUp,
}) => {
  const mapRef = useMapRefStore(state => state.mapRef);
  const setMapRef = useMapRefStore(state => state.setMapRef);

  const fitMap = useCallback(() => {
    if (!mapRef) return;

    handleFitToPath(
      mapRef,
      deliveryLocation,
      pickupLocation,
      hasAccepted,
      hasPickedUp,
      deliveryPersonLocation,
    );
  }, [
    mapRef,
    deliveryLocation,
    pickupLocation,
    hasAccepted,
    hasPickedUp,
    deliveryPersonLocation,
  ]);

  useEffect(() => {
    if (!mapRef) return;

    fitMap();
  }, [mapRef, fitMap]);

  return (
    <View style={styles.container}>
      <MapViewComponent
        setMapRef={setMapRef}
        deliveryLocation={deliveryLocation}
        pickupLocation={pickupLocation}
        deliveryPersonLocation={deliveryPersonLocation}
        hasAccepted={hasAccepted}
        hasPickedUp={hasPickedUp}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.fitButton}
        onPress={fitMap}
      >
        <Icon
          name="target"
          size={RFValue(14)}
          color={Colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(LiveMap);

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.35,
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },

  fitButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 6,
    backgroundColor: '#fff',
    borderWidth: 0.8,
    borderColor: Colors.border,
    elevation: 5,
    borderRadius: 35,
  },
});