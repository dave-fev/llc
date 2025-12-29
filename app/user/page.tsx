'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Building2, Inbox, FileText, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    companies: 0,
    unreadMessages: 0,
    documents: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, companiesRes, inboxRes] = await Promise.all([
        fetch('/api/user/orders'),
        fetch('/api/user/companies'),
        fetch('/api/user/inbox?unread=true'),
      ]);

      if (ordersRes.status === 401 || companiesRes.status === 401 || inboxRes.status === 401) {
        // Redirect to login instead of home to avoid confusion
        // Use window.location to force a reload which might help with session issues
        window.location.href = '/login?redirect=/user';
        return;
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setStats(prev => ({ ...prev, orders: ordersData.orders?.length || 0 }));
      }

      if (companiesRes.ok) {
        const companiesData = await companiesRes.json();
        setStats(prev => ({ ...prev, companies: companiesData.companies?.length || 0 }));
      }

      if (inboxRes.ok) {
        const inboxData = await inboxRes.json();
        setStats(prev => ({ ...prev, unreadMessages: inboxData.unreadCount || 0 }));
        setStats(prev => ({ ...prev, documents: inboxData.documentsCount || 0 }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-2 tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-neutral-600">Welcome back! Here's an overview of your account.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/user/orders" className="group bg-white rounded-2xl border-2 border-neutral-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:border-neutral-900 hover:scale-[1.01]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-3xl font-black text-neutral-900 mb-1">{stats.orders}</h3>
          <p className="text-xs sm:text-sm text-neutral-600 font-semibold">Total Orders</p>
        </Link>

        <Link href="/user/companies" className="group bg-white rounded-2xl border-2 border-neutral-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:border-neutral-900 hover:scale-[1.01]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-3xl font-black text-neutral-900 mb-1">{stats.companies}</h3>
          <p className="text-xs sm:text-sm text-neutral-600 font-semibold">Companies Formed</p>
        </Link>

        <Link href="/user/inbox" className="group bg-white rounded-2xl border-2 border-neutral-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:border-neutral-900 hover:scale-[1.01] relative">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Inbox className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              {stats.unreadMessages > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-black rounded-full animate-pulse">
                  {stats.unreadMessages}
                </span>
              )}
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-neutral-900 mb-1">{stats.unreadMessages}</h3>
          <p className="text-xs sm:text-sm text-neutral-600 font-semibold">Unread Messages</p>
        </Link>

        <Link href="/user/inbox" className="group bg-white rounded-2xl border-2 border-neutral-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:border-neutral-900 hover:scale-[1.01]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-3xl font-black text-neutral-900 mb-1">{stats.documents}</h3>
          <p className="text-xs sm:text-sm text-neutral-600 font-semibold">Documents</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-md p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mb-5 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/form"
            className="group relative p-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/0 via-neutral-800/50 to-neutral-800/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black mb-1">Start New Order</h3>
              <p className="text-xs text-neutral-300">Create a new LLC formation order</p>
            </div>
          </Link>

          <Link
            href="/user/inbox"
            className="group relative p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700/0 via-blue-700/50 to-blue-700/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black mb-1">View Inbox</h3>
              <p className="text-xs text-blue-100">Check your messages and documents</p>
            </div>
          </Link>

          <Link
            href="/contact"
            className="group relative p-6 bg-gradient-to-br from-green-600 via-green-700 to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-700/0 via-green-700/50 to-green-700/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black mb-1">Get Help</h3>
              <p className="text-xs text-green-100">Contact support or view FAQs</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
