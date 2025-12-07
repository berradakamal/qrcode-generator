'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { QR_TYPE_LABELS } from '@/types/qr-code';

interface QRTypePieChartProps {
  data: Record<string, { totalScans: number; uniqueScans: number; count: number }>;
  isLoading?: boolean;
}

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // orange
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#eab308', // yellow
  '#ef4444', // red
  '#84cc16', // lime
  '#6366f1', // indigo
];

export const QRTypePieChart: React.FC<QRTypePieChartProps> = ({ data, isLoading }) => {
  const chartData = Object.entries(data)
    .filter(([, stats]) => stats.totalScans > 0)
    .map(([type, stats]) => ({
      name: QR_TYPE_LABELS[type as keyof typeof QR_TYPE_LABELS] || type,
      type,
      value: stats.totalScans,
      uniqueScans: stats.uniqueScans,
      count: stats.count,
    }))
    .sort((a, b) => b.value - a.value);

  const totalScans = chartData.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 h-full flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-lg">Scans by Type</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 h-full flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-lg">Scans by Type</h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <PieChartIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">No scan data yet</p>
          <p className="text-muted-foreground text-xs mt-1">
            Create QR codes and share them to see analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 h-full flex flex-col shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-lg">Scans by Type</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{totalScans.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">total scans</div>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = ((data.value / totalScans) * 100).toFixed(1);
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
                      <div className="font-bold text-sm">{data.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {data.value.toLocaleString()} scans ({percentage}%)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {data.uniqueScans.toLocaleString()} unique
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {data.count} QR code{data.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => (
                <span className="text-xs text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.slice(0, 4).map((item, index) => (
          <div key={item.type} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="truncate text-muted-foreground">{item.name}</span>
            <span className="font-medium ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
