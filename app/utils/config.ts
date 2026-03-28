import { TaskStatus } from '../actions/types';

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string; dot: string; ring: string }> = {
  todo: { label: 'Todo', color: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400', ring: 'ring-amber-400/30' },
  doing: {
    label: 'Doing',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    dot: 'bg-blue-400',
    ring: 'ring-blue-400/30',
  },
  done: {
    label: 'Done',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-400/30',
  },
};

const AVATAR_PALETTE = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-indigo-500',
];

export const getAvatarColor = (str: string) => AVATAR_PALETTE[str.charCodeAt(0) % AVATAR_PALETTE.length];
export const getInitials = (str: string) => str.slice(0, 2).toUpperCase();

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
