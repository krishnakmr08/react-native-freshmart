import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { FC } from 'react';

type ReportItemProps = {
  iconName: string;
  title: string;
  price?: number;
};

const ReportItem: FC<ReportItemProps> = ({ iconName, title, price }) => (
  <View style={[styles.flexRowBetween, styles.itemSpacing]}>
    <View style={styles.flexRow}>
      <Icon
        name={iconName}
        style={styles.icon}
        size={RFValue(12)}
        color={Colors.text}
      />
      <CustomText variant="h8" style={styles.titleText}>
        {title}
      </CustomText>
    </View>
    <CustomText variant="h8">₹{price}</CustomText>
  </View>
);

const BillDetails: FC<{ totalItemPrice: number }> = ({ totalItemPrice }) => {
  return (
    <View style={styles.container}>
      <CustomText
        style={styles.headerText}
        fontFamily={Fonts.SemiBold}
        fontSize={RFValue(10)}
      >
        Bill Details
      </CustomText>

      <View style={styles.billContainer}>
        <ReportItem
          iconName="article"
          title="Items total "
          price={totalItemPrice}
        />
        <ReportItem iconName="pedal-bike" title="Delivery charge" price={29} />
        <ReportItem iconName="shopping-bag" title="Handling charge" price={2} />
        <ReportItem iconName="cloudy-snowing" title="Surge charge" price={3} />
      </View>

      <View style={[styles.flexRowBetween, styles.grandTotalRow]}>
        <CustomText
          variant="h7"
          style={styles.headerText}
          fontFamily={Fonts.SemiBold}
        >
          Grand Total
        </CustomText>
        <CustomText style={styles.headerText} fontFamily={Fonts.SemiBold}>
          ₹{totalItemPrice + 34}
        </CustomText>
      </View>
    </View>
  );
};

export default BillDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 15,
  },
  headerText: {
    marginHorizontal: 10,
    marginTop: 15,
  },
  billContainer: {
    padding: 10,
    paddingBottom: 0,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.7,
  },
  flexRowBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    opacity: 0.7,
    marginRight: 5,
  },
  titleText: {
    color: Colors.text,
  },
  itemSpacing: {
    marginBottom: 10,
  },
  grandTotalRow: {
    marginBottom: 15,
  },
});
