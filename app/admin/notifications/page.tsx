'use client';

import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'New order received',
    message: 'Order #ORD-001 has been placed successfully',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'Application approved',
    message: 'Application #APP-002 has been approved',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Payment pending',
    message: 'Payment for Order #ORD-003 is pending',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'error',
    title: 'System alert',
    message: 'High server load detected',
    time: '5 hours ago',
    read: true,
  },
];

export default function NotificationsPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black text-neutral-900 mb-2">Notifications</h1>
        <p className="text-neutral-600">View and manage your notifications</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-neutral-900">All Notifications</h2>
            <button className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors">
              Mark all as read
            </button>
          </div>
        </div>
        <div className="divide-y divide-neutral-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-neutral-50 transition-colors ${
                !notification.read ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-black text-neutral-900">{notification.title}</h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-neutral-500">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



