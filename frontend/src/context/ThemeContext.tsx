import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// 1. Define the Context Type
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

// Default context with dummy functions
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. The Provider Component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Centralized state logic
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // CRITICAL: Effect to apply the class to the document body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]); // Only runs when theme changes

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Custom Hook for easy consumption
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};