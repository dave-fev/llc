'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      // Skip check for admin routes, API routes, and maintenance page
      if (
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/api') ||
        pathname?.startsWith('/maintenance') ||
        pathname?.startsWith('/_next')
      ) {
        setChecking(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/maintenance', {
          cache: 'no-store',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.maintenanceMode?.enabled === true) {
            // Use window.location for hard redirect
            setIsMaintenance(true);
            window.location.href = '/maintenance';
            return;
          }
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      } finally {
        setChecking(false);
      }
    };

    checkMaintenanceMode();
  }, [pathname]);

  // Show loading state while checking
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    );
  }

  // If maintenance mode is active, don't render children
  if (isMaintenance) {
    return null;
  }

  return <>{children}</>;
}

