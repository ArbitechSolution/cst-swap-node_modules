import React, { useState } from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { light, dark } from "@pancakeswap-libs/uikit";

const CACHE_KEY = "IS_DARK";

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => null,
});

const ThemeContextProvider: React.FC = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const isDarkUserSetting = localStorage.getItem(CACHE_KEY);
    return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false;
  });
  console.log(dark);
  const _dark = { ...dark };
  const _light = { ...light };
  _dark.colors.primary = "#272674";
  _dark.colors.secondary = "#1a202c";
  _dark.colors.textSubtle = "#fff";
  _dark.colors.failure = "#272674";
  _dark.colors.contrast = "#272674";
  _dark.colors.input = "#4a5568";
  _dark.card.background = "#1a202c";
  _dark.nav.background = "#171798";
  _dark.colors.invertedContrast = "#4a5568";
  _dark.colors.background = "#4a5568";
  _dark.colors.tertiary = "#1a202c";

  _light.colors.failure = "#272674";
  _light.colors.primary = "#272674";
  _light.colors.secondary = "#1a202c";
  _light.colors.textSubtle = "#fff";
  _light.colors.contrast = "#272674";
  _light.colors.input = "#4a5568";
  _light.colors.text = "#fff";
  _light.card.background = "#1a202c";
  _light.nav.background = "#171798";
  _light.colors.invertedContrast = "#4a5568";
  _light.colors.background = "#4a5568";
  _light.colors.tertiary = "#1a202c";

  console.log({ _light, _dark });
  const toggleTheme = () => {
    setIsDark((prevState: any) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(!prevState));
      return !prevState;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SCThemeProvider theme={isDark ? _dark : _light}>
        {children}
      </SCThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
