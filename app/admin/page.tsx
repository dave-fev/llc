'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  ShoppingCart,
  Building2,
  FileText,
  DollarSign,
  Activity,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalCompanies: number;
  totalRevenue: number;
  completedOrders: number;
  activeUsers: number;
}

interface Order {
  order_number: string;
  company_name: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/orders'),
        ]);

        if (statsRes.status === 401 || ordersRes.status === 401) {
          router.push('/admin-login');
          return;
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders(ordersData.orders.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const statsConfig = stats ? [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Companies',
      value: stats.totalCompanies.toLocaleString(),
      icon: Building2,
      color: 'bg-purple-500',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders.toLocaleString(),
      icon: FileText,
      color: 'bg-amber-500',
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: 'bg-red-500',
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="group bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-neutral-300 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background Effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`}></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-neutral-900 mb-2">{stat.value}</h3>
                <p className="text-sm text-neutral-600 font-bold">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders - Enhanced */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-white to-neutral-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-neutral-900 mb-1">Recent Orders</h2>
              <p className="text-sm text-neutral-600 font-medium">Latest customer orders and transactions</p>
            </div>
            <button
              onClick={() => router.push('/admin/orders')}
              className="px-4 py-2 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-600">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, index) => (
                  <tr
                    key={order.order_number}
                    className="hover:bg-neutral-50 transition-all duration-200 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-black text-neutral-900">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-neutral-700">{order.company_name || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-black text-neutral-900">${order.amount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-black shadow-sm ${order.status === 'completed'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-600 font-medium">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg hover:bg-neutral-800 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

