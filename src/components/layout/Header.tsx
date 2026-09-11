import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Clock,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SinGroupLogo } from '../common/SinGroupLogo';

interface HeaderProps {
  onOpenQuickCreate: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickCreate }) => {
  const {
    currentModule,
    searchQuery,
    setSearchQuery,
    urgentAlerts,
    dismissAlert,
    setCurrentModule,
    setIsExportModalOpen,
    theme,
  } = useApp();

  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  // Module titles and descriptions
  const moduleMeta = {
    dashboard: {
      title: 'Qlobal İcraçı İcmal',
      subtitle: 'Texnologiya, SMM və Akademiya üzrə real vaxt fəaliyyət analitikası',
      tag: 'İcraçı Nəzarət',
    },
    'dev-hub': {
      title: 'Proqramlaşdırma və Rəqəmsal İnkişaf Mərkəzi',
      subtitle: 'Veb, xüsusi ERP/CRM və mobil tətbiqlər üçün Agile Kanban və texniki tapşırıqlar',
      tag: 'Mühəndislik Bölməsi',
    },
    smm: {
      title: 'SMM və Rəqəmsal Marketinq İdarəetməsi',
      subtitle: 'Çoxsaylı brend paketləri, kvota izləyiciləri və kontent iş axını',
      tag: 'Kreativ Media',
    },
    sales: {
      title: 'Satış CRM və Müştəri Qıfı',
      subtitle: '5-Mərhələli satış xətti, menecer konversiyası və müştəri əlaqələri',
      tag: 'Gəlir Mühərriki',
    },
    academy: {
      title: 'Tədris və Akademiya Portalı',
      subtitle: 'SMM, Data Analitika və AI istiqamətləri üzrə tələbə və qrup idarəetməsi',
      tag: 'Təhsil Mərkəzi',
    },
    payroll: {
      title: 'Əməkhaqqı Fondu və Faiz Hesablanması',
      subtitle: 'Satış (20%), Veb komandası (10% Front / 10% Back) və Müəllimlər (40%) üzrə avtomatlaşdırılmış faiz bölgüsü',
      tag: 'Maliyyə & Kompensasiya',
    },
  }[currentModule];

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-20 px-6 py-3.5 border-b transition-colors ${
        theme === 'dark'
          ? 'bg-slate-950/80 backdrop-blur-md border-slate-800/80'
          : 'bg-white/90 backdrop-blur-md border-slate-200'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Module Title with Sin Group Logo Branding */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Header Brand Badge with the pixel star emblem */}
          <div className="hidden sm:flex items-center p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm shrink-0">
            <SinGroupLogo variant="icon" size="sm" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 font-mono">
                Sin Group Medya
              </span>
              <span className="text-slate-600 dark:text-slate-400">•</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {moduleMeta.tag}
              </span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
              {moduleMeta.title}
            </h1>
          </div>
        </div>

        {/* Action Controls: Search, Quick Add, Alerts, Export */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Search bar */}
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Layihə, müştəri, brend axtarın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-900/60 border border-slate-800 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Create Button */}
          <button
            id="quick-create-btn"
            onClick={onOpenQuickCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md shadow-rose-900/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Qeyd Əlavə Et</span>
          </button>

          {/* Export Report */}
          <button
            id="header-export-btn"
            onClick={() => setIsExportModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
            title="Aylıq rəhbərlik hesabatını yüklə"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>İxrac Et</span>
          </button>

          {/* Urgent Alerts Notification Dropdown */}
          <div className="relative">
            <button
              id="alerts-bell-btn"
              onClick={() => setShowAlertsDropdown((prev) => !prev)}
              className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Təcili Bildirişlər və Tapşırıqlar"
            >
              <Bell className="w-4 h-4" />
              {urgentAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {urgentAlerts.length}
                </span>
              )}
            </button>

            {showAlertsDropdown && (
              <div
                id="urgent-alerts-menu"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-xs text-slate-200"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-bold text-sm text-white">Təcili Bildirişlər</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      {urgentAlerts.length} Aktiv
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAlertsDropdown(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {urgentAlerts.length === 0 ? (
                    <div className="py-6 text-center text-slate-400">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="font-semibold text-slate-300">Bütün bildirişlər həll olundu!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Diqqət tələb edən kritik məsələ yoxdur.</p>
                    </div>
                  ) : (
                    urgentAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-xl border transition-all ${
                          alert.severity === 'urgent'
                            ? 'bg-rose-950/30 border-rose-800/50 hover:border-rose-700'
                            : 'bg-amber-950/20 border-amber-800/40 hover:border-amber-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-slate-200">
                            {alert.severity === 'urgent' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                            <span className="truncate">{alert.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {alert.timeAgo}
                          </span>
                        </div>

                        <p className="text-slate-300 text-[11px] mt-1.5 leading-relaxed">
                          {alert.message}
                        </p>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60">
                          <button
                            onClick={() => {
                              setCurrentModule(alert.module);
                              setShowAlertsDropdown(false);
                            }}
                            className="text-rose-400 hover:text-rose-300 font-bold text-[11px] flex items-center gap-1"
                          >
                            <span>{alert.actionText || 'Modula keç'}</span>
                            <span>&rarr;</span>
                          </button>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="text-slate-400 hover:text-slate-200 text-[10px]"
                          >
                            Bağla
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
