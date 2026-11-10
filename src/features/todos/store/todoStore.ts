import { create } from "zustand";
import { Todo } from "../todo"; // Ensure this matches your Todo interface path

type TodoStore = {
  todos: Todo[];
  setAllTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  deleteTodo: (todoId: string) => void;
  toggleTodo: (todoId: string, updatedTodo: Todo) => void; // Add this action line
};

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],

  // Set the entire list when fetched from the backend
  setAllTodos: (todos) => set({ todos }),

  // Add a new todo object locally
  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, todo],
    })),

  // Filter out a deleted todo by its unique ID
  deleteTodo: (todoId) =>
    set((state) => ({
      todos: state.todos.filter((item) => item._id !== todoId),
    })),
  toggleTodo: (todoId, updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((item) =>
        item._id === todoId ? updatedTodo : item,
      ),
    })),
}));

export default useTodoStore;
