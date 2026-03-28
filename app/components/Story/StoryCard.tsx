import Link from 'next/link';
import { Story } from '../../actions/types';

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  high: { label: 'High', color: 'text-rose-400', bg: 'bg-rose-400/10' },
};

const STATUS_CONFIG = {
  todo: { label: 'Todo', color: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400' },
  doing: { label: 'Doing', color: 'text-blue-400', bg: 'bg-blue-400/10', dot: 'bg-blue-400' },
  done: { label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
};

type Props = {
  story: Story;
};

const StoryCard = ({ story }: Props) => {
  const priority = PRIORITY_CONFIG[story.priority];
  const status = STATUS_CONFIG[story.status];
  return (
    <div className="bg-secondary rounded-xl border border-white/8 p-3.5 transition-all hover:border-white/15">
      <div className="mb-2">
        <Link
          href={`/stories/${story.id}`}
          className="text-foreground text-sm leading-snug font-medium hover:underline"
        >
          {story.name}
        </Link>
      </div>

      {story.description && (
        <p className="text-foreground-hover mb-2.5 line-clamp-2 text-xs leading-relaxed">{story.description}</p>
      )}

      <div className="flex items-center gap-1.5">
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${priority.color} ${priority.bg}`}>
          {priority.label}
        </span>
        <span
          className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${status.bg} ${status.color}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>
    </div>
  );
};

export default StoryCard;
