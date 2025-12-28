export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskFormData = Pick<
  Task,
  "title" | "description" | "status" | "priority"
>;
