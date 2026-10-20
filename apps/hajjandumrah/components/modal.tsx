"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  wide?: boolean;
  children: ReactNode;
};

// Native <dialog>: focus trap, Esc and the backdrop come from the browser.
export function Modal({ open, onClose, title, description, wide = false, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-label={title}
      className={`m-auto w-[calc(100%-2rem)] rounded-lg border border-line bg-paper p-0 text-ink shadow-xl backdrop:bg-night/60 ${wide ? "max-w-3xl" : "max-w-lg"}`}
    >
      {open && (
        <div className="grid max-h-[85vh] gap-4 overflow-y-auto p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-1">
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              {description && <p className="text-sm text-ink-soft">{description}</p>}
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="rounded-sm p-1.5 text-muted hover:bg-mist hover:text-ink">
              <X className="size-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
