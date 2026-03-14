import { Task } from '../../actions/types';
import { STATUS_CONFIG, getAvatarColor, getInitials } from '../../utils/config';
import { CheckIcon, PencilIcon, TrashIcon, CircleProgressIcon } from '../UI/Icons';

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

const TasksPanel = ({ tasks, onEdit, onDelete }: Props) => {
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="bg-secondary flex flex-col gap-4 rounded-2xl border border-white/6 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-foreground text-[15px] font-bold">Tasks</h2>
        <span className="text-foreground-hover flex items-center gap-1 text-xs">
          <CheckIcon />
          <span>
            {doneCount}/{tasks.length} done
          </span>
        </span>
      </div>

      {tasks.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-black/30 p-3">
          <div className="relative h-9 w-9 flex-shrink-0">
            <CircleProgressIcon percent={percent} />
            <span className="text-primary absolute inset-0 flex items-center justify-center text-[9px] font-bold">
              {percent}%
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-foreground-hover mb-1.5 flex justify-between text-xs">
              <span>Overall progress</span>
              <span>{doneCount} completed</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {tasks.length === 0 && (
          <div className="text-foreground-hover/50 flex flex-col items-center justify-center gap-2 py-12">
            <div className="bg-secondary-hover flex h-10 w-10 items-center justify-center rounded-xl">
              <CheckIcon />
            </div>
            <span className="text-sm">No tasks yet</span>
          </div>
        )}
        {tasks.map((task) => {
          const status = STATUS_CONFIG[task.status];
          return (
            <div
              key={task.id}
              className="group hover:bg-secondary-hover flex items-center gap-2.5 rounded-xl border border-transparent bg-black/30 p-2.5 transition-all hover:border-white/6"
            >
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${getAvatarColor(task.title)}`}
              >
                {getInitials(task.title)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">{task.title}</p>
                {task.description && <p className="text-foreground-hover truncate text-[11px]">{task.description}</p>}
              </div>
              <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${status.bg} ${status.color}`}>
                {status.label}
              </span>
              <div className="flex flex-shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => onEdit(task)}
                  className="hover:bg-primary/15 text-foreground-hover/50 hover:text-primary flex h-6 w-6 items-center justify-center rounded-lg transition-all"
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-foreground-hover/50 flex h-6 w-6 items-center justify-center rounded-lg transition-all hover:bg-rose-500/15 hover:text-rose-400"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksPanel;
