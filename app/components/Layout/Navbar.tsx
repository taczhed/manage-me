import { User, Project } from '../../actions/types';

type Props = {
  user: User;
  activeProject: Project | null;
  onChangeProject: () => void;
};

const Navbar = ({ user, activeProject, onChangeProject }: Props) => (
  <nav className="flex items-center justify-between border-b border-white/6 px-6 py-4">
    <span className="font-display text-foreground text-[15px] font-bold tracking-tight">manage.me</span>

    <div className="flex items-center gap-3">
      {activeProject && (
        <>
          <button
            onClick={onChangeProject}
            className="bg-secondary text-foreground-hover hover:text-foreground hover:bg-secondary-hover flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-sm transition-all"
          >
            <span className="text-foreground max-w-[120px] truncate">{activeProject.name}</span>
          </button>
        </>
      )}

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
        <div className="bg-primary/30 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white">
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <span className="text-foreground-hover text-sm">
          {user.firstName} {user.lastName}
        </span>
      </div>
    </div>
  </nav>
);

export default Navbar;
