import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { BarChart3, Users, Calendar, Settings, Building2, UserCheck, TrendingUp, Phone } from "lucide-react";
import { currentUser } from "@/data/mockData";
import { useNavigate, useLocation } from "react-router-dom";

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Customers', href: '/customers', icon: Users },
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
  const showAdminMenu = ['superadmin', 'owner', 'manager'].includes(currentUser.role);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Master Plan CRM</h2>
            <p className="text-xs text-sidebar-foreground/60">{currentUser.name} • {currentUser.role}</p>
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