'use client';

import React from 'react';
import { UserSidebar } from '../components/user/UserSidebar';
import { UserHeader } from '../components/user/UserHeader';
import { UserAuthCheck } from './middleware';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserAuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 flex">
        <UserSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <UserHeader />
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-neutral-50 via-white to-neutral-50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </UserAuthCheck>
  );
}

