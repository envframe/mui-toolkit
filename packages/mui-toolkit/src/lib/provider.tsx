'use client';
import * as React from 'react';

import {
  alpha,
  createTheme,
  responsiveFontSizes,
  StyledEngineProvider,
  Theme,
  ThemeOptions,
  ThemeProvider as ThemeProviderBase,
  CssBaseline,
} from '@mui/material';

// import componentsOverride from './overrides';

import { ResponsiveFontSizesOptions } from '@mui/material/styles/responsiveFontSizes';
import { withParent } from './hocs';

export const ThemeSettingsContext = React.createContext<ThemeOptions | undefined>(undefined);

export type CacheProviderOptions = { key: string; prepend: boolean };
export type CacheProviderProps = { options: CacheProviderOptions };
export type ThemeConfig = {
  options?: ThemeOptions;
  args?: object[];
  fontSizeOptions?: ResponsiveFontSizesOptions;
};

export interface ThemeProviderProps {
  children?: React.ReactNode;
  config?: ThemeConfig;
  injectFirst?: boolean;
  enableColorScheme?: boolean;
  CacheProvider?: React.ComponentType<CacheProviderProps>;
  cacheOptions?: CacheProviderOptions;
}

export function ThemeProvider(props: ThemeProviderProps) {
  const {
    children,
    config,
    CacheProvider = React.Fragment,
    cacheOptions = { key: 'css', prepend: true },
    injectFirst = false,
    enableColorScheme = false,
  } = props;

  const { options, args = [], fontSizeOptions } = config || {};

  let theme = createTheme(options, ...args);

  // _theme.components = componentsOverride(_theme);

  theme = responsiveFontSizes(theme, fontSizeOptions);

  const consumer = (themeOptions?: ThemeOptions) => {
    theme = createTheme({ ...options, ...themeOptions });
    return (
      <CacheProvider options={cacheOptions}>
        <StyledEngineProvider injectFirst={injectFirst}>
          <ThemeProviderBase theme={theme}>
            <CssBaseline enableColorScheme={enableColorScheme} />
            {children}
          </ThemeProviderBase>
        </StyledEngineProvider>
      </CacheProvider>
    );
  };

  return (
    <ThemeSettingsContext.Provider value={options}>
      <ThemeSettingsContext.Consumer>{consumer}</ThemeSettingsContext.Consumer>
    </ThemeSettingsContext.Provider>
  );
}

export function withThemeProvider<P extends Record<string, any> = any>(
  component: React.ComponentType<P>,
  parentProps?: ThemeProviderProps,
) {
  return withParent(component, { Parent: ThemeProvider, parentProps });
}
