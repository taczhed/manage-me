'use client';

import { useState } from 'react';
import { Task, Story, User, TaskStatus } from '../../actions/types';
import { getTasks, createTask, updateTask, removeTask } from '../../actions/tasks';
import { STATUS_CONFIG } from '../../utils/config';
import { PencilIcon, TrashIcon } from '../UI/Icons';
import TaskModal, { TaskFormData } from './TaskModal';

type Props = {
  story: Story;
  user: User;
};

const COLUMNS: { status: TaskStatus; label: string; dot: string; accent: string }[] = [
  { status: 'todo', label: 'Todo', dot: 'bg-amber-400', accent: 'border-amber-400/20' },
  { status: 'doing', label: 'Doing', dot: 'bg-blue-400', accent: 'border-blue-400/20' },
  { status: 'done', label: 'Done', dot: 'bg-emerald-400', accent: 'border-emerald-400/20' },
];

const TaskBoard = ({ story, user }: Props) => {
  const [tasks, setTasks] = useState(() => getTasks(story.id));
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  const refresh = () => setTasks(getTasks(story.id));

  const handleSave = (data: TaskFormData, id?: string) => {
    if (id) updateTask(id, data);
    else createTask({ ...data, storyId: story.id });

    refresh();
    setShowModal(false);
    setEditTask(null);
  };

  const handleDelete = (id: string) => {
    removeTask(id);
    refresh();
  };

  const openCreate = (status: TaskStatus) => {
    setDefaultStatus(status);
    setEditTask(null);
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setShowModal(true);
  };

  return (
    <>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-foreground text-xl font-bold tracking-tight">{story.name}</h2>
          {story.description && <p className="text-foreground-hover mt-1 text-sm">{story.description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLUMNS.map(({ status, label, dot, accent }) => {
            const col = tasks.filter((t) => t.status === status);
            const statusCfg = STATUS_CONFIG[status];
            return (
              <div key={status} className={`rounded-2xl border ${accent} bg-white/[0.02] p-3`}>
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                    <span className="text-foreground text-sm font-semibold">{label}</span>
                    <span className="bg-secondary text-foreground-hover rounded-full px-1.5 py-0.5 text-[11px]">
                      {col.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openCreate(status)}
                    className="text-foreground-hover hover:text-foreground rounded-lg p-1 text-lg leading-none transition-colors hover:bg-white/10"
                    title={`Add ${label} task`}
                  >
                    +
                  </button>
                </div>

                <div className="space-y-2">
                  {col.map((task) => (
                    <div
                      key={task.id}
                      className="bg-secondary group relative rounded-xl border border-white/8 p-3.5 transition-all hover:border-white/15"
                    >
                      <div className="mb-1.5 flex items-start justify-between gap-2">
                        <span className="text-foreground text-sm leading-snug font-medium">{task.title}</span>
                        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => openEdit(task)}
                            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="rounded-lg p-1.5 text-red-400/50 transition-colors hover:bg-red-400/10 hover:text-red-400"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-foreground-hover line-clamp-2 text-xs leading-relaxed">{task.description}</p>
                      )}
                      <div className="mt-2">
                        <span
                          className={`flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${statusCfg.bg} ${statusCfg.color}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>
                  ))}
                  {col.length === 0 && (
                    <div
                      onClick={() => openCreate(status)}
                      className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/8 py-6 text-xs text-white/25 transition-colors hover:border-white/20 hover:text-white/40"
                    >
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={editTask}
          defaultStatus={defaultStatus}
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default TaskBoard;
