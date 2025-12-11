import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider"; // AuthProvider को इम्पोर्ट करें

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";

// Public pages
import Home from "./pages/public/Home";
import BlogList from "./pages/public/BlogList";
import BlogPostView from "./pages/public/BlogPost";
import Contact from "./pages/public/Contact";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import ManageSettings from "./pages/admin/ManageSettings";
import ManageBlogs from "./pages/admin/ManageBlogs";

// Admin और Citizen के लिए रूट्स को प्रोटेक्ट करने के लिए इनका इस्तेमाल करें
import { AdminProtectedRoute, CitizenProtectedRoute } from "./providers/AuthProvider"; 

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

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/:id" element={<BlogPostView />} />
            <Route path="contact" element={<Contact />} />

            {/* Citizen (Only logged-in citizens can access) */}
            <Route path="services" element={<CitizenProtectedRoute><Services /></CitizenProtectedRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<ManageSettings />} />
            <Route path="blogs" element={<ManageBlogs />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
