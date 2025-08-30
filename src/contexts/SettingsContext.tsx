import React, { createContext, useContext, ReactNode } from 'react';
import { useSystemSettings, useCompanySettings, useUserPreferences, useNotificationSettings } from '@/hooks/useSettings';
import type { SettingsContextType } from '@/types/settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const {
    settings: systemSettings,
    loading: systemLoading,
    error: systemError,
    updateSetting: updateSystemSetting
  } = useSystemSettings();

  const {
    settings: companySettings,
    loading: companyLoading,
    error: companyError,
    updateSettings: updateCompanySettings
  } = useCompanySettings();

  const {
    preferences: userPreferences,
    loading: preferencesLoading,
    error: preferencesError,
    updatePreferences: updateUserPreferences
  } = useUserPreferences();

  const {
    settings: notificationSettings,
    loading: notificationLoading,
    error: notificationError,
    updateSettings: updateNotificationSettings
  } = useNotificationSettings();

  const loading = systemLoading || companyLoading || preferencesLoading || notificationLoading;
  const error = systemError || companyError || preferencesError || notificationError;

  const contextValue: SettingsContextType = {
    systemSettings,
    companySettings,
    userPreferences,
    notificationSettings,
    updateSystemSetting,
    updateCompanySettings,
    updateUserPreferences,
    updateNotificationSettings,
    loading,
    error
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};