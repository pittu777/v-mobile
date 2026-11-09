import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

const App = () => {
  return (
    <View>
      Hello
      <Link href={"/home"}>
        <Pressable>
          <Text>Home page</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default App;
