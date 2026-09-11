import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalDashboard } from './components/dashboard/GlobalDashboard';
import { DevHub } from './components/dev/DevHub';
import { SMMSuite } from './components/smm/SMMSuite';
import { SalesCRM } from './components/sales/SalesCRM';
import { AcademyPortal } from './components/academy/AcademyPortal';
import { PayrollModule } from './components/payroll/PayrollModule';
import { ExportModal } from './components/common/ExportModal';
import { QuickCreateModal } from './components/common/QuickCreateModal';

const AppContent: React.FC = () => {
  const { currentModule, sidebarCollapsed, theme } = useApp();
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white ${theme === 'light' ? 'theme-light' : ''}`}>
      {/* Main Layout Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Interactive Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Branded Header with Search, Alerts, Quick Actions */}
          <Header onOpenQuickCreate={() => setIsQuickCreateOpen(true)} />

          {/* Module Dynamic Router Canvas */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              {currentModule === 'dashboard' && <GlobalDashboard />}
              {currentModule === 'dev-hub' && <DevHub />}
              {currentModule === 'smm' && <SMMSuite />}
              {currentModule === 'sales' && <SalesCRM />}
              {currentModule === 'academy' && <AcademyPortal />}
              {currentModule === 'payroll' && <PayrollModule />}
            </div>
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <ExportModal />
      <QuickCreateModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
