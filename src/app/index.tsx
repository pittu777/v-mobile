import Input from "@/features/todos/components/Input";
import TodoList from "@/features/todos/components/TodoList";
import useTodos from "@/features/todos/hooks/useTodos";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

const App = () => {
  const { todos, handleToggle, deleteTodo, addTodo, saving, loading, error, refetch } = useTodos();
  return (
    <View className="flex-1 pt-12">
      <Input onAddTodo={addTodo} saving={saving} />
      {error ? (
        <View className="mx-6 mt-3 flex-row items-center justify-between">
          <Text className="mr-3 flex-1 text-destructive">{error}</Text>
          {!todos.length && !loading ? (
            <Text accessibilityRole="button" onPress={() => void refetch()}>
              Retry
            </Text>
          ) : null}
        </View>
      ) : null}
      <TodoList
        todos={todos}
        onToggleTodo={handleToggle}
        onDeleteTodo={deleteTodo}
        loading={loading}
      />
    </View>
  );
};

export default App;
