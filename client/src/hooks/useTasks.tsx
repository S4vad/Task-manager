import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import type { Task, TaskFormData } from "../types";

interface Filters {
  search: string;
  status: string;
  priority: string;
  page: number;
}

export const useTasks = (filters: Filters) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 6,
        search: filters.search || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
      };

      const res = await axios.get("/api/tasks", { params });
      setTasks(res.data.tasks);
      setTotalPages(res.data.pagination.pages);
    } catch (error: unknown) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: TaskFormData): Promise<boolean> => {
    try {
      await axios.post("/api/tasks", data);
      toast.success("Task created");
      fetchTasks();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create task");
      return false;
    }
  };

  const updateTask = async (
    id: string,
    data: TaskFormData
  ): Promise<boolean> => {
    try {
      await axios.put(`/api/tasks/${id}`, data);
      toast.success("Task updated");
      fetchTasks();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update task");
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      toast.success("Task deleted");
      fetchTasks();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete task");
      return false;
    }
  };

  const updateStatus = async (
    id: string,
    status: Task["status"]
  ): Promise<boolean> => {
    try {
      await axios.put(`/api/tasks/${id}`, { status });
      toast.success("Status updated");
      fetchTasks();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters.search, filters.status, filters.priority, filters.page]);

  return {
    tasks,
    loading,
    totalPages,
    createTask,
    updateTask,
    deleteTask,
    updateStatus,
  };
};
