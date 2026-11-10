import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Todo } from "../todo";

type Props = {
  todos: Todo[];
  loading: boolean;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
};

const TodoList = ({ todos, loading, onToggleTodo, onDeleteTodo }: Props) => {
  return (
    <FlatList
      data={todos}
      className="mt-4 w-full flex-1 px-6"
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <View className="items-center py-8">
          {loading ? (
            <ActivityIndicator accessibilityLabel="Loading todos" />
          ) : (
            <Text className="text-muted-foreground">No todos yet. Add one above.</Text>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <View className="flex flex-row items-center justify-between w-full p-3 mb-3 border border-gray-200 rounded-lg bg-white shadow-sm">
          <View className="flex flex-row items-center gap-3 flex-1">
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => onToggleTodo(item._id)}
              accessibilityLabel={`Mark ${item.title} ${item.completed ? "incomplete" : "complete"}`}
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
            onPress={() => onDeleteTodo(item._id)}
            accessibilityLabel={`Delete ${item.title}`}
          >
            <Text className="text-white text-xs font-semibold">Delete</Text>
          </Button>
        </View>
      )}
    />
  );
};

export default TodoList;
