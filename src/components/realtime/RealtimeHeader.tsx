'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface RealtimeHeaderProps {
  activeUsers: number;
  userName?: string | null;
  userImage?: string | null;
}

export const RealtimeHeader: React.FC<RealtimeHeaderProps> = ({
  activeUsers,
  userName,
  userImage,
}) => {
  const displayName = userName || 'User';
  const displayImage =
    userImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
        </Link>

        <div className="h-6 w-px bg-border" />

        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="QRCode Generator Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span
            className="font-bold text-lg tracking-tight hidden md:inline"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Realtime
          </span>
        </Link>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-2 hidden sm:flex">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            {activeUsers.toLocaleString()} users active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <div className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer hover:opacity-80 transition-opacity">
          <img
            src={displayImage}
            alt="User"
            className="w-8 h-8 rounded-full bg-muted"
          />
          <div className="hidden md:block text-sm text-left">
            <div className="font-bold leading-none">{displayName}</div>
            <div className="text-[10px] text-muted-foreground mt-1">Viewing live</div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
        </div>
      </div>
    </header>
  );
};
