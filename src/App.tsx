import React from "react";
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";

import { AuthProvider } from "./providers/AuthProvider";

// Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";

// Guards
import { AdminProtectedRoute, CitizenProtectedRoute } from "./providers/AuthProvider";

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

            {/* ✅ Citizen (Firebase Login required) */}
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

import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/public/Home';
import BlogList from './pages/public/BlogList';
import BlogPostView from './pages/public/BlogPost';
import Tenders from './pages/public/Tenders';
import TaxList from './pages/public/TaxList'; 
import Services from './pages/public/Services'; 
import Gallery from './pages/public/Gallery'; 
import Schemes from './pages/public/Schemes'; 
import Contact from './pages/public/Contact'; 
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageBlogs from './pages/admin/ManageBlogs';
import ManageSettings from './pages/admin/ManageSettings';
import ManageTeam from './pages/admin/ManageTeam';
import ManageMeetings from './pages/admin/ManageMeetings';
import ManageSchemes from './pages/admin/ManageSchemes';
import ManageTenders from './pages/admin/ManageTenders';
import ManageNotices from './pages/admin/ManageNotices';
import ManageTaxes from './pages/admin/ManageTaxes'; 
import ManageProjects from './pages/admin/ManageProjects'; 
import ManageGallery from './pages/admin/ManageGallery'; 
import ManageServices from './pages/admin/ManageServices'; 
import ManageGoogleAuth from './pages/admin/ManageGoogleAuth'; // Added
import { AuthProvider, useAuth } from "./providers/AuthProvider";

const PublicLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Admin Route Protection
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// Public Citizen Route Protection (Google Auth)
const CitizenProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    const user = getPublicUser();
    if (!user) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
                    <p className="text-gray-600 mb-6">You must be logged in as a citizen to view this page.</p>
                    <p className="text-sm text-blue-600">Please click the "Citizen Login" button in the navigation bar.</p>
                </div>
            </div>
        );
    }
    return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          {/* Open Routes */}
          <Route index element={<Home />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:id" element={<BlogPostView />} />
          <Route path="contact" element={<Contact />} />

          {/* Restricted Citizen Routes */}
          <Route path="services" element={<CitizenProtectedRoute><Services /></CitizenProtectedRoute>} />
          <Route path="schemes" element={<CitizenProtectedRoute><Schemes /></CitizenProtectedRoute>} />
          <Route path="tenders" element={<CitizenProtectedRoute><Tenders /></CitizenProtectedRoute>} />
          <Route path="tax-list" element={<CitizenProtectedRoute><TaxList /></CitizenProtectedRoute>} />
          <Route path="gallery" element={<CitizenProtectedRoute><Gallery /></CitizenProtectedRoute>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="google-auth" element={<ManageGoogleAuth />} /> {/* Added */}
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
  );
};

export default App;
