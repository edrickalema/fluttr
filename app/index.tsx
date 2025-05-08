import AnimatedButton from "@/components/main/button";
import { globalStyles } from "@/constants/globalStyles";
import { Link } from "expo-router";
import { Text, TextStyle, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={globalStyles.text as TextStyle}>
        Your crush is waiting for you!
      </Text>
      <Link href={"/(tabs)"} asChild>
        <AnimatedButton title='Get Started' />
      </Link>
    </View>
  );
}
