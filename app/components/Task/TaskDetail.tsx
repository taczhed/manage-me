'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Task, Story, User, TaskPriority } from '../../actions/types';
import { updateTask, removeTask, assignTask, completeTask } from '../../actions/tasks';
import { STATUS_CONFIG, getAvatarColor, getInitials, formatDate } from '../../utils/config';
import { PencilIcon, TrashIcon } from '../UI/Icons';
import TaskModal, { TaskFormData } from './TaskModal';

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  high: { label: 'High', color: 'text-rose-400', bg: 'bg-rose-400/10' },
};

type Props = {
  task: Task;
  story: Story | null;
  users: User[];
  onRefresh: () => void;
  onDelete: () => void;
};

const TaskDetail = ({ task, story, users, onRefresh, onDelete }: Props) => {
  const [showEdit, setShowEdit] = useState(false);

  const statusCfg = STATUS_CONFIG[task.status];
  const priorityCfg = PRIORITY_CONFIG[task.priority];
  const assignee = task.assigneeId ? users.find((u) => u.id === task.assigneeId) : null;
  const assigneeName = assignee ? `${assignee.firstName} ${assignee.lastName}` : null;

  const handleEditSave = (data: TaskFormData, id?: string) => {
    if (!id) return;

    updateTask(id, data);

    if (data.assigneeId) assignTask(id, data.assigneeId);
    else if (data.status === 'done') completeTask(id);

    setShowEdit(false);
    onRefresh();
  };

  const handleDelete = () => {
    removeTask(task.id);
    onDelete();
  };

  return (
    <>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-6">
          <Link
            href={`/stories/${task.storyId}`}
            className="text-foreground-hover hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            Back to story
          </Link>
          <div className="mt-3 flex flex-wrap items-start gap-3">
            <h1 className="text-foreground flex-1 text-2xl font-bold tracking-tight">
              <span className="text-foreground/20 ml1 mr-1 font-light">Task: </span>
              {task.name}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusCfg.bg} ${statusCfg.color}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityCfg.bg} ${priorityCfg.color}`}>
                {priorityCfg.label}
              </span>
              <button
                onClick={() => setShowEdit(true)}
                className="rounded-xl border border-white/6 bg-black/30 p-2 text-white/50 transition-all hover:border-white/10 hover:text-white/80"
                title="Edit task"
              >
                <PencilIcon />
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl border border-white/6 bg-black/30 p-2 text-red-400/50 transition-all hover:border-red-400/20 hover:text-red-400"
                title="Delete task"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {task.description && (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <h3 className="text-foreground-hover mb-2 text-xs font-semibold tracking-wider uppercase">Description</h3>
              <p className="text-foreground text-sm leading-relaxed">{task.description}</p>
            </div>
          )}

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <h3 className="text-foreground-hover mb-3 text-xs font-semibold tracking-wider uppercase">Details</h3>
            <div className="space-y-3">
              {story && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-foreground-hover text-xs">Story</span>
                  <Link
                    href={`/stories/${story.id}`}
                    className="text-primary hover:text-primary-hover text-xs font-medium transition-colors"
                  >
                    {story.name}
                  </Link>
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <span className="text-foreground-hover text-xs">Created</span>
                <span className="text-foreground text-xs">{formatDate(task.createdAt)}</span>
              </div>
              {task.startDate && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-foreground-hover text-xs">Start date</span>
                  <span className="text-foreground text-xs">{formatDate(task.startDate)}</span>
                </div>
              )}
              {task.completionDate && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-foreground-hover text-xs">Completion date</span>
                  <span className="text-foreground text-xs">{formatDate(task.completionDate)}</span>
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <span className="text-foreground-hover text-xs">Estimated time</span>
                <span className="text-foreground text-xs">{task.estimatedTime}h</span>
              </div>
              {task.loggedHours !== undefined && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-foreground-hover text-xs">Logged hours</span>
                  <span className="text-foreground text-xs">{task.loggedHours}h</span>
                </div>
              )}
              {assigneeName && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-foreground-hover text-xs">Assignee</span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white ${getAvatarColor(assigneeName)}`}
                    >
                      {getInitials(assignee!.firstName)}
                    </div>
                    <span className="text-foreground text-xs">{assigneeName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEdit && <TaskModal task={task} onClose={() => setShowEdit(false)} onSave={handleEditSave} />}
    </>
  );
};

export default TaskDetail;
