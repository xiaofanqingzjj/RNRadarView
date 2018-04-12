import { Dimensions,PixelRatio, Platform} from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const scale = size => (Platform.OS === 'android') ? size : (width / guidelineBaseWidth * size);
const verticalScale = size => (Platform.OS === 'android') ? size : (height / guidelineBaseHeight * size);
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

const px = size =>  (1/PixelRatio.get())  * size;

export {scale, verticalScale, moderateScale,px};
