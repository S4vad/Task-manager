import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Button from "../components/Button";
import TaskCard from "../components/TaskCard";
import DashboardHeader from "../components/DashboardHeader";
import TaskModal from "../components/TaskModel";
import { useTasks } from "../hooks/useTasks";
import type { Task, TaskFormData } from "../types";

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    page: 1,
  });

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const initialFormState: TaskFormData = {
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
  };

  const [formData, setFormData] = useState<TaskFormData>(initialFormState);

  const {
    tasks,
    loading,
    totalPages,
    createTask,
    updateTask,
    deleteTask,
    updateStatus,
  } = useTasks(filters);

  const resetForm = () => setFormData(initialFormState);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    const { title, description, status, priority } = task;
    setFormData({ title, description, status, priority });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = editingTask
      ? await updateTask(editingTask._id, formData)
      : await createTask(formData);

    if (success) {
      setShowModal(false);
      setEditingTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* section for filters and create button */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value, page: 1 })
                }
              />
            </div>

            <select
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value, page: 1 })
              }
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <Button
              onClick={() => {
                resetForm();
                setEditingTask(null);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Create Task
            </Button>
          </div>
        </div>
        
        {/* section for displaying tasks */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500 text-lg">
              No tasks found. Create your first task!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={deleteTask}
                onStatusChange={updateStatus}
              />
            ))}
          </div>
        )}
         
         {/* section for pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="secondary"
              disabled={filters.page === 1}
              onClick={() =>
                setFilters({ ...filters, page: filters.page - 1 })
              }
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-gray-700">
              Page {filters.page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={filters.page === totalPages}
              onClick={() =>
                setFilters({ ...filters, page: filters.page + 1 })
              }
            >
              Next
            </Button>
          </div>
        )}
      </main>
      

      {/* section for task modal */}
      <TaskModal
        isOpen={showModal}
        editingTask={editingTask}
        formData={formData}
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Dashboard;
