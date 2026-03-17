import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuthStore } from "@/lib/auth";
import { useLearnerStore } from "@/lib/learnerStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Book, TrendingUp, Settings, LogOut, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Learner {
  id: string;
  name: string;
  band: number;
}

interface FamilyResponse {
  family: { id: string; name: string };
  learners: Learner[];
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { name, email, logout } = useAuthStore();
  const { loadFamily, learners, activeLearnerId, setActiveLearner, hasFamily, isLoading } = useLearnerStore();

  useEffect(() => {
    loadFamily();
  }, [loadFamily]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between px-4 h-[57px] shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <div className="md:hidden font-semibold text-lg flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Learn Live
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              {isLoading ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Skeleton className="h-8 w-[180px] rounded-md" />
                </div>
              ) : hasFamily && learners && learners.length > 0 ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Learner:</span>
                  <Select
                    value={activeLearnerId || ''}
                    onValueChange={(id) => setActiveLearner(id)}
                  >
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Select learner" />
                    </SelectTrigger>
                    <SelectContent>
                      {learners.map(learner => (
                        <SelectItem key={learner.id} value={learner.id}>
                          {learner.name} <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4">Band {learner.band}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {name || email}
                  </div>
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto pb-16 md:pb-0">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/80 backdrop-blur-lg z-50 px-6 py-3 flex justify-between items-center">
            <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-[10px] font-medium">Home</span>
            </NavLink>
            <NavLink to="/glossary" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <Book className="h-5 w-5" />
              <span className="text-[10px] font-medium">Glossary</span>
            </NavLink>
            <NavLink to="/progress" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <TrendingUp className="h-5 w-5" />
              <span className="text-[10px] font-medium">Progress</span>
            </NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-col items-center gap-1 text-muted-foreground outline-none">
                <Settings className="h-5 w-5" />
                <span className="text-[10px] font-medium">Profile</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mb-2">
                {isLoading ? (
                   <div className="p-2 border-b border-border mb-1">
                     <Skeleton className="h-8 w-full rounded-md" />
                   </div>
                ) : hasFamily && learners && learners.length > 0 ? (
                  <div className="p-2 border-b border-border mb-1">
                    <p className="text-xs text-muted-foreground mb-2">Active Learner</p>
                    <Select
                      value={activeLearnerId || ''}
                      onValueChange={(id) => setActiveLearner(id)}
                    >
                      <SelectTrigger className="w-full h-8">
                        <SelectValue placeholder="Select learner" />
                      </SelectTrigger>
                      <SelectContent>
                        {learners.map(learner => (
                          <SelectItem key={learner.id} value={learner.id}>
                            {learner.name} <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4">Band {learner.band}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
