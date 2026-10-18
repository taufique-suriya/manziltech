"use client";

import { useState, type MouseEvent, type ReactNode } from "react";

type MobileMenuProps = {
  // The menu's links, rendered by the (server) shell.
  children: ReactNode;
};

// Small-screen menu: a toggle button and a panel that closes after a link is chosen.
export function MobileMenu({ children }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const closeOnLink = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
        className="rounded-sm p-2 text-ink hover:bg-mist"
      >
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        onClick={closeOnLink}
        className="absolute inset-x-0 top-full border-b border-line bg-paper px-4 pb-4 shadow-sm"
      >
        {children}
      </div>
    </div>
  );
}
