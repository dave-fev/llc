'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Inbox,
  Building2,
  HelpCircle,
  Mail,
  LogOut,
  Menu,
  X,
  Bell,
  User,
} from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/user',
    badge: null,
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    href: '/user/orders',
    badge: null,
  },
  {
    title: 'Inbox',
    icon: Inbox,
    href: '/user/inbox',
    badge: null,
  },
  {
    title: 'Companies',
    icon: Building2,
    href: '/user/companies',
    badge: null,
  },
  {
    title: 'Contact Us',
    icon: Mail,
    href: '/contact',
    badge: null,
  },
];

export function UserSidebar({ onMobileMenuToggle }: { onMobileMenuToggle?: (isOpen: boolean) => void }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        // Handle both { user: ... } and direct user object
        const userObj = data.user || data;
        setUser(userObj);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleMobileMenuToggle = (isOpen: boolean) => {
    setIsMobileOpen(isOpen);
    if (onMobileMenuToggle) {
      onMobileMenuToggle(isOpen);
    }
  };

  // Expose toggle function globally for header to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).toggleUserSidebar = () => handleMobileMenuToggle(!isMobileOpen);
    }
  }, [isMobileOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear any local storage or session data
        try {
          if (typeof window !== 'undefined') {
            // Clear Redux persist data
            localStorage.removeItem('persist:root');
            // Clear any other local storage items
            localStorage.removeItem('swift_filling_has_started');
          }
        } catch (storageError) {
          console.error('Error clearing storage:', storageError);
        }

        showNotification('success', 'Logged out successfully', 'Success', 2000);

        // Wait a moment for notification to show, then redirect
        setTimeout(() => {
          router.push('/');
          // Force a hard reload to clear all state
          window.location.href = '/';
        }, 500);
      } else {
        const data = await response.json().catch(() => ({}));
        showNotification('error', data.error || 'Failed to logout. Please try again.', 'Logout Error');
        setIsLoggingOut(false);
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      showNotification('error', 'Failed to logout. Redirecting...', 'Error');
      // Still redirect even if logout API fails
      setTimeout(() => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('persist:root');
            localStorage.removeItem('swift_filling_has_started');
          }
        } catch (storageError) {
          // Ignore storage errors
        }
        window.location.href = '/';
      }, 1000);
    }
  };

  return (
    <>
      {NotificationComponent}
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 text-white
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col overflow-y-auto
          shadow-2xl border-r border-neutral-800
        `}
      >
        {/* Close Button - Top Right - Mobile Only */}
        <button
          onClick={() => handleMobileMenuToggle(false)}
          className="lg:hidden absolute top-4 right-4 z-50 p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 lg:p-6 border-b border-neutral-800/50 bg-gradient-to-r from-neutral-900 to-neutral-950">
          <Link href="/user" className="group flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl lg:text-2xl font-black text-white group-hover:text-neutral-100 transition-colors">
                Swift <span className="text-neutral-300">Filling</span>
              </h1>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider -mt-1">User Dashboard</p>
            </div>
          </Link>
        </div>

        {/* User Profile Section - Mobile Only */}
        <div className="lg:hidden p-4 border-b border-neutral-800/50 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              {user ? (
                <span className="text-white font-bold text-sm">
                  {`${user.firstName?.[0] || user.first_name?.[0] || ''}${user.lastName?.[0] || user.last_name?.[0] || ''}`.toUpperCase() || user.email[0].toUpperCase()}
                </span>
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">
                {user ? `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim() || user.email : 'Loading...'}
              </p>
              <p className="text-xs text-neutral-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/user' && pathname?.startsWith(item.href));

            return (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                onClick={() => handleMobileMenuToggle(false)}
                className={`
                  group relative flex items-center gap-3 px-4 py-3.5 rounded-xl
                  transition-all duration-300
                  ${isActive
                    ? 'bg-white text-neutral-900 shadow-xl scale-[1.02]'
                    : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white hover:translate-x-1'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neutral-900 rounded-r-full"></div>
                )}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                  ${isActive
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-800/50 text-neutral-400 group-hover:bg-neutral-700 group-hover:text-white'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`font-bold flex-1 ${isActive ? 'text-neutral-900' : ''}`}>
                  {item.title}
                </span>
                {item.badge && (
                  <span
                    className={`
                      px-2.5 py-1 text-xs font-black rounded-full min-w-[24px] text-center
                      ${isActive
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700 group-hover:text-white'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu - Logout */}
        <div className="border-t border-neutral-800/50 p-4 space-y-1.5 bg-gradient-to-t from-neutral-950 to-transparent">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-neutral-300 hover:bg-red-900/30 hover:text-red-400 transition-all duration-300 group border border-transparent hover:border-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-800/50 group-hover:bg-red-900/20 flex items-center justify-center transition-all duration-300">
              {isLoggingOut ? (
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogOut className="w-5 h-5 text-neutral-400 group-hover:text-red-400" />
              )}
            </div>
            <span className="font-bold">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}

