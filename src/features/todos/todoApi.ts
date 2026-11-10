import { Todo } from "./todo";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const getApiUrl = () => {
  if (!apiUrl) {
    throw new Error("The todo API URL is not configured.");
  }

  return apiUrl.replace(/\/$/, "");
};

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${getApiUrl()}/api/todos`);

  if (!response.ok) {
    throw new Error(`Could not load todos (${response.status}).`);
  }

  const data: Todo[] = await response.json();
  return data.map((todo) => ({
    _id: todo._id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
  }));
};

export const createTodo = async (title: string): Promise<Todo | null> => {
  try {
    const response = await fetch(`${getApiUrl()}/api/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
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
    const response = await fetch(`${getApiUrl()}/api/todos/${id}`, {
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
    const response = await fetch(`${getApiUrl()}/api/todos/${id}`, {
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
