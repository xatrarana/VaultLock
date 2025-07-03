'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Lock, Plus, User } from 'lucide-react';
import Link from 'next/link';

export function Header({ onAddEntry }: { onAddEntry?: () => void }) {
  const { user } = useUser();

  const maskUserInfo = (info: string) => {
    if (!info) return info;
    const [name, domain] = info.split("@");
    if (!domain) return info;
    const maskedName = name[0] + '*'.repeat(Math.min(name.length - 1, 6));
    return maskedName + '@' + domain;
  };


  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto py-4 flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={
          '/dashboard'
        }
          className="flex items-center gap-2"
        >
          <Lock className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Vault Dashboard</h1>
        </Link>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Link href={"/dashboard/profile"} className="flex items-center gap-2 cursor-pointer">
            <User className="h-6 w-6 text-gray-500" />
            <span className="text-sm text-gray-700">
              {maskUserInfo(user?.fullName || user?.emailAddresses?.[0]?.emailAddress || 'User')}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
