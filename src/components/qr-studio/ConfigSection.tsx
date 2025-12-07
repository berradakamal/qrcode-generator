"use client";

import { ChevronDown, ChevronRight } from 'lucide-react';

interface ConfigSectionProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  theme?: 'dark' | 'light';
}

export function ConfigSection({ title, icon, children, isActive, onClick, theme = 'dark' }: ConfigSectionProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
      isDark
        ? `border-slate-800 ${isActive ? 'bg-slate-800/30' : 'bg-slate-900'}`
        : `border-slate-200 ${isActive ? 'bg-blue-50' : 'bg-white'}`
    }`}>
      <button onClick={onClick} className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
        isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${
            isActive
              ? 'bg-blue-600 text-white'
              : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
          }`}>
            {icon}
          </div>
          <span className={`font-medium text-sm ${
            isActive
              ? isDark ? 'text-white' : 'text-slate-900'
              : isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>{title}</span>
        </div>
        {isActive
          ? <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          : <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
        }
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-3 pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
