import type MapView from 'react-native-maps';
import type { LatLng } from 'react-native-maps';

export const handleFitToPath = (
  mapRef: MapView | null,
  deliveryLocation?: LatLng | null,
  pickupLocation?: LatLng | null,
  hasAccepted?: boolean,
  hasPickedUp?: boolean,
  deliveryPersonLocation?: LatLng | null,
) => {
  if (!mapRef || !deliveryLocation || !pickupLocation) {
    return;
  }

  let coordinates: LatLng[];

  if (hasPickedUp && deliveryPersonLocation) {
    // Order picked up:
    // Delivery person → Customer
    coordinates = [deliveryPersonLocation, deliveryLocation];
  } else if (hasAccepted && deliveryPersonLocation) {
    // Order accepted:
    // Delivery person → Pickup
    coordinates = [deliveryPersonLocation, pickupLocation];
  } else {
    // Order not accepted:
    // Pickup → Customer
    coordinates = [pickupLocation, deliveryLocation];
  }

  mapRef.fitToCoordinates(coordinates, {
    edgePadding: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
    animated: true,
  });
};
