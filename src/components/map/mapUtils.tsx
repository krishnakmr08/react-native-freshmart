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
  if (!mapRef || !deliveryLocation || !pickupLocation) return;

  const start =
    hasAccepted && deliveryPersonLocation
      ? deliveryPersonLocation
      : deliveryLocation;

  const end =
    hasPickedUp && deliveryPersonLocation
      ? deliveryPersonLocation
      : pickupLocation;

  const coordinates: LatLng[] = [start, end];

  mapRef.fitToCoordinates(coordinates, {
    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    animated: true,
  });
};