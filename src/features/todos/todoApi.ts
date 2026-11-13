import { Todo } from "./todo";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const getApiUrl = () => {
  if (!apiUrl) {
    throw new Error("The todo API URL is not configured.");
  }

  return apiUrl.replace(/\/$/, "");
};

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const { headers, ...requestOptions } = options;
  const response = await fetch(`${getApiUrl()}/api/${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
  const envelope = (await response.json().catch(() => ({}))) as Partial<
    ApiEnvelope<T>
  >;

  if (!response.ok || envelope.success === false) {
    throw new Error(envelope.message || `Request failed (${response.status}).`);
  }

  if (envelope.success !== true || !("data" in envelope)) {
    throw new Error("The server returned an unexpected response.");
  }

  return envelope.data as T;
};

export const getTodos = async (): Promise<Todo[]> => {
  const todos = await request<Todo[]>("todos");
  return todos.map((todo) => ({
    _id: todo._id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
  }));
};

export const createTodo = async (title: string): Promise<Todo | null> => {
  try {
    return await request<Todo>("todos", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  } catch (error) {
    console.error("API error adding todo:", error);
    return null;
  }
};
export const removeTodo = async (id: string): Promise<boolean> => {
  try {
    await request<null>(`todos/${id}`, { method: "DELETE" });
    return true;
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
    return await request<Todo>(`todos/${id}`, {
      method: "PUT", // or "PATCH" depending on your Express routing
      body: JSON.stringify({ completed }),
    });
  } catch (error) {
    console.error("API error toggling todo:", error);
    return null;
  }
};
