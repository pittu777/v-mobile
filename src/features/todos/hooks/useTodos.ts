import { useCallback, useEffect, useState } from "react";
import useTodoStore from "../store/todoStore";
import { createTodo, getTodos, removeTodo, updateTodoStatus } from "../todoApi";

const useTodos = () => {
  const todos = useTodoStore((state) => state.todos);
  const setAllTodos = useTodoStore((state) => state.setAllTodos);
  const addTodoLocally = useTodoStore((state) => state.addTodo);
  const deleteTodoLocally = useTodoStore((state) => state.deleteTodo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggleTodoLocally = useTodoStore((state) => state.toggleTodo);

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getTodos();
      setAllTodos(data);
    } catch (error) {
      console.error(error);
      setError("Could not load your todos. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [setAllTodos]);

  const handleAddTodo = async (title: string): Promise<boolean> => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || saving) return false;

    setSaving(true);
    setError(null);
    try {
      const newTodo = await createTodo(trimmedTitle);
      if (!newTodo) throw new Error("Could not add this todo.");
      addTodoLocally(newTodo);
      return true;
    } catch (error) {
      console.error(error);
      setError("Could not add this todo. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setError(null);
    const success = await removeTodo(id);
    if (success) {
      deleteTodoLocally(id);
    } else {
      setError("Could not delete this todo. Please try again.");
    }
  };

  const handleToggle = async (id: string) => {
    const todoToToggle = todos.find((item) => item._id === id);
    if (!todoToToggle) return;
    const nextCompletedState = !todoToToggle.completed;
    setError(null);
    const updatedTodo = await updateTodoStatus(id, nextCompletedState);
    if (updatedTodo) {
      toggleTodoLocally(id, updatedTodo);
    } else {
      setError("Could not update this todo. Please try again.");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => void fetchTodos(), 0);
    return () => clearTimeout(timeout);
  }, [fetchTodos]);

  return {
    todos,
    loading,
    saving,
    error,
    clearError: () => setError(null),
    addTodo: handleAddTodo,
    deleteTodo: handleDeleteTodo,
    refetch: fetchTodos,
    handleToggle,
  };
};

export default useTodos;
