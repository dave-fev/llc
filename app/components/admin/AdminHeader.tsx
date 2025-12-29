'use client';

import React, { useState } from 'react';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-lg sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar - Enhanced */}
          <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
              <input
                type="text"
                placeholder="Search users, orders, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none focus:bg-white transition-all text-black placeholder:text-neutral-400 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Right Side Actions - Enhanced */}
          <div className="flex items-center gap-3">
            {/* Notifications - Enhanced */}
            <button className="relative p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-all duration-300 hover:scale-110 group">
              <Bell className="w-5 h-5 text-neutral-700 group-hover:text-neutral-900 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
            </button>

            {/* User Menu - Enhanced */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-all duration-300 hover:scale-105 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-black text-neutral-900">Admin User</p>
                    <p className="text-xs text-neutral-500 font-medium">admin@swiftsfilling.com</p>
                  </div>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white rounded-2xl shadow-2xl border border-neutral-200 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenu.Item className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 cursor-pointer outline-none transition-colors group">
                    <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center group-hover:bg-neutral-900 transition-colors">
                      <User className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-bold text-neutral-900">Profile</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 cursor-pointer outline-none transition-colors group">
                    <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center group-hover:bg-neutral-900 transition-colors">
                      <Settings className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-bold text-neutral-900">Settings</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-neutral-200 my-2" />
                  <DropdownMenu.Item
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 cursor-pointer outline-none text-red-600 transition-colors group"
                    onClick={() => (window.location.href = '/')}
                  >
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      <LogOut className="w-4 h-4 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-bold">Logout</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </header>
  );
}

