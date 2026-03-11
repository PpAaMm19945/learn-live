import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/parent/Dashboard";
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import ChildPortal from "./pages/learner/ChildPortal";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Logger } from "./lib/Logger";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useUIStore } from "./lib/uiStore";
import { useAuthStore } from "./lib/auth";
import { useEffect } from "react";

Logger.info("[CORE]", "Application booted");
const queryClient = new QueryClient();

const App = () => {
  const setOffline = useUIStore((state) => state.setOffline);
  const { checkSession, isLoading } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

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
