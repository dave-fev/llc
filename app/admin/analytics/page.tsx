'use client';

import React from 'react';
import { TrendingUp, Users, DollarSign, ShoppingCart, BarChart3, PieChart } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black text-neutral-900 mb-2">Analytics</h1>
        <p className="text-neutral-600">Comprehensive insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              +12.5%
            </span>
          </div>
          <p className="text-sm text-neutral-600 font-medium mb-1">Total Users</p>
          <p className="text-3xl font-black text-neutral-900">12,458</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              +8.2%
            </span>
          </div>
          <p className="text-sm text-neutral-600 font-medium mb-1">Total Orders</p>
          <p className="text-3xl font-black text-neutral-900">8,234</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              +15.3%
            </span>
          </div>
          <p className="text-sm text-neutral-600 font-medium mb-1">Revenue</p>
          <p className="text-3xl font-black text-neutral-900">$245,678</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              +4.7%
            </span>
          </div>
          <p className="text-sm text-neutral-600 font-medium mb-1">Growth Rate</p>
          <p className="text-3xl font-black text-neutral-900">24.5%</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-neutral-900" />
            <h2 className="text-2xl font-black text-neutral-900">Revenue Overview</h2>
          </div>
          <div className="h-64 bg-neutral-50 rounded-xl flex items-center justify-center">
            <p className="text-neutral-500 font-medium">Chart visualization will be here</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-neutral-900" />
            <h2 className="text-2xl font-black text-neutral-900">Order Distribution</h2>
          </div>
          <div className="h-64 bg-neutral-50 rounded-xl flex items-center justify-center">
            <p className="text-neutral-500 font-medium">Chart visualization will be here</p>
          </div>
        </div>
      </div>
    </div>
  );
}



