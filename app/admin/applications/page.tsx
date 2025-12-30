'use client';

import React, { useState } from 'react';
import { Search, Filter, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const applications = [
  {
    id: 'APP-001',
    companyName: 'Acme Corporation',
    state: 'Delaware',
    status: 'Approved',
    submitted: '2024-01-15',
    completed: '2024-01-16',
  },
  {
    id: 'APP-002',
    companyName: 'Tech Solutions LLC',
    state: 'California',
    status: 'In Review',
    submitted: '2024-01-14',
    completed: null,
  },
  {
    id: 'APP-003',
    companyName: 'Global Business Inc',
    state: 'New York',
    status: 'Rejected',
    submitted: '2024-01-13',
    completed: '2024-01-14',
  },
  {
    id: 'APP-004',
    companyName: 'Startup Ventures',
    state: 'Texas',
    status: 'Pending',
    submitted: '2024-01-12',
    completed: null,
  },
  {
    id: 'APP-005',
    companyName: 'Business Pro LLC',
    state: 'Florida',
    status: 'Approved',
    submitted: '2024-01-11',
    completed: '2024-01-12',
  },
];

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'In Review':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-neutral-900 mb-2">Applications</h1>
          <p className="text-neutral-600">Manage LLC formation applications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <p className="text-sm text-neutral-600 font-medium mb-2">Total Applications</p>
          <p className="text-3xl font-black text-neutral-900">1,234</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <p className="text-sm text-neutral-600 font-medium mb-2">Approved</p>
          <p className="text-3xl font-black text-green-600">892</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <p className="text-sm text-neutral-600 font-medium mb-2">In Review</p>
          <p className="text-3xl font-black text-blue-600">234</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <p className="text-sm text-neutral-600 font-medium mb-2">Pending</p>
          <p className="text-3xl font-black text-amber-600">108</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-xl hover:border-neutral-900 hover:bg-neutral-100 transition-all font-bold text-neutral-900">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Application ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-bold text-neutral-900">{app.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-neutral-700">{app.companyName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600">{app.state}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.status === 'Approved'
                            ? 'bg-green-100 text-green-700'
                            : app.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : app.status === 'In Review'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600">{app.submitted}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




