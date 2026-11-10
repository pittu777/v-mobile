import Input from "@/features/todos/components/Input";
import TodoList from "@/features/todos/components/TodoList";
import useTodos from "@/features/todos/hooks/useTodos";

const App = () => {
  const { todos, handleToggle, deleteTodo } = useTodos();
  return (
    <>
      <Input />
      <TodoList
        todos={todos}
        onToggleTodo={handleToggle}
        onDeleteTodo={deleteTodo}
      />
    </>
  );
};

export default App;
