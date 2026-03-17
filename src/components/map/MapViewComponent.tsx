import React from 'react';
import MapView, { Polyline, LatLng } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { customMapStyle } from '@utils/CustomMap';
import { getPoints } from '@utils/getPoints';
import { Colors } from '@utils/Constants';
import { GOOGLE_MAP_API } from '@service/config';
import Markers from './Markers';

type MapViewComponentProps = {
  setMapRef: (ref: MapView | null) => void;
  deliveryLocation?: LatLng | null;
  pickupLocation?: LatLng | null;
  deliveryPersonLocation?: LatLng | null;
  hasAccepted: boolean;
  hasPickedUp: boolean;
  camera?: any;
};

const MapViewComponent = ({
  setMapRef,
  deliveryLocation,
  pickupLocation,
  deliveryPersonLocation,
  hasAccepted,
  hasPickedUp,
  camera,
}: MapViewComponentProps) => {
  const destination = hasPickedUp ? deliveryLocation : pickupLocation;

  const shouldShowRoute =
    !!deliveryPersonLocation && !!destination && (hasAccepted || hasPickedUp);

  return (
    <MapView
      ref={setMapRef}
      style={{ flex: 1 }}
      provider="google"
      customMapStyle={customMapStyle}
      showsUserLocation={true}
      followsUserLocation={true}
      showsCompass={true}
      userLocationCalloutEnabled={true}
      userLocationPriority="high"
      showsScale={false}
      camera={camera}
      showsIndoorLevelPicker={false}
      pitchEnabled={false}
      showsTraffic={false}
      showsBuildings={false}
      showsIndoors={false}
    >
      {shouldShowRoute && (
        <MapViewDirections
          origin={deliveryPersonLocation}
          destination={destination}
          apikey={GOOGLE_MAP_API}
          strokeColor="#2871F2"
          strokeWidth={5}
          precision="high"
          onError={err => console.log('Directions error:', err)}
        />
      )}

      <Markers
        pickupLocation={pickupLocation}
        deliveryLocation={deliveryLocation}
        deliveryPersonLocation={deliveryPersonLocation}
      />

      {!hasPickedUp && deliveryLocation && pickupLocation && (
        <Polyline
          coordinates={getPoints([pickupLocation, deliveryLocation])}
          strokeColor={Colors.text}
          strokeWidth={2}
          geodesic={true}
          lineDashPattern={[12, 10]}
        />
      )}
    </MapView>
  );
};

export default React.memo(MapViewComponent);
