import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';

const deviceHeightIncludingStatusBarNavigationBar = Dimensions.get('screen').height;
const deviceWidthIncludingStatusBarNavigationBar = Dimensions.get('screen').width;

const deviceHeightExcludingStatusBarNavigationBar = Dimensions.get('window').height;
const deviceWidthExcludingStatusBarNavigationBar = Dimensions.get('window').width;

const wp = (percentage: number) => widthPercentageToDP(percentage);
const hp = (percentage: number) => heightPercentageToDP(percentage);

export {
  deviceHeightExcludingStatusBarNavigationBar as WindowHeight,
  deviceWidthExcludingStatusBarNavigationBar as WindowWidth,
  deviceHeightIncludingStatusBarNavigationBar as deviceHeight,
  deviceWidthIncludingStatusBarNavigationBar as deviceWidth,
  wp,
  hp,
};
