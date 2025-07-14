import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage"; // <-- pastikan ini di-import
import PublicationListPage from "./components/PublicationListPage";
import AddPublicationPage from "./components/AddPublicationPage";
import EditPublicationPage from "./components/EditPublicationPage";
import PublicationDetailPage from "./components/PublicationDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Navbar dan Footer hanya ditampilkan jika bukan halaman login/register */}
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />
        {/* Rute lain dibungkus layout */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="p-4 sm:p-6 lg:p-8">
                <Routes>
                  <Route
                    path="/publications"
                    element={
                      <ProtectedRoute>
                        <PublicationListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/publications/add"
                    element={
                      <ProtectedRoute>
                        <AddPublicationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/publications/edit/:id"
                    element={
                      <ProtectedRoute>
                        <EditPublicationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/publications/:id/detail"
                    element={
                      <ProtectedRoute>
                        <PublicationDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/publications" replace />} />
                  <Route path="*" element={<Navigate to="/publications" replace />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}
