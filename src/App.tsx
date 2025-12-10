import React from "react";
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";

// Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";

// Guards
import { AdminProtectedRoute, CitizenProtectedRoute } from "./providers/AuthProvider";

// Pages
import Home from "./pages/public/Home";
import BlogList from "./pages/public/BlogList";
import BlogPostView from "./pages/public/BlogPost";
import Contact from "./pages/public/Contact";
import Services from "./pages/public/Services";
import Schemes from "./pages/public/Schemes";
import Tenders from "./pages/public/Tenders";
import TaxList from "./pages/public/TaxList";
import Gallery from "./pages/public/Gallery";

import Dashboard from "./pages/admin/Dashboard";
import ManageSettings from "./pages/admin/ManageSettings";
import ManageTeam from "./pages/admin/ManageTeam";
import ManageBlogs from "./pages/admin/ManageBlogs";

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/:id" element={<BlogPostView />} />
            <Route path="contact" element={<Contact />} />

            <Route path="services" element={<CitizenProtectedRoute><Services /></CitizenProtectedRoute>} />
            <Route path="schemes" element={<CitizenProtectedRoute><Schemes /></CitizenProtectedRoute>} />
            <Route path="tenders" element={<CitizenProtectedRoute><Tenders /></CitizenProtectedRoute>} />
            <Route path="tax-list" element={<CitizenProtectedRoute><TaxList /></CitizenProtectedRoute>} />
            <Route path="gallery" element={<CitizenProtectedRoute><Gallery /></CitizenProtectedRoute>} />
          </Route>

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<ManageSettings />} />
            <Route path="team" element={<ManageTeam />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route index element={<Navigate to="/admin/dashboard" />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
