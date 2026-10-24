import React, { FC } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { Carousel } from 'react-native-reanimated-carousel';
import { screenWidth } from '@utils/Scaling';
import ScalePress from '@components/ui/ScalePress';

interface AdCarouselProps {
  adData: ImageSourcePropType[];
}

const AdCarousel: FC<AdCarouselProps> = ({ adData }) => {
  if (adData.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Carousel
        style={styles.carousel}
        data={adData}
        loop
        autoplay
        autoplayInterval={2500}
        snapMode="page"
        layout={{
          type: 'parallax',
          offset: 0,
          scale: 0.94,
        }}
        renderItem={({ item }) => (
          <ScalePress style={styles.imageContainer}>
            <Image source={item} style={styles.img} resizeMode="cover" />
          </ScalePress>
        )}
      />
    </View>
  );
};

export default AdCarousel;

const styles = StyleSheet.create({
  container: {
    left: -20,
    marginVertical: 20,
  },
  carousel: {
    width: screenWidth,
    height: screenWidth * 0.5,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});
