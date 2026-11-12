import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import Input from "@/features/todos/components/Input";
import TodoList from "@/features/todos/components/TodoList";
import useTodos from "@/features/todos/hooks/useTodos";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TodoScreen = () => {
  const {
    todos,
    handleToggle,
    deleteTodo,
    addTodo,
    saving,
    loading,
    error,
    refetch,
  } = useTodos();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="w-full max-w-[512px] flex-1 self-center">
          <Input onAddTodo={addTodo} saving={saving} />
          {error ? (
            <View className="mx-4 mt-4 flex-row items-center justify-between gap-3 rounded-md bg-destructive/10 p-3">
              <Text className="flex-1 text-body text-destructive">{error}</Text>
              {!todos.length && !loading ? (
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => void refetch()}
                  accessibilityLabel="Retry loading tasks"
                >
                  <Text>Retry</Text>
                </Button>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TodoScreen;
