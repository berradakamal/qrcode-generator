"use client";

import { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, BarChart3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { QRCodeAnalytics } from '@/types/qr-code';

interface QRCodeKPIsProps {
  analytics: QRCodeAnalytics;
  createdAt: Date;
}

interface KPICardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: number;
  icon: React.ReactNode;
  color: string;
  sparklineData?: { value: number }[];
  sparklineColor?: string;
}

function KPICard({ label, value, subValue, trend, icon, color, sparklineData, sparklineColor }: KPICardProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className={color}>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">{value}</span>
        {trend !== undefined && trend !== 0 && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
        {subValue && (
          <span className="text-xs text-muted-foreground">{subValue}</span>
        )}
      </div>
      {sparklineData && sparklineData.length > 0 && (
        <div className="h-8 w-24 mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparklineColor || '#3b82f6'} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={sparklineColor || '#3b82f6'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={sparklineColor || '#3b82f6'}
                strokeWidth={1.5}
                fill={`url(#gradient-${label})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function QRCodeKPIs({ analytics, createdAt }: QRCodeKPIsProps) {
  const { totalScans, uniqueScans, lastScanAt } = analytics;

  const uniquePercentage = useMemo(() => {
    if (totalScans === 0) return 0;
    return Math.round((uniqueScans / totalScans) * 100);
  }, [totalScans, uniqueScans]);

  const lastScanText = useMemo(() => {
    if (!lastScanAt) return 'No scans yet';
    return formatDistanceToNow(new Date(lastScanAt), { addSuffix: true });
  }, [lastScanAt]);

  const demoSparklineData = useMemo(() => {
    if (totalScans === 0) return [];
    const days = 7;
    const avgPerDay = Math.max(1, Math.floor(totalScans / days));
    return Array.from({ length: days }, (_, i) => ({
      value: Math.max(0, avgPerDay + Math.floor((Math.random() - 0.5) * avgPerDay * 0.8))
    }));
  }, [totalScans]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
      <KPICard
        label="Total Scans"
        value={totalScans.toLocaleString()}
        icon={<BarChart3 className="w-3.5 h-3.5" />}
        color="text-blue-500"
        sparklineData={demoSparklineData}
        sparklineColor="#3b82f6"
      />
      <KPICard
        label="Unique Visitors"
        value={uniqueScans.toLocaleString()}
        subValue={totalScans > 0 ? `(${uniquePercentage}%)` : undefined}
        icon={<Users className="w-3.5 h-3.5" />}
        color="text-purple-500"
      />
      <KPICard
        label="Conversion"
        value="--"
        subValue="Coming soon"
        icon={<TrendingUp className="w-3.5 h-3.5" />}
        color="text-emerald-500"
      />
      <KPICard
        label="Last Scan"
        value={lastScanAt ? formatDistanceToNow(new Date(lastScanAt)) : '--'}
        icon={<Clock className="w-3.5 h-3.5" />}
        color="text-orange-500"
      />
    </div>
  );
}
