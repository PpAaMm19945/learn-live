import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { IconLayoutDashboard, IconBook, IconTrendingUp, IconShieldLock, IconLogout } from "@tabler/icons-react";
import { useIsAdmin, useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const { isAdmin } = useIsAdmin();
  const { logout } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Signed out' });
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" className="hidden md:flex border-r-0 bg-background text-sidebar-foreground">
      <SidebarHeader className="p-4 border-b border-border/30 flex items-center justify-center h-[57px]">
        <div className="flex items-center gap-2 overflow-hidden w-full group-data-[state=collapsed]:justify-center">
          <IconBook className="h-6 w-6 text-primary shrink-0" />
          <span className="font-display text-xl truncate group-data-[state=collapsed]:hidden">Learn Live</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full p-2 rounded-md transition-colors ${isActive ? 'border-l-4 border-primary text-foreground font-medium pl-3' : 'hover:bg-accent/30 text-muted-foreground hover:text-foreground'}`
                }
              >
                <IconLayoutDashboard className="h-5 w-5 shrink-0" />
                <span className="group-data-[state=collapsed]:hidden">Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Glossary">
              <NavLink
                to="/glossary"
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full p-2 rounded-md transition-colors ${isActive ? 'border-l-4 border-primary text-foreground font-medium pl-3' : 'hover:bg-accent/30 text-muted-foreground hover:text-foreground'}`
                }
              >
                <IconBook className="h-5 w-5 shrink-0" />
                <span className="group-data-[state=collapsed]:hidden">Glossary</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Progress">
              <NavLink
                to="/progress"
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full p-2 rounded-md transition-colors ${isActive ? 'border-l-4 border-primary text-foreground font-medium pl-3' : 'hover:bg-accent/30 text-muted-foreground hover:text-foreground'}`
                }
              >
                <IconTrendingUp className="h-5 w-5 shrink-0" />
                <span className="group-data-[state=collapsed]:hidden">Progress</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Admin">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full p-2 rounded-md transition-colors ${isActive ? 'border-l-4 border-primary text-foreground font-medium pl-3' : 'hover:bg-accent/30 text-muted-foreground hover:text-foreground'}`
                  }
                >
                  <IconShieldLock className="h-5 w-5 shrink-0" />
                  <span className="group-data-[state=collapsed]:hidden">Admin</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-border/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sign Out" className="flex items-center gap-3 w-full p-2 rounded-md transition-colors hover:bg-accent/30 text-muted-foreground hover:text-foreground">
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="group-data-[state=collapsed]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
