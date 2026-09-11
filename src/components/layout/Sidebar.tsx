import React from 'react';
import {
  LayoutDashboard,
  Code2,
  Share2,
  TrendingUp,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Moon,
  Sun,
  FileSpreadsheet,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppModule } from '../../types';
import { SinGroupLogo } from '../common/SinGroupLogo';

export const Sidebar: React.FC = () => {
  const {
    currentModule,
    setCurrentModule,
    projects,
    leads,
    students,
    campaigns,
    payrollEmployees,
    theme,
    toggleTheme,
    setIsExportModalOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useApp();

  const activeProjectsCount = projects.filter((p) => p.status !== 'Deployed').length;
  const activeLeadsCount = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost').length;
  const activeStudentsCount = students.length;
  const activeCampaignsCount = campaigns.filter((c) => c.campaignStatus === 'Active').length;

  const navigationItems: {
    id: AppModule;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'İcraçı İcmal',
      description: 'Qlobal KPI-lar və bildirişlər',
      icon: LayoutDashboard,
    },
    {
      id: 'dev-hub',
      label: 'Proqramlaşdırma Mərkəzi',
      description: 'Veb, ERP/CRM, Tətbiqlər',
      icon: Code2,
      badge: activeProjectsCount,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    {
      id: 'smm',
      label: 'SMM və Rəqəmsal Media',
      description: 'Kampaniyalar və iş axını',
      icon: Share2,
      badge: activeCampaignsCount,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'sales',
      label: 'Satış CRM və Qıf',
      description: 'Müştərilər və fəaliyyət',
      icon: TrendingUp,
      badge: activeLeadsCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'academy',
      label: 'Tədris və Akademiya',
      description: 'SMM, Data, AI kursları',
      icon: GraduationCap,
      badge: activeStudentsCount,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    {
      id: 'payroll',
      label: 'Əməkhaqqı & Faiz',
      description: '20% Satış, 10% Veb, 40% Müəllim',
      icon: Wallet,
      badge: payrollEmployees.length,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`relative flex flex-col shrink-0 transition-all duration-300 ease-in-out border-r z-30 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } ${
        theme === 'dark'
          ? 'bg-slate-950/95 border-slate-800/80 text-slate-200'
          : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}
    >
      {/* Sidebar Header with Sin Group Medya Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80 min-h-[73px]">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <SinGroupLogo variant="full" size="md" showSubtitle={true} />
          </div>
        ) : (
          <div className="mx-auto" title="Sin Group Medya">
            <SinGroupLogo variant="icon" size="sm" />
          </div>
        )}

        <button
          id="collapse-sidebar-btn"
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          title={sidebarCollapsed ? 'Menyunu genişləndir' : 'Menyunu yığ'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Agency Status Tag in Expanded Mode */}
      {!sidebarCollapsed && (
        <div className="mx-4 mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-200">Sin Group HQ Bakı</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">v4.2 Korporativ</span>
        </div>
      )}

      {/* Navigation Modules */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1">
          {!sidebarCollapsed ? (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Əsas Modullar
            </span>
          ) : (
            <div className="h-2" />
          )}
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setCurrentModule(item.id)}
              title={sidebarCollapsed ? `${item.label} (${item.description})` : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group relative ${
                isActive
                  ? 'bg-rose-600/15 text-white font-semibold border border-rose-500/40 shadow-sm shadow-rose-950/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-rose-500" />
              )}
              <div
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate font-medium">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              )}

              {sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}

        {/* Quick Tools & Reports Button */}
        <div className="pt-3 mt-3 border-t border-slate-800/80">
          <button
            id="open-export-report-btn"
            onClick={() => setIsExportModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-slate-800/60 transition-all text-left"
            title="Aylıq İcraçı Hesabatı İxrac Et"
          >
            <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold block text-slate-200">Hesabatların İxracı</span>
                <span className="text-[10px] text-slate-400">PDF / CSV / Müştəri Sənədi</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Footer: User and Theme toggle */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/50">
        {!sidebarCollapsed && (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center font-bold text-white text-xs shadow-inner shrink-0">
              SG
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-200 truncate">Sin Group Rəhbərlik</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">singroup0211@gmail.com</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-1 pt-1">
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className={`flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
              sidebarCollapsed ? 'w-full' : 'flex-1'
            } text-slate-400 hover:text-white hover:bg-slate-800`}
            title={theme === 'dark' ? 'İşıqlı rejimə keç' : 'Qaranlıq rejimə keç'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                {!sidebarCollapsed && <span>İşıqlı Rejim</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                {!sidebarCollapsed && <span>Qaranlıq Rejim</span>}
              </>
            )}
          </button>

          {!sidebarCollapsed && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono px-2 py-1">
              <Zap className="w-3 h-3 text-rose-400" />
              <span>Sinxron</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
