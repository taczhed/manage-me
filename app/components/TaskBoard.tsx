'use client';

import { useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, removeTask } from '../actions/tasks';
import { Task, CreateTaskInput, UpdateTaskInput } from '../actions/types';
import Navbar from './Navbar';
import TasksPanel from './TasksPanel';
import TaskModal, { TaskFormData } from './TaskModal';
import DeleteConfirm from './DeleteConfirm';

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = useCallback(() => setTasks(getTasks()), []);

  const handleSave = (data: TaskFormData, id?: string) => {
    if (id) {
      updateTask(id, data as UpdateTaskInput);
    } else {
      createTask(data as CreateTaskInput);
    }
    refresh();
    setShowModal(false);
    setEditTask(null);
  };

  const handleDelete = (id: string) => {
    removeTask(id);
    refresh();
    setDeleteId(null);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setShowModal(true);
  };
  const openCreate = () => {
    setEditTask(null);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditTask(null);
  };

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/[0.08] absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar onNewTask={openCreate} />
        <main className="mx-auto max-w-2xl p-4 sm:p-6">
          <TasksPanel tasks={tasks} onEdit={openEdit} onDelete={setDeleteId} />
        </main>
      </div>

      {showModal && <TaskModal task={editTask} onClose={closeModal} onSave={handleSave} />}
      {deleteId && <DeleteConfirm onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} />}
    </div>
  );
};

export default TaskBoard;
