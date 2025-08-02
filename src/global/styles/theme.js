// ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { COLORS } from './index'; // Import color scheme definitions

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme() || 'light');

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || 'light');
    });
    return () => listener.remove();
  }, []);

  const themeColors = COLORS[theme];

  return (
    <ThemeContext.Provider value={{ theme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);