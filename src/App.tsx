import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { OfflineIndicator } from "@/components/Layout/OfflineIndicator";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import Courses from "./pages/Courses";
import EducationReports from "./pages/EducationReports";
import Fees from "./pages/Fees";
import Reports from "./pages/Reports";
import Expenses from "./pages/Expenses";
import UserRoles from "./pages/UserRoles";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <OfflineIndicator />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex min-h-screen bg-background">
                    <Sidebar />
                    <div className="flex-1 md:pl-64">
                      <Header />
                      <main className="mt-16 md:mt-20 p-4 md:p-6 lg:p-8">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/students" element={<Students />} />
                          <Route path="/teachers" element={<Teachers />} />
                          <Route path="/classes" element={<Classes />} />
                          <Route path="/attendance" element={<Attendance />} />
                          <Route path="/courses" element={<Courses />} />
                          <Route path="/education-reports" element={<EducationReports />} />
                          <Route path="/fees" element={<Fees />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/expenses" element={<Expenses />} />
                          <Route path="/user-roles" element={<UserRoles />} />
                          <Route path="/profile" element={<Profile />} />
                          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
