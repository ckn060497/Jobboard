import React from "react";

const Footer = () => (
  <footer className="mt-20 border-t border-ink/10 bg-ink text-paper/80">
    <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg text-paper">Foundry</p>
        <p>&copy; {new Date().getFullYear()} Foundry. Built for people doing the work.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
