import React, { ReactNode } from 'react';

type Props = {
  onClose: () => void;
  maxWidth?: 'xs' | 'md';
  children: ReactNode;
};

const Modal = ({ onClose, maxWidth = 'md', children }: Props) => {
  const widthClass = maxWidth === 'xs' ? 'max-w-xs' : 'max-w-md';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`bg-secondary relative w-full ${widthClass} overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60`}
      >
        <div className="via-primary absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
