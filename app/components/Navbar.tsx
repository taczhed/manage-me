type Props = {
  onNewTask: () => void;
};

const Navbar = ({ onNewTask }: Props) => (
  <nav className="flex items-center justify-between border-b border-white/6 px-6 py-4">
    <span className="font-display text-foreground text-[15px] font-bold tracking-tight">manage.me</span>
    <button
      onClick={onNewTask}
      className="bg-secondary text-foreground-hover hover:text-foreground hover:border-primary/40 hover:bg-secondary-hover flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-sm transition-all"
    >
      <span className="text-primary leading-none font-bold">+</span>
      <span>New Task</span>
    </button>
  </nav>
);

export default Navbar;
