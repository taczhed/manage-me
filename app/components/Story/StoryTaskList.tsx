'use client';

import { useState } from 'react';
import { Task } from '../../actions/types';
import { getTasks, createTask, updateTask, removeTask } from '../../actions/tasks';
import { PencilIcon, TrashIcon, TaskCheckIcon } from '../UI/Icons';
import TaskModal, { TaskFormData } from '../Task/TaskModal';
import { STATUS_CONFIG } from '../../utils/config';

type Props = {
  storyId: string;
};

const StoryTaskList = ({ storyId }: Props) => {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks(storyId));
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const refresh = () => setTasks(getTasks(storyId));

  const handleToggle = (task: Task) => {
    updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
    refresh();
  };

  const handleSave = (data: TaskFormData, id?: string) => {
    if (id) {
      updateTask(id, data);
    } else {
      createTask({ title: data.title, description: data.description, status: data.status, storyId });
    }
    refresh();
    setModalOpen(false);
  };

  const handleRemove = (id: string) => {
    removeTask(id);
    refresh();
  };

  const done = tasks.filter((t) => t.status === 'done').length;
  const total = tasks.length;

  return (
    <div className="mt-2.5 border-t border-white/6 pt-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-white/35">
          {total === 0 ? 'Tasks' : `${done}/${total} tasks`}
        </span>
        {total > 0 && (
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-emerald-400/60 transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="mt-2 space-y-1">
        {tasks.map((task) => (
          <div key={task.id} className="group flex items-center gap-2">
            <button
              onClick={() => handleToggle(task)}
              className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                task.status === 'done' ? 'border-emerald-400 bg-emerald-400' : 'border-white/20 hover:border-white/40'
              }`}
            >
              {task.status === 'done' && <TaskCheckIcon />}
            </button>
            <span
              className={`flex-1 text-xs leading-relaxed ${
                task.status === 'done' ? 'text-white/25 line-through' : 'text-white/60'
              }`}
            >
              {task.title}
            </span>
            <span
              className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${STATUS_CONFIG[task.status].bg} ${STATUS_CONFIG[task.status].color}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[task.status].dot}`} />
              {STATUS_CONFIG[task.status].label}
            </span>
            <div className="flex items-center gap-0.5 opacity-0 transition-all group-hover:opacity-100">
              <button onClick={() => { setEditTask(task); setModalOpen(true); }} className="text-white/30 hover:text-white/70">
                <PencilIcon />
              </button>
              <button onClick={() => handleRemove(task.id)} className="text-red-400/40 hover:text-red-400">
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => { setEditTask(null); setModalOpen(true); }}
          className="mt-1 flex items-center gap-1 text-xs text-white/25 transition-colors hover:text-white/50"
        >
          <span className="text-sm leading-none">+</span> Add task
        </button>
      </div>

      {modalOpen && <TaskModal task={editTask} onClose={() => setModalOpen(false)} onSave={handleSave} />}
    </div>
  );
};

export default StoryTaskList;
