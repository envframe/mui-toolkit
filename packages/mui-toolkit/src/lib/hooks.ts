import { useContext, useState, useTransition } from 'react';
import { ThemeSettingsContext } from './provider';
import {  ThemeOptions } from '@mui/material';
 


export function useThemeSettings() {
  const _themeOptions = useContext(ThemeSettingsContext);

  if (!_themeOptions) {
    throw new Error('[useThemeSettings] must be used within [ThemeSettingsProvider]');
  }

  const [themeOptions, updateTheme] = useState(_themeOptions);
  const [pending, startTransition] = useTransition()

  const dispatch = (options: ThemeOptions) => startTransition(() => updateTheme(prev =>  ({  ...prev, ...options })));


  return [themeOptions, dispatch, pending] as const
}

