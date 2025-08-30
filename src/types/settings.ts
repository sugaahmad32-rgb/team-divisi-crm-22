export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CompanySetting {
  id: string;
  company_name: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  company_website?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  email_notifications: boolean;
  push_notifications: boolean;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NotificationSetting {
  id: string;
  user_id: string;
  email_on_new_customer: boolean;
  email_on_interaction_due: boolean;
  email_on_status_change: boolean;
  email_on_assignment: boolean;
  daily_digest: boolean;
  weekly_report: boolean;
  created_at: string;
  updated_at: string;
}

export interface SettingsContextType {
  systemSettings: SystemSetting[];
  companySettings: CompanySetting | null;
  userPreferences: UserPreference | null;
  notificationSettings: NotificationSetting | null;
  updateSystemSetting: (key: string, value: any) => Promise<void>;
  updateCompanySettings: (data: Partial<CompanySetting>) => Promise<void>;
  updateUserPreferences: (data: Partial<UserPreference>) => Promise<void>;
  updateNotificationSettings: (data: Partial<NotificationSetting>) => Promise<void>;
  loading: boolean;
  error: string | null;
}