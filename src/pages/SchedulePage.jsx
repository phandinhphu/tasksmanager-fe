// src/pages/SchedulePage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSchedules, updateSchedule, deleteSchedule } from '../services/api';
import { useAuth } from '../contexts/Auth/AuthProvider';

const SchedulePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', days: [], startTime: '', endTime: '', repeat: '' });

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['schedules', user?.id],
    queryFn: () => getSchedules(user?.id),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => queryClient.invalidateQueries(['schedules']),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules']);
      setEditId(null);
    },
  });

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleDelete = (id) => deleteMutation.mutate(id);
  const handleEdit = (schedule) => {
    setEditId(schedule.id);
    setEditForm(schedule);
  };
  const handleSave = () => updateMutation.mutate({ id: editId, data: { ...editForm, userid: user.id } });

  const filteredSchedules = schedules.filter(schedule =>
    schedule.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || !user) return <div className="container mx-auto p-4">Đang tải...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lịch Học</h1>
      <input
        type="text"
        placeholder="Tìm kiếm lịch học..."
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 mb-4 w-full rounded"
      />
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tiêu đề</th>
            <th className="border p-2">Ngày</th>
            <th className="border p-2">Thời gian</th>
            <th className="border p-2">Lặp lại</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchedules.map(schedule => (
            <tr key={schedule.id}>
              {editId === schedule.id ? (
                <>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={editForm.days.join(', ')}
                      onChange={(e) => setEditForm({ ...editForm, days: e.target.value.split(', ') })}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={editForm.startTime}
                      onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                      className="border p-1 w-full mr-1"
                    />
                    <input
                      type="text"
                      value={editForm.endTime}
                      onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={editForm.repeat}
                      onChange={(e) => setEditForm({ ...editForm, repeat: e.target.value })}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Hủy
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2">{schedule.title}</td>
                  <td className="border p-2">{schedule.days.join(', ')}</td>
                  <td className="border p-2">{`${schedule.startTime} - ${schedule.endTime}`}</td>
                  <td className="border p-2">{schedule.repeat}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulePage;