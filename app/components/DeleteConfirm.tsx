type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteConfirm = ({ onConfirm, onCancel }: Props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
    <div className="bg-secondary relative flex w-full max-w-xs flex-col gap-4 rounded-2xl border border-white/10 p-6 shadow-2xl shadow-black/60">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </div>
      <div>
        <h3 className="font-display text-foreground text-base font-bold">Delete task?</h3>
        <p className="text-foreground-hover mt-1 text-sm leading-relaxed">This action cannot be undone.</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="text-foreground-hover hover:text-foreground flex-1 rounded-xl border border-white/6 bg-black/30 py-2.5 text-sm font-medium transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-xl border border-rose-500/20 bg-rose-500/15 py-2.5 text-sm font-medium text-rose-400 transition-all hover:bg-rose-500/25"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirm;
