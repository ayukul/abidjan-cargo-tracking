'use client';

import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: 'blue' | 'orange' | 'green' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
};

export default function DashboardCard({
  title,
  value,
  icon,
  color,
}: DashboardCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-cargo-dark">{value}</p>
        </div>
        <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
