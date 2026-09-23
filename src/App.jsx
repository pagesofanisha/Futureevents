import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

import VendorProfilePage from "./pages/VendorProfilePage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

// Protected Route Component for Admin Dashboard
function ProtectedAdminRoute({ children }) {
  const { isAdminLoggedIn } = useAuth();
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Global Error Boundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-xs text-gray-500 mb-4">{this.state.error?.message || "Please refresh the page."}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#E91E63] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DataProvider>
          <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Vendor Profile Page */}
              <Route path="/" element={<VendorProfilePage />} />
              <Route path="/album/:albumId" element={<AlbumDetailPage />} />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Management Dashboard */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          </AuthProvider>
        </DataProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
