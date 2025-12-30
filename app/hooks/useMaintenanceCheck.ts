'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useMaintenanceCheck() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip check for admin routes, API routes, and maintenance page
    if (
      pathname?.startsWith('/admin') ||
      pathname?.startsWith('/api') ||
      pathname?.startsWith('/maintenance') ||
      pathname?.startsWith('/_next')
    ) {
      return;
    }

    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch('/api/admin/maintenance', {
          cache: 'no-store',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.maintenanceMode?.enabled === true) {
            // Use window.location for hard redirect
            window.location.href = '/maintenance';
          }
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      }
    };

    checkMaintenanceMode();

    // Check periodically (every 5 seconds) in case maintenance mode is enabled
    const interval = setInterval(checkMaintenanceMode, 5000);

    return () => clearInterval(interval);
  }, [pathname]);
}




