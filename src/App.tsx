import React from "react";
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { AdminProtectedRoute, CitizenProtectedRoute } from "./providers/AuthProvider";

// Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";

// Public pages
import Home from "./pages/public/Home";
import BlogList from "./pages/public/BlogList";
import BlogPostView from "./pages/public/BlogPost";
import Contact from "./pages/public/Contact";
import Services from "./pages/public/Services";
import Schemes from "./pages/public/Schemes";
import Tenders from "./pages/public/Tenders";
import TaxList from "./pages/public/TaxList";
import Gallery from "./pages/public/Gallery";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import ManageSettings from "./pages/admin/ManageSettings";
import ManageTeam from "./pages/admin/ManageTeam";
import ManageBlogs from "./pages/admin/ManageBlogs";
import ManageMeetings from "./pages/admin/ManageMeetings";
import ManageSchemes from "./pages/admin/ManageSchemes";
import ManageNotices from "./pages/admin/ManageNotices";
import ManageTenders from "./pages/admin/ManageTenders";
import ManageTaxes from "./pages/admin/ManageTaxes";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageGallery from "./pages/admin/ManageGallery";
import ManageServices from "./pages/admin/ManageServices";

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

          {/* ✅ PUBLIC */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/:id" element={<BlogPostView />} />
            <Route path="contact" element={<Contact />} />

            {/* ✅ Citizen */}
            <Route path="services" element={<CitizenProtectedRoute><Services /></CitizenProtectedRoute>} />
            <Route path="schemes" element={<CitizenProtectedRoute><Schemes /></CitizenProtectedRoute>} />
            <Route path="tenders" element={<CitizenProtectedRoute><Tenders /></CitizenProtectedRoute>} />
            <Route path="tax-list" element={<CitizenProtectedRoute><TaxList /></CitizenProtectedRoute>} />
            <Route path="gallery" element={<CitizenProtectedRoute><Gallery /></CitizenProtectedRoute>} />
          </Route>

          {/* ✅ ADMIN */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<ManageSettings />} />
            <Route path="team" element={<ManageTeam />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="meetings" element={<ManageMeetings />} />
            <Route path="schemes" element={<ManageSchemes />} />
            <Route path="notices" element={<ManageNotices />} />
            <Route path="tenders" element={<ManageTenders />} />
            <Route path="taxes" element={<ManageTaxes />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="services" element={<ManageServices />} />
            <Route index element={<Navigate to="/admin/dashboard" />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
