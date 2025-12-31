import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationContextType {
  history: string[];
  goBack: () => void;
  canGoBack: boolean;
  currentPath: string;
  breadcrumbs: { path: string; label: string }[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const HISTORY_KEY = 'nav_history';
const MAX_HISTORY = 10;

// Map paths to readable labels
const pathLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/projects': 'Projects',
  '/admin/clients': 'Clients',
  '/admin/labours': 'Labours',
  '/admin/resources': 'Resources',
  '/admin/storage': 'Storage',
  '/admin/settings': 'Settings',
};

const getLabel = (path: string): string => {
  // Check exact match first
  if (pathLabels[path]) return pathLabels[path];
  
  // Check for detail pages
  if (path.includes('/admin/projects/')) return 'Project Details';
  if (path.includes('/admin/clients/')) return 'Client Details';
  if (path.includes('/admin/labours/')) return 'Labour Details';
  
  return 'Page';
};

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [history, setHistory] = useState<string[]>(() => {
    const stored = sessionStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Track navigation
  useEffect(() => {
    const currentPath = location.pathname;
    
    setHistory(prev => {
      // Don't add duplicates for the same page
      if (prev[prev.length - 1] === currentPath) return prev;
      
      // Don't track login page
      if (currentPath === '/login' || currentPath === '/') return prev;
      
      const newHistory = [...prev, currentPath].slice(-MAX_HISTORY);
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, [location.pathname]);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      // Get the previous page (not the current one)
      const newHistory = history.slice(0, -1);
      const previousPath = newHistory[newHistory.length - 1] || '/admin';
      
      setHistory(newHistory);
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      navigate(previousPath);
    } else {
      // Fallback to dashboard
      navigate('/admin');
    }
  }, [history, navigate]);

  const canGoBack = history.length > 1 || location.pathname !== '/admin';

  // Generate breadcrumbs from current path
  const breadcrumbs = React.useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const crumbs: { path: string; label: string }[] = [];
    
    let currentPath = '';
    for (const part of parts) {
      currentPath += `/${part}`;
      crumbs.push({
        path: currentPath,
        label: getLabel(currentPath),
      });
    }
    
    return crumbs;
  }, [location.pathname]);

  return (
    <NavigationContext.Provider
      value={{
        history,
        goBack,
        canGoBack,
        currentPath: location.pathname,
        breadcrumbs,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
