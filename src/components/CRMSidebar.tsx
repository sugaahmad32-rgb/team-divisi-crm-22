import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { BarChart3, Users, Calendar, Settings, Building2, UserCheck, TrendingUp, Phone, Package, Globe, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { SwitchUserButton } from "@/components/SwitchUserButton";
import { useSwitchUser } from "@/hooks/useSwitchUser";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Sources', href: '/sources', icon: Globe },
  { name: 'Follow-ups', href: '/followups', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
];

const adminNavigation = [
  { name: 'Users', href: '/users', icon: UserCheck },
  { name: 'Divisions', href: '/divisions', icon: Building2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function CRMSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut, hasRole } = useAuth();
  const { isImpersonating } = useSwitchUser();
  const showAdminMenu = hasRole('superadmin') || hasRole('owner') || hasRole('manager');
  
  // Debug logging
  console.log('🎯 Sidebar Debug - Profile:', profile);
  console.log('🎯 Sidebar Debug - hasRole(superadmin):', hasRole('superadmin'));
  console.log('🎯 Sidebar Debug - hasRole(owner):', hasRole('owner'));
  console.log('🎯 Sidebar Debug - hasRole(manager):', hasRole('manager'));
  console.log('🎯 Sidebar Debug - showAdminMenu:', showAdminMenu);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">Master Plan CRM</h2>
              <div className="flex items-center gap-2">
                <p className="text-xs text-sidebar-foreground/60">
                  {profile?.display_name} • {profile?.role}
                </p>
                {isImpersonating && (
                  <Badge variant="destructive" className="text-xs">
                    Viewing As User
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <SwitchUserButton />
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.href)}
                    isActive={location.pathname === item.href}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showAdminMenu && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      onClick={() => navigate(item.href)}
                      isActive={location.pathname === item.href}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}