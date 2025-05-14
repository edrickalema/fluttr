import { normalize } from "@/utils/responsive";

export const Fonts = {
  heading: {
    fontFamily: "Poppins_700Bold",
    fontSize: normalize(34),
    lineHeight: normalize(34),
  },
  subheading: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: normalize(24),
    lineHeight: 29,
  },
  body: {
    fontFamily: "Poppins_400Regular",
    fontSize: normalize(16),
    lineHeight: 24,
  },
  button: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: normalize(18),
    lineHeight: 22,
  },
  small: {
    fontFamily: "Poppins_400Regular",
    fontSize: normalize(14),
    lineHeight: 21,
  },
};
