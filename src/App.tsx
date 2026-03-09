import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import ProfileSelect from "./pages/ProfileSelect";
import Dashboard from "./pages/parent/Dashboard";
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import ChildPortal from "./pages/learner/ChildPortal";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Logger } from "./lib/Logger";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useUIStore } from "./lib/uiStore";
import { useEffect } from "react";

Logger.info("[CORE]", "Application booted");
const queryClient = new QueryClient();

const App = () => {
  const setOffline = useUIStore((state) => state.setOffline);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOffline]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/join" element={<Onboarding />} />
              <Route path="/profiles" element={<ProfileSelect />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['parent']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learner/:learnerId"
                element={
                  <ProtectedRoute allowedRoles={['learner']}>
                    <LearnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/child/:learnerId"
                element={
                  <ProtectedRoute allowedRoles={['learner']}>
                    <ChildPortal />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
