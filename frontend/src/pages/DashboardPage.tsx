import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { DashboardStats } from '../types';

interface StatCardProps {
  title: string;
  value: number;
  colorClass: string;
  icon: string;
}

function StatCard({ title, value, colorClass, icon }: StatCardProps) {
  return (
    <div className={`${colorClass} rounded-xl p-6 text-white shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-4xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-4xl opacity-70">{icon}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<DashboardStats>('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        {loading && <p className="text-gray-500">Loading statistics...</p>}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Open Tickets"
              value={stats.openTickets}
              colorClass="bg-blue-600"
              icon="🎫"
            />
            <StatCard
              title="Closed Tickets"
              value={stats.closedTickets}
              colorClass="bg-green-600"
              icon="✅"
            />
            <StatCard
              title="High Priority"
              value={stats.highPriorityTickets}
              colorClass="bg-red-500"
              icon="🔥"
            />
            <StatCard
              title="Assigned To Me"
              value={stats.assignedToMe}
              colorClass="bg-yellow-500"
              icon="👤"
            />
          </div>
        )}
      </main>
    </div>
  );
}
