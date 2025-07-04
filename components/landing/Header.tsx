'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Menu as MenuIcon, X } from 'lucide-react';
import UserActionButton from '../UserActionButton';

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Lock className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">VaultLock</h1>
        </Link>

        {/* Mobile toggle */}
        <button
          className="sm:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        {/* Desktop menu */}
        <div className="hidden sm:flex gap-4">
          <UserActionButton />
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-y-3 px-4 pb-4">
          <UserActionButton />
        </div>
      )}
    </header>
  );
}
