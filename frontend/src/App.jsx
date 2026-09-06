import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import DashboardPage from './pages/DashboardPage';
import SchemaPage from './pages/SchemaPage';
import RelationshipsPage from './pages/RelationshipsPage';
import SqlLabPage from './pages/SqlLabPage';
import OperationsPage from './pages/OperationsPage';
import LearningPage from './pages/LearningPage';

export default function App() {
  return (
    <DatabaseProvider>
      <Router>
        <div className="flex min-h-screen bg-navy-950 text-slate-100 selection:bg-blue-600 selection:text-white">
          {/* Left Navigation Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar />
            
            <main className="flex-1 overflow-y-auto pb-12">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/schema" element={<SchemaPage />} />
                <Route path="/relationships" element={<RelationshipsPage />} />
                <Route path="/sql" element={<SqlLabPage />} />
                <Route path="/operations" element={<OperationsPage />} />
                <Route path="/learning" element={<LearningPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </DatabaseProvider>
  );
}
