'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, X, FileText, MessageSquare, Trash2, Eye, Download, ChevronRight, AlertCircle } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { useConfirm } from '../../hooks/useConfirm';

interface Notification {
  id: number;
  subject: string;
  content: string;
  type: string;
  status: string;
  documentUrl?: string;
  documentName?: string;
  documentType?: string;
  created_at: string;
}

export function UserHeader() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expiringCompanies, setExpiringCompanies] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewingNotification, setViewingNotification] = useState<Notification | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showNotification, NotificationComponent } = useNotification();
  const { confirm, ConfirmComponent } = useConfirm();

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const fetchUserData = async () => {
    try {
      const [userRes, inboxRes, companiesRes] = await Promise.all([
        fetch('/api/user/profile', {
          credentials: 'include',
        }),
        fetch('/api/user/inbox?unread=true', {
          credentials: 'include',
        }),
        fetch('/api/user/companies', {
          credentials: 'include',
        }),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        // Handle both { user: ... } and direct user object
        const userObj = userData.user || userData;
        setUser(userObj);
      } else if (userRes.status === 401) {
        // User is not authenticated, redirect will be handled by middleware
        console.log('User session expired or invalid');
      }

      if (inboxRes.ok) {
        const inboxData = await inboxRes.json();
        setNotifications(inboxData.messages || []);
        setUnreadCount(inboxData.unreadCount || 0);
      }

      if (companiesRes.ok) {
        const companiesData = await companiesRes.json();
        const expiring = (companiesData.companies || []).filter((c: any) => {
          if (!c.expiry_date) return false;
          const expiry = new Date(c.expiry_date);
          const today = new Date();
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);
          return expiry <= thirtyDaysFromNow;
        });
        setExpiringCompanies(expiring);
      }
    } catch (error) {
      // Only log unexpected errors, not 401s
      if (error instanceof Error && !error.message.includes('401')) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const handleDelete = async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = await confirm({
      title: 'Delete Notification',
      message: 'Are you sure you want to delete this notification? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!confirmed) return;

    setDeletingId(notificationId);
    try {
      const response = await fetch(`/api/user/inbox?messageId=${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
        setUnreadCount(Math.max(0, unreadCount - 1));
        showNotification('success', 'Notification deleted successfully', 'Success');
      } else {
        showNotification('error', 'Failed to delete notification. Please try again.', 'Error');
      }
    } catch (error) {
      showNotification('error', 'Failed to delete notification. Please check your connection and try again.', 'Error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewNotification = (notification: Notification) => {
    setViewingNotification(notification);
    setIsDropdownOpen(false);

    // Mark as read if unread
    if (notification.status === 'unread') {
      fetch('/api/user/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: notification.id, status: 'read' }),
      }).then(() => {
        setNotifications(notifications.map(n =>
          n.id === notification.id ? { ...n, status: 'read' } : n
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
      });
    }
  };

  const handleDownload = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    if (notification.documentUrl) {
      window.open(notification.documentUrl, '_blank');
    }
  };

  const userInitials = user
    ? `${user.firstName?.[0] || user.first_name?.[0] || ''}${user.lastName?.[0] || user.last_name?.[0] || ''}`.toUpperCase() || user.email[0].toUpperCase()
    : 'U';

  return (
    <>
      {NotificationComponent}
      {ConfirmComponent}
      {expiringCompanies.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2.5 flex items-center justify-center gap-3 animate-gradient-fast">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm font-bold flex flex-wrap items-center justify-center gap-2">
            <span>Action Required: {expiringCompanies.length} of your LLCs {expiringCompanies.some(c => new Date(c.expiry_date) < new Date()) ? 'have expired' : 'are expiring soon'}.</span>
            <Link
              href="/user/companies"
              className="bg-white text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider hover:bg-neutral-100 transition-colors shadow-lg"
            >
              Renew Now ($200)
            </Link>
          </div>
        </div>
      )}
      <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-30">
        <div className="px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).toggleUserSidebar) {
                  (window as any).toggleUserSidebar();
                }
              }}
              className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* User Profile - Desktop Only */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm">{userInitials}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  {user ? `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim() || user.email : 'Loading...'}
                </p>
                <p className="text-xs text-neutral-500">{user?.email || ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all group"
                >
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-neutral-900">Notifications</h3>
                        <button
                          onClick={() => setIsDropdownOpen(false)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                          <p className="text-neutral-500 font-medium">No notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-neutral-100">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 hover:bg-neutral-50 transition-all cursor-pointer group ${notification.status === 'unread' ? 'bg-blue-50/50' : ''
                                }`}
                              onClick={() => handleViewNotification(notification)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.documentUrl
                                  ? 'bg-orange-100 text-orange-600'
                                  : 'bg-blue-100 text-blue-600'
                                  }`}>
                                  {notification.documentUrl ? (
                                    <FileText className="w-5 h-5" />
                                  ) : (
                                    <MessageSquare className="w-5 h-5" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="font-black text-neutral-900 text-sm line-clamp-1">
                                      {notification.subject}
                                    </h4>
                                    {notification.status === 'unread' && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                    )}
                                  </div>
                                  <p className="text-xs text-neutral-600 line-clamp-2 mb-2">
                                    {notification.content}
                                  </p>
                                  {notification.documentName && (
                                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2">
                                      <FileText className="w-3.5 h-3.5" />
                                      <span className="truncate">{notification.documentName}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-neutral-400">
                                      {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {notification.documentUrl && (
                                        <button
                                          onClick={(e) => handleDownload(notification, e)}
                                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                          title="Download"
                                        >
                                          <Download className="w-4 h-4" />
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => handleDelete(notification.id, e)}
                                        disabled={deletingId === notification.id}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                        title="Delete"
                                      >
                                        {deletingId === notification.id ? (
                                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <Trash2 className="w-4 h-4" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-neutral-200 bg-neutral-50">
                        <Link
                          href="/user/inbox"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center justify-center gap-2 text-sm font-bold text-neutral-900 hover:text-neutral-700 transition-colors"
                        >
                          View All Messages
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notification View Modal */}
      {viewingNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${viewingNotification.documentUrl
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-blue-100 text-blue-600'
                  }`}>
                  {viewingNotification.documentUrl ? (
                    <FileText className="w-6 h-6" />
                  ) : (
                    <MessageSquare className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-black text-neutral-900">{viewingNotification.subject}</h2>
                  <p className="text-xs text-neutral-500">
                    {new Date(viewingNotification.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingNotification(null)}
                className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="prose max-w-none">
                <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                  {viewingNotification.content}
                </p>
              </div>

              {viewingNotification.documentUrl && (
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="font-bold text-neutral-900">{viewingNotification.documentName || 'Document'}</p>
                        <p className="text-xs text-neutral-500">Click to view or download</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(viewingNotification.documentUrl, '_blank')}
                        className="px-4 py-2 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => window.open(viewingNotification.documentUrl, '_blank')}
                        className="px-4 py-2 bg-white border-2 border-neutral-200 text-neutral-900 font-bold rounded-xl hover:border-neutral-900 transition-all flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => handleDelete(viewingNotification.id, { stopPropagation: () => { } } as any)}
                  disabled={deletingId === viewingNotification.id}
                  className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {deletingId === viewingNotification.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
                <button
                  onClick={() => setViewingNotification(null)}
                  className="px-4 py-2 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
