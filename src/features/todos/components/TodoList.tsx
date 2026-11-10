import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { FlatList, View } from "react-native";
import { Todo } from "../todo";

type Props = {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
};

const TodoList = ({ todos, onToggleTodo, onDeleteTodo }: Props) => {
  return (
    <FlatList
      data={todos}
      className="w-full px-6 mt-4"
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <View>
          <Text>No data</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View className="flex flex-row items-center justify-between w-full p-3 mb-3 border border-gray-200 rounded-lg bg-white shadow-sm">
          <View className="flex flex-row items-center gap-3 flex-1">
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => onToggleTodo && onToggleTodo(item._id)}
            />
            <Text
              className={`text-base ${item.completed ? "line-through text-gray-400" : "text-black"}`}
            >
              {item.title}
            </Text>
          </View>

          <Button
            variant="destructive"
            size="sm"
            onPress={() => onDeleteTodo && onDeleteTodo(item._id)}
          >
            <Text className="text-white text-xs font-semibold">Delete</Text>
          </Button>
        </View>
      )}
    />
  );
};

export default TodoList;
