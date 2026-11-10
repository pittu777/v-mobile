import { Button } from "@/components/ui/button";
import { Input as InputShadeCn } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { View } from "react-native";
import useTodos from "../hooks/useTodos";

const Input = () => {
  const [text, setText] = useState("");
  const { addTodo } = useTodos();
  return (
    // 🚀 Cleaned up to explicitly supported core colors
    <View className="flex justify-start px-6">
      <View className="mt-2">
        <Text className="text-center text-2xl font-bold text-foreground">
          Welcome Todo app
        </Text>
      </View>

      <View className="flex-row mt-2 items-center gap-3">
        <View className="flex-1">
          <InputShadeCn
            placeholder="Enter Todo"
            value={text}
            onChangeText={setText}
          />
        </View>

        <View className="w-36">
          <Button
            variant="default"
            className="px-0"
            onPress={() => addTodo(text)}
          >
            <Text className="text-primary-foreground font-medium">
              Add todo
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Input;
