import { useEffect, useState } from "react";
import useTodoStore from "../store/todoStore";
import { createTodo, getTodos, removeTodo, updateTodoStatus } from "../todoApi";

const useTodos = () => {
  const todos = useTodoStore((state) => state.todos);
  const setAllTodos = useTodoStore((state) => state.setAllTodos);
  const addTodoLocally = useTodoStore((state) => state.addTodo);
  const deleteTodoLocally = useTodoStore((state) => state.deleteTodo);
  const [loading, setLoading] = useState(false);
  const toggleTodoLocally = useTodoStore((state) => state.toggleTodo);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setLoading(false);

      if (data && data.length > 0) {
        setAllTodos(data);
      } else {
        setAllTodos([]);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  // Action: Add Todo
  const handleAddTodo = async (name: string) => {
    if (!name.trim()) return;

    const newTodo = await createTodo(name);
    if (newTodo) {
      addTodoLocally(newTodo); // Syncs Zustand UI state
    }
  };

  // Action: Delete Todo
  const handleDeleteTodo = async (id: string) => {
    const success = await removeTodo(id);
    if (success) {
      deleteTodoLocally(id); // Syncs Zustand UI state
    }
  };

  const handleToggle = async (id: string) => {
    // 1. Find the todo in your current local state to check its status
    const todoToToggle = todos.find((item) => item._id === id);
    if (!todoToToggle) return;

    // 2. Determine the new completion state (flip the current boolean)
    const nextCompletedState = !todoToToggle.completed;

    // 3. Send update to your Render backend
    const updatedTodo = await updateTodoStatus(id, nextCompletedState);

    // 4. If the database update succeeded, update the Zustand UI store
    if (updatedTodo) {
      toggleTodoLocally(id, updatedTodo);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    addTodo: handleAddTodo,
    deleteTodo: handleDeleteTodo,
    refetch: fetchTodos,
    handleToggle,
  };
};

export default useTodos;
