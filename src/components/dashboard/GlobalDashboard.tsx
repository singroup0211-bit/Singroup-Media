import React from 'react';
import {
  Code2,
  DollarSign,
  Users,
  TrendingUp,
  GraduationCap,
  ArrowUpRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Target,
  Share2,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SinGroupLogo } from '../common/SinGroupLogo';
import { AppModule } from '../../types';

export const GlobalDashboard: React.FC = () => {
  const {
    projects,
    campaigns,
    leads,
    students,
    courseTracks,
    urgentAlerts,
    dismissAlert,
    activityFeed,
    setCurrentModule,
    setIsExportModalOpen,
  } = useApp();

  // Metrics calculation
  const activeProjects = projects.filter((p) => p.status !== 'Deployed');
  const deployedProjects = projects.filter((p) => p.status === 'Deployed');
  const totalDevBudget = projects.reduce((acc, p) => acc + p.budget, 0);

  // MRR estimation: SMM retainers + Dev milestone monthly burn + Academy tuition monthly tranche
  const monthlySMMRevenue = campaigns.reduce((acc, c) => acc + c.adBudgetAllocated * 0.45 + 1800, 0);
  const monthlyDevRevenue = 28500; // estimated active dev revenue
  const monthlyAcademyRevenue = students.reduce((acc, s) => acc + s.totalFee / 3, 0);
  const totalMRR = Math.round(monthlySMMRevenue + monthlyDevRevenue + monthlyAcademyRevenue);

  const totalLeadsContacted = 248; // Total outreach logged
  const totalWonLeads = leads.filter((l) => l.stage === 'Won').length;
  const salesConversionRate = ((totalWonLeads / (leads.length || 1)) * 100).toFixed(1);

  const totalActiveStudents = students.length;
  const totalAcademyCapacity = courseTracks.reduce((acc, c) => acc + c.maxCapacity, 0);

  const kpis = [
    {
      id: 'kpi-dev',
      label: 'Aktiv Proqramlaşdırma Layihələri',
      value: activeProjects.length,
      subtext: `${deployedProjects.length} tamamlandı və təhvil verildi`,
      trend: '+2 bu ay',
      icon: Code2,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      module: 'dev-hub' as AppModule,
    },
    {
      id: 'kpi-mrr',
      label: 'Aylıq Təkrarlanan Gəlir (MRR)',
      value: `$${totalMRR.toLocaleString()}`,
      subtext: `~₼${Math.round(totalMRR * 1.7).toLocaleString()} AZN / ay`,
      trend: '+16.8% əvvəlki aya nisbətən',
      icon: DollarSign,
      color: 'from-emerald-600 to-teal-700',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      module: 'sales' as AppModule,
    },
    {
      id: 'kpi-leads',
      label: 'Əlaqə Qurulmuş Müştərilər',
      value: totalLeadsContacted,
      subtext: `${leads.length} aktiv satış qıfında`,
      trend: '+34 bu həftə',
      icon: Users,
      color: 'from-amber-600 to-orange-700',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      module: 'sales' as AppModule,
    },
    {
      id: 'kpi-conv',
      label: 'Satış Konversiya Dərəcəsi',
      value: `${salesConversionRate}%`,
      subtext: 'Hədəf göstərici: 25.0%',
      trend: 'Əvvəlki rübə nisbətən +3.4%',
      icon: TrendingUp,
      color: 'from-rose-600 to-red-700',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      module: 'sales' as AppModule,
    },
    {
      id: 'kpi-academy',
      label: 'Aktiv Tələbələr',
      value: `${totalActiveStudents}`,
      subtext: `Tutum: ${totalActiveStudents}/${totalAcademyCapacity} yer dolub`,
      trend: '91% tamamlama dərəcəsi',
      icon: GraduationCap,
      color: 'from-purple-600 to-indigo-700',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      module: 'academy' as AppModule,
    },
  ];

  return (
    <div id="global-dashboard-view" className="space-y-6 pb-12">
      {/* Executive Welcome Hero Banner with Sin Group Medya Logo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-rose-950/40 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner shrink-0">
              <SinGroupLogo variant="icon" size="lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase tracking-widest text-rose-400">
                  SIN GROUP MEDYA KORPORATİV
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-medium">Bakı Əməliyyatları</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Agentlik İdarəetmə Mərkəzi
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                Proqramlaşdırma layihələri, Rəqəmsal Media və SMM xidmətləri, Satış CRM qıfı və Akademiya qrupları üzrə mərkəzləşdirilmiş idarəetmə və monitorinq.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Aylıq Hesabatı İxrac Et
            </button>
            <button
              onClick={() => setCurrentModule('dev-hub')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Layihələri İdarə Et</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 High-Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => setCurrentModule(kpi.module)}
              className="group cursor-pointer rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-400">{kpi.label}</span>
                <div
                  className={`p-2 rounded-xl bg-slate-800/80 ${kpi.textColor} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-2xl font-black text-white tracking-tight">{kpi.value}</span>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                  <span className="text-slate-400 truncate">{kpi.subtext}</span>
                  <span className="text-emerald-400 font-semibold shrink-0 ml-1">
                    {kpi.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Urgent Alerts & Module Speedometer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Alerts & Priority Action Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Təcili Status Bildirişləri və Kritik Tapşırıqlar</h3>
                  <p className="text-[11px] text-slate-400">Rəhbərliyin diqqətini tələb edən yüksək prioritetli məsələlər</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {urgentAlerts.length} Həll Edilməli Məsələ
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {urgentAlerts.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-200">Bütün bildirişlər həll edilib və nəzarət altındadır</p>
                </div>
              ) : (
                urgentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                          alert.severity === 'urgent'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-200">{alert.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{alert.timeAgo}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => setCurrentModule(alert.module)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                      >
                        {alert.actionText || 'Bax'} &rarr;
                      </button>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="px-2 py-1.5 text-slate-400 hover:text-slate-200 text-xs"
                      >
                        Bağla
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Module Snapshot Tabs */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                <span>Şöbələrin Vəziyyəti və İş Yükü</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Q3 2026</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Dev Division */}
              <div
                onClick={() => setCurrentModule('dev-hub')}
                className="cursor-pointer p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Proqramlaşdırma
                  </span>
                  <Code2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="mt-3">
                  <span className="text-lg font-extrabold text-white">
                    {activeProjects.length} Layihə Aktivdir
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Veb, Fərdi ERP/CRM və Mobil Tətbiqlər
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Ümumi Büdcə: ${totalDevBudget.toLocaleString()}</span>
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    Bax &rarr;
                  </span>
                </div>
              </div>

              {/* SMM Division */}
              <div
                onClick={() => setCurrentModule('smm')}
                className="cursor-pointer p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Rəqəmsal Media
                  </span>
                  <Share2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-3">
                  <span className="text-lg font-extrabold text-white">
                    {campaigns.length} Aktiv Paket
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Instagram, TikTok, YouTube və Reklamlar
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Orta Cəlbedicilik: 5.2%</span>
                  <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">
                    Bax &rarr;
                  </span>
                </div>
              </div>

              {/* Academy Division */}
              <div
                onClick={() => setCurrentModule('academy')}
                className="cursor-pointer p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Akademiya
                  </span>
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                </div>
                <div className="mt-3">
                  <span className="text-lg font-extrabold text-white">
                    3 Texnoloji İstiqamət
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    SMM, Data Analitika və AI
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                  <span>{totalActiveStudents} Qeydiyyatdan Keçmiş Tələbə</span>
                  <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">
                    Bax &rarr;
                  </span>
                </div>
              </div>

              {/* Payroll Division */}
              <div
                onClick={() => setCurrentModule('payroll')}
                className="cursor-pointer p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-rose-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Əməkhaqqı &amp; Faiz
                  </span>
                  <Wallet className="w-4 h-4 text-rose-400" />
                </div>
                <div className="mt-3">
                  <span className="text-lg font-extrabold text-white">
                    Faiz Kalkulyatoru
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    20% Satış, 10% Veb, 40% Müəllimlər
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Avtomatik Hesablama</span>
                  <span className="text-rose-400 group-hover:translate-x-0.5 transition-transform">
                    Hesabla &rarr;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Feed Stream (1 Col) */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-bold text-white">Agentlik Fəaliyyət Axını</h3>
            </div>
            <span className="text-[11px] text-slate-400">Canlı</span>
          </div>

          <div className="mt-4 flex-1 space-y-3.5 overflow-y-auto max-h-[480px] pr-1">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-3 text-xs">
                <img
                  src={item.avatar}
                  alt={item.user}
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate">{item.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {item.timeAgo}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-0.5 leading-snug">
                    <span className="text-slate-400">{item.action} </span>
                    <span className="font-semibold text-rose-300">{item.target}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="text-xs text-slate-400 hover:text-white font-medium"
            >
              Tam audit hesabatı hazırla &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
