import { Dimensions, PixelRatio, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
export const screenWidth = Math.min(width, height);
export const screenHeight = Math.max(width, height);

const scale = screenWidth / 375;

// Function to make values responsive based on screen size
export const normalize = (size: any, factor = 0.5) => {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};


// [ADB] Couldn't reverse port 8081: adb.exe: device still authorizing