'use client';

import React from 'react';
import { Cpu } from 'lucide-react';

interface OSBreakdownChartProps {
  osBreakdown: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  isLoading?: boolean;
}

const OS_COLORS: Record<string, string> = {
  'iOS': '#3b82f6',
  'Mac OS': '#6366f1',
  'Android': '#10b981',
  'Windows': '#f97316',
  'Linux': '#eab308',
  'Chrome OS': '#ec4899',
  'Unknown': '#6b7280',
};

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f97316', '#ec4899', '#eab308', '#6366f1', '#ef4444', '#06b6d4'];

export const OSBreakdownChart: React.FC<OSBreakdownChartProps> = ({
  osBreakdown,
  deviceBreakdown,
  isLoading,
}) => {
  const totalScans = Object.values(osBreakdown).reduce((sum, count) => sum + count, 0);
  const totalDevices = Object.values(deviceBreakdown).reduce((sum, count) => sum + count, 0);

  const mobileCount = (deviceBreakdown['mobile'] || 0) + (deviceBreakdown['tablet'] || 0);
  const mobilePercentage = totalDevices > 0 ? Math.round((mobileCount / totalDevices) * 100) : 0;

  const osData = Object.entries(osBreakdown)
    .map(([os, count]) => ({
      os,
      count,
      percentage: totalScans > 0 ? Math.round((count / totalScans) * 100) : 0,
      color: OS_COLORS[os] || DEFAULT_COLORS[Object.keys(osBreakdown).indexOf(os) % DEFAULT_COLORS.length],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  let cumulativeOffset = 0;
  const chartSegments = osData.map((item) => {
    const segment = {
      ...item,
      dashOffset: -cumulativeOffset,
    };
    cumulativeOffset += item.percentage;
    return segment;
  });

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 shadow-lg flex flex-col justify-center">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" /> OS Breakdown
        </h3>
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (totalScans === 0) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 shadow-lg flex flex-col justify-center">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" /> OS Breakdown
        </h3>
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
            <Cpu className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">No scan data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-lg flex flex-col justify-center">
      <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
        <Cpu className="w-5 h-5 text-purple-400" /> OS Breakdown
      </h3>
      <div className="flex items-center justify-center gap-8 h-full">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
            <path
              className="text-muted"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            {chartSegments.map((segment, index) => (
              <path
                key={segment.os}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={segment.color}
                strokeWidth="3"
                strokeDasharray={`${segment.percentage}, 100`}
                strokeDashoffset={segment.dashOffset}
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            ))}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold">{mobilePercentage}%</span>
            <span className="text-[10px] text-muted-foreground uppercase">Mobile</span>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          {osData.map((item) => (
            <div key={item.os} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate max-w-[80px]">{item.os}</span>
              <span className="text-muted-foreground ml-auto">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
