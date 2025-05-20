// src/pages/TasksUncompleted.jsx
import React, { useState } from 'react';
import { useTasks, useDeleteTask } from '../hooks/tasks';
import { useAuth } from '../../hooks/auth';

const TasksUncompleted = () => {
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useTasks(user?.id);
  const deleteMutation = useDeleteTask();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleFilter = (e) => setFilterPriority(e.target.value);
  const handleDelete = (id) => deleteMutation.mutate(id);

  const filteredTasks = tasks
    .filter(task => task.status !== 'Completed')
    .filter(task => task.task_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(task => filterPriority === 'All' || task.priority === filterPriority);

  if (isLoading || !user) return <div className="container mx-auto p-4">Đang tải...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Chưa Hoàn Thành</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm task..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 mr-2 w-full rounded"
        />
        <select
          value={filterPriority}
          onChange={handleFilter}
          className="border p-2 rounded"
        >
          <option value="All">Tất cả</option>
          <option value="High">Cao</option>
          <option value="Medium">Trung bình</option>
          <option value="Low">Thấp</option>
        </select>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tiêu đề</th>
            <th className="border p-2">Độ ưu tiên</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <tr key={task.id}>
              <td className="border p-2">{task.task_name}</td>
              <td className="border p-2">{task.priority}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksUncompleted;