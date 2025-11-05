import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { Starfield } from "@/components/background/Starfield";
import { SunBackground } from "@/components/background/SunBackground";
import { useState } from "react";
import Landing from "./pages/Landing";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Showcase from "./pages/Showcase";
import Judge from "./pages/Judge";
import Admin from "./pages/Admin";
import TeamWorkspace from "./pages/TeamWorkspace";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// A wrapper that will show a loading state while auth is initializing
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not logged in and trying to access a protected route, redirect to login
  const isProtectedRoute = [
    '/dashboard',
    '/admin',
    '/judge',
    '/profile'
  ].some(path => location.pathname.startsWith(path));

  if (isProtectedRoute && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <>
      <Starfield />
      <SunBackground />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/events/:slug/teams/:teamId" element={<TeamWorkspace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/judge" element={<Judge />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  // Add future flags for React Router v7
  const [future] = useState({
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router future={future}>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AuthInitializer>
                <AppContent />
              </AuthInitializer>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
