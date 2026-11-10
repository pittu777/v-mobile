import { Todo } from "./todo";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await fetch(`${apiUrl}/api/todos`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((todo: any) => ({
      _id: todo._id,
      name: todo.name,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    }));
  } catch (error) {
    console.error("Connection failed:", error);
    return [];
  }
};

export const createTodo = async (name: string): Promise<Todo | null> => {
  try {
    const response = await fetch(`${apiUrl}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error("Failed to create todo");
    return await response.json(); // Returns the created todo with its MongoDB _id
  } catch (error) {
    console.error("API error adding todo:", error);
    return null;
  }
};
export const removeTodo = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${apiUrl}/api/todos/${id}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.error("API error deleting todo:", error);
    return false;
  }
};

// Update an existing todo's completion status
export const updateTodoStatus = async (
  id: string,
  completed: boolean,
): Promise<Todo | null> => {
  try {
    const response = await fetch(`${apiUrl}/api/todos/${id}`, {
      method: "PUT", // or "PATCH" depending on your Express routing
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) throw new Error("Failed to update status");
    return await response.json(); // Returns the updated todo object from MongoDB
  } catch (error) {
    console.error("API error toggling todo:", error);
    return null;
  }
};
