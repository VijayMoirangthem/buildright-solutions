import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { StorageProvider } from "@/contexts/StorageContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ClientsPage from "./pages/admin/ClientsPage";
import ClientDetailPage from "./pages/admin/ClientDetailPage";
import LaboursPage from "./pages/admin/LaboursPage";
import LabourDetailPage from "./pages/admin/LabourDetailPage";
import ResourcesPage from "./pages/admin/ResourcesPage";
import ProjectsPage from "./pages/admin/ProjectsPage";
import ProjectDetailPage from "./pages/admin/ProjectDetailPage";
import SettingsPage from "./pages/admin/SettingsPage";
import StoragePage from "./pages/admin/StoragePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <StorageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <NavigationProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="projects/:id" element={<ProjectDetailPage />} />
                    <Route path="clients" element={<ClientsPage />} />
                    <Route path="clients/:id" element={<ClientDetailPage />} />
                    <Route path="labours" element={<LaboursPage />} />
                    <Route path="labours/:id" element={<LabourDetailPage />} />
                    <Route path="resources" element={<ResourcesPage />} />
                    <Route path="storage" element={<StoragePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </NavigationProvider>
            </BrowserRouter>
          </TooltipProvider>
        </StorageProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
