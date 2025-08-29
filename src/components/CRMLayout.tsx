import { SidebarProvider } from "@/components/ui/sidebar";
import { CRMSidebar } from "./CRMSidebar";
import { ReactNode } from "react";

interface CRMLayoutProps {
  children: ReactNode;
}

export function CRMLayout({ children }: CRMLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <CRMSidebar />
        <main className="flex-1 overflow-hidden bg-dashboard-bg">
          <div className="h-full overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}