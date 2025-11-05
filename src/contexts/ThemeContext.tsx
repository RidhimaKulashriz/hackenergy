import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'galaxy' | 'sun';
type FontSize = 'small' | 'default' | 'large';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  showOnscreenKeyboard: boolean;
  setShowOnscreenKeyboard: (show: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('collabforge-theme');
    return (saved === 'galaxy' || saved === 'sun') ? saved : 'galaxy';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem('collabforge-font-size');
    return (saved === 'small' || saved === 'default' || saved === 'large') ? saved : 'default';
  });

  const [reduceMotion, setReduceMotionState] = useState<boolean>(() => {
    const saved = localStorage.getItem('collabforge-reduce-motion');
    if (saved !== null) return saved === 'true';
    // Check system preference
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [showOnscreenKeyboard, setShowOnscreenKeyboardState] = useState<boolean>(() => {
    const saved = localStorage.getItem('collabforge-onscreen-keyboard');
    return saved === 'true';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('collabforge-theme', newTheme);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('collabforge-font-size', size);
  };

  const setReduceMotion = (reduce: boolean) => {
    setReduceMotionState(reduce);
    localStorage.setItem('collabforge-reduce-motion', String(reduce));
  };

  const setShowOnscreenKeyboard = (show: boolean) => {
    setShowOnscreenKeyboardState(show);
    localStorage.setItem('collabforge-onscreen-keyboard', String(show));
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    root.setAttribute('data-theme', theme);
    
    // Apply font size
    root.setAttribute('data-font-size', fontSize);
    
    // Apply reduce motion
    if (reduceMotion) {
      root.setAttribute('data-reduce-motion', 'true');
    } else {
      root.removeAttribute('data-reduce-motion');
    }
  }, [theme, fontSize, reduceMotion]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        reduceMotion,
        setReduceMotion,
        showOnscreenKeyboard,
        setShowOnscreenKeyboard,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
