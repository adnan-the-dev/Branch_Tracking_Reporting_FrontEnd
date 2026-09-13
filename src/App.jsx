import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Branches from './pages/Branches.jsx';
import BranchForm from './pages/BranchForm.jsx';
import BranchDetail from './pages/BranchDetail.jsx';
import Reports from './pages/Reports.jsx';
import ReportDetail from './pages/ReportDetail.jsx';
import Settings from './pages/Settings.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/branches/new" element={<BranchForm />} />
                <Route path="/branches/:id" element={<BranchDetail />} />
                <Route path="/branches/:id/edit" element={<BranchForm />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/reports/:id" element={<ReportDetail />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
