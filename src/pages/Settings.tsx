import React, { useState } from 'react';
import { CRMLayout } from '@/components/CRMLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Building2, Users, Bell, Shield, Database, Moon, Sun, Monitor, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const {
    systemSettings,
    companySettings,
    userPreferences,
    notificationSettings,
    updateSystemSetting,
    updateCompanySettings,
    updateUserPreferences,
    updateNotificationSettings,
    loading
  } = useSettings();

  const [companyForm, setCompanyForm] = useState({
    company_name: companySettings?.company_name || '',
    company_address: companySettings?.company_address || '',
    company_phone: companySettings?.company_phone || '',
    company_email: companySettings?.company_email || '',
    company_website: companySettings?.company_website || ''
  });

  React.useEffect(() => {
    if (companySettings) {
      setCompanyForm({
        company_name: companySettings.company_name || '',
        company_address: companySettings.company_address || '',
        company_phone: companySettings.company_phone || '',
        company_email: companySettings.company_email || '',
        company_website: companySettings.company_website || ''
      });
    }
  }, [companySettings]);

  const getSystemSetting = (key: string) => {
    const setting = systemSettings.find(s => s.key === key);
    return setting?.value;
  };

  if (loading) {
    return (
      <CRMLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading settings...</div>
        </div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <SettingsIcon className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="company">
              <Building2 className="w-4 h-4 mr-2" />
              Company
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your general application preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Theme</h4>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('system')}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details and branding.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input 
                      id="company-name" 
                      value={companyForm.company_name}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, company_name: e.target.value }))}
                    />
                  </div>
                  <Button onClick={() => updateCompanySettings(companyForm)} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Company Information
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CRMLayout>
  );
}