import React, { useState, useMemo } from 'react';
import {
  Kanban,
  Table as TableIcon,
  Plus,
  Filter,
  Search,
  Code2,
  Calendar,
  DollarSign,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  Download,
  Trash2,
  Edit3,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DevProject, DevStatus, ServiceType, DEV_STATUS_LABELS, SERVICE_TYPE_LABELS, PRIORITY_LABELS } from '../../types';
import { SinGroupLogo } from '../common/SinGroupLogo';

const KANBAN_STAGES: { id: DevStatus; label: string; color: string; badgeBg: string }[] = [
  { id: 'Backlog', label: 'Planaalma və Bekloq', color: 'border-slate-700', badgeBg: 'bg-slate-800 text-slate-300' },
  { id: 'In Progress', label: 'İcrada', color: 'border-blue-500/50', badgeBg: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  { id: 'Code Review/QA', label: 'Kod İcmalı və Sınaq', color: 'border-amber-500/50', badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  { id: 'Client Testing', label: 'Müştəri Testi (UAT)', color: 'border-purple-500/50', badgeBg: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
  { id: 'Deployed', label: 'Təhvil Verildi və Yayımda', color: 'border-emerald-500/50', badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
];

export const DevHub: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, updateProjectStatus, searchQuery } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DevProject | null>(null);
  const [inspectingProject, setInspectingProject] = useState<DevProject | null>(null);

  // Add form state
  const [formName, setFormName] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formService, setFormService] = useState<ServiceType>('Web Development');
  const [formFrontend, setFormFrontend] = useState('');
  const [formBackend, setFormBackend] = useState('');
  const [formUiux, setFormUiux] = useState('');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDeadline, setFormDeadline] = useState('');
  const [formBudget, setFormBudget] = useState('15000');
  const [formMilestone, setFormMilestone] = useState('');
  const [formPriority, setFormPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('High');
  const [formStatus, setFormStatus] = useState<DevStatus>('Backlog');
  const [formDescription, setFormDescription] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const activeQuery = (searchQuery || localSearch).toLowerCase().trim();

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch =
        !activeQuery ||
        project.projectName.toLowerCase().includes(activeQuery) ||
        project.clientName.toLowerCase().includes(activeQuery) ||
        project.currentMilestone.toLowerCase().includes(activeQuery) ||
        project.assignedTeam.frontend.toLowerCase().includes(activeQuery) ||
        project.assignedTeam.backend.toLowerCase().includes(activeQuery);

      const matchService =
        selectedService === 'All' || project.serviceType === selectedService;

      const matchStatus =
        selectedStatus === 'All' || project.status === selectedStatus;

      return matchSearch && matchService && matchStatus;
    });
  }, [projects, activeQuery, selectedService, selectedStatus]);

  // Statistics
  const totalBudget = useMemo(
    () => filteredProjects.reduce((sum, p) => sum + p.budget, 0),
    [filteredProjects]
  );
  const totalSpent = useMemo(
    () => filteredProjects.reduce((sum, p) => sum + p.spentBudget, 0),
    [filteredProjects]
  );

  // Form submit validation & handler
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formName.trim()) errors.name = 'Layihənin adı mütləqdir';
    if (!formClient.trim()) errors.client = 'Müştərinin adı mütləqdir';
    if (!formFrontend.trim()) errors.frontend = 'Frontend mütəxəssis qeyd olunmalıdır';
    if (!formBackend.trim()) errors.backend = 'Backend mütəxəssis qeyd olunmalıdır';
    if (!formDeadline.trim()) errors.deadline = 'Son tarix mütləqdir';
    if (!formMilestone.trim()) errors.milestone = 'Hazırkı mərhələ mütləqdir';
    if (isNaN(Number(formBudget)) || Number(formBudget) <= 0) errors.budget = 'Düzgün büdcə daxil edin';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addProject({
      projectName: formName.trim(),
      clientName: formClient.trim(),
      serviceType: formService,
      assignedTeam: {
        frontend: formFrontend.trim(),
        backend: formBackend.trim(),
        uiux: formUiux.trim() || 'Sin Group Dizayn Komandası',
      },
      startDate: formStartDate,
      deadlineDate: formDeadline,
      budget: Number(formBudget),
      spentBudget: 0,
      currentMilestone: formMilestone.trim(),
      status: formStatus,
      priority: formPriority,
      progressPercentage: formStatus === 'Deployed' ? 100 : formStatus === 'Client Testing' ? 85 : formStatus === 'Code Review/QA' ? 65 : formStatus === 'In Progress' ? 40 : 10,
      description: formDescription.trim() || 'Sin Group Proqramlaşdırma şöbəsi tərəfindən idarə olunan texniki tapşırıq.',
      techStack: formService === 'Mobile Apps' ? ['React Native', 'Expo', 'Node.js'] : formService === 'Internal Management Systems (Custom ERP/CRM)' ? ['React', 'NestJS', 'PostgreSQL'] : ['Next.js', 'Tailwind', 'Node.js'],
    });

    // Reset form
    setFormName('');
    setFormClient('');
    setFormFrontend('');
    setFormBackend('');
    setFormUiux('');
    setFormDeadline('');
    setFormMilestone('');
    setFormBudget('15000');
    setFormDescription('');
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  // CSV export
  const handleExportCSV = () => {
    const headers = ['Layihənin Adı', 'Müştəri', 'Xidmət Növü', 'Status', 'Frontend', 'Backend', 'UI/UX', 'Büdcə', 'İrəliləyiş', 'Son Tarix'];
    const rows = filteredProjects.map((p) => [
      `"${p.projectName}"`,
      `"${p.clientName}"`,
      `"${p.serviceType}"`,
      `"${p.status}"`,
      `"${p.assignedTeam.frontend}"`,
      `"${p.assignedTeam.backend}"`,
      `"${p.assignedTeam.uiux}"`,
      p.budget,
      `${p.progressPercentage}%`,
      p.deadlineDate,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SinGroup_Dev_Layihələr_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="dev-hub-module" className="space-y-6 pb-12">
      {/* Module Header with Sin Group Logo & Live Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner shrink-0">
            <SinGroupLogo variant="icon" size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 font-mono">
                Sin Group Medya • Proqramlaşdırma Mərkəzi
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Veb, ERP/CRM və Mobil</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Proqramlaşdırma və Rəqəmsal İnkişaf Mərkəzi
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Veb Portallar, Korporativ ERP/CRM sistemləri və Nativ Mobil tətbiqlər üzrə çevik (Agile) idarəetmə.
            </p>
          </div>
        </div>

        {/* View Switchers & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle: Kanban vs Table */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              id="dev-view-kanban-btn"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              id="dev-view-table-btn"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Cədvəl</span>
            </button>
          </div>

          <button
            id="dev-export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV İxrac Et</span>
          </button>

          <button
            id="add-project-modal-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Layihə Əlavə Et</span>
          </button>
        </div>
      </div>

      {/* Filter and Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Service Type Filter */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Xidmət Kateqoriyası
          </label>
          <select
            id="dev-service-filter"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="All">Bütün Kateqoriyalar (Veb, ERP, Mobil)</option>
            <option value="Web Development">Veb Proqramlaşdırma</option>
            <option value="Internal Management Systems (Custom ERP/CRM)">Daxili ERP / CRM</option>
            <option value="Mobile Apps">Mobil Tətbiqlər</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Kanban Statusu
          </label>
          <select
            id="dev-status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="All">Bütün Mərhələlər</option>
            <option value="Backlog">Planaalma / Bekloq</option>
            <option value="In Progress">İcrada</option>
            <option value="Code Review/QA">Kod İcmalı / QA</option>
            <option value="Client Testing">Müştəri Testi</option>
            <option value="Deployed">Təhvil Verildi</option>
          </select>
        </div>

        {/* Budget Metric */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Aktiv Layihələr Dəyəri
            </span>
            <span className="text-lg font-black text-white mt-0.5 block">
              ${totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        {/* Projects Count */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Filtrlənmiş Layihələr
            </span>
            <span className="text-lg font-black text-white mt-0.5 block">
              {filteredProjects.length} Layihə
            </span>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main View: Kanban vs Table */}
      {viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {KANBAN_STAGES.map((stage) => {
            const stageProjects = filteredProjects.filter((p) => p.status === stage.id);
            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800/80 p-3 min-h-[550px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{stage.label}</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stage.badgeBg}`}
                  >
                    {stageProjects.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {stageProjects.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-800/60 rounded-xl text-slate-400 text-xs text-center p-3">
                      <span>Bu mərhələdə layihə yoxdur</span>
                    </div>
                  ) : (
                    stageProjects.map((project) => (
                      <div
                        key={project.id}
                        className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800/90 hover:border-slate-700 shadow-sm transition-all group relative cursor-pointer"
                        onClick={() => setInspectingProject(project)}
                      >
                        {/* Service tag & Priority */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              project.serviceType === 'Mobile Apps'
                                ? 'bg-purple-500/20 text-purple-300'
                                : project.serviceType === 'Internal Management Systems (Custom ERP/CRM)'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {project.serviceType === 'Internal Management Systems (Custom ERP/CRM)'
                              ? 'ERP/CRM'
                              : project.serviceType === 'Mobile Apps'
                              ? 'Mobil Tətbiq'
                              : 'Veb Layihə'}
                          </span>

                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              project.priority === 'Urgent'
                                ? 'bg-rose-500/20 text-rose-400'
                                : project.priority === 'High'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {PRIORITY_LABELS[project.priority] || project.priority}
                          </span>
                        </div>

                        {/* Project & Client Name */}
                        <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2">
                          {project.projectName}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {project.clientName}
                        </p>

                        {/* Current Milestone */}
                        <div className="mt-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px]">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">
                            Hazırkı Mərhələ
                          </span>
                          <span className="text-slate-200 line-clamp-1 font-medium">
                            {project.currentMilestone}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2.5">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span>İrəliləyiş</span>
                            <span className="font-bold text-slate-300">
                              {project.progressPercentage}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                              style={{ width: `${project.progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Assigned Tech Team Mini */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-400 truncate">
                            <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{project.assignedTeam.frontend.split(' ')[0]}</span>
                            <span>•</span>
                            <span className="truncate">{project.assignedTeam.backend.split(' ')[0]}</span>
                          </div>
                          <span className="font-mono font-bold text-slate-200 shrink-0">
                            ${(project.budget / 1000).toFixed(0)}k
                          </span>
                        </div>

                        {/* Quick Status Shift Menu */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/40 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Keçir:</span>
                          <select
                            value={project.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateProjectStatus(project.id, e.target.value as DevStatus);
                            }}
                            className="text-[10px] bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300 focus:outline-none focus:border-rose-500"
                          >
                            <option value="Backlog">Bekloq</option>
                            <option value="In Progress">İcrada</option>
                            <option value="Code Review/QA">Sınaq/QA</option>
                            <option value="Client Testing">Müştəri Testi</option>
                            <option value="Deployed">Yayımda</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Data Table View */
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Layihə və Müştəri</th>
                  <th className="py-3.5 px-4 font-bold">Xidmət Növü</th>
                  <th className="py-3.5 px-4 font-bold">Texniki Heyət (FE / BE / UI)</th>
                  <th className="py-3.5 px-4 font-bold">Hazırkı Mərhələ</th>
                  <th className="py-3.5 px-4 font-bold">Son Tarix</th>
                  <th className="py-3.5 px-4 font-bold">Büdcə</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Filtrə uyğun heç bir layihə tapılmadı.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setInspectingProject(p)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{p.projectName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{p.clientName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.serviceType === 'Mobile Apps'
                              ? 'bg-purple-500/20 text-purple-300'
                              : p.serviceType === 'Internal Management Systems (Custom ERP/CRM)'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {p.serviceType === 'Internal Management Systems (Custom ERP/CRM)'
                            ? 'ERP/CRM'
                            : p.serviceType === 'Mobile Apps'
                            ? 'Mobil Tətbiq'
                            : 'Veb Layihə'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium truncate max-w-[200px]">
                          FE: {p.assignedTeam.frontend}
                        </div>
                        <div className="text-slate-400 text-[11px] truncate max-w-[200px]">
                          BE: {p.assignedTeam.backend} | UI: {p.assignedTeam.uiux}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="truncate font-medium text-slate-200">
                          {p.currentMilestone}
                        </div>
                        <div className="w-24 h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${p.progressPercentage}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {p.deadlineDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ${p.budget.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={p.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateProjectStatus(p.id, e.target.value as DevStatus);
                          }}
                          className="text-[11px] bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-semibold focus:outline-none focus:border-rose-500"
                        >
                          <option value="Backlog">Bekloq</option>
                          <option value="In Progress">İcrada</option>
                          <option value="Code Review/QA">Kod İcmalı / QA</option>
                          <option value="Client Testing">Müştəri Testi</option>
                          <option value="Deployed">Təhvil Verildi</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingProject(p);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors"
                        >
                          Detallara Bax
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Project Modal with Complete Validation */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <SinGroupLogo variant="icon" size="sm" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Yeni Proqramlaşdırma Layihəsi Əlavə Et</h3>
                  <p className="text-xs text-slate-400">Sin Group Medya Proqram Mühəndisliyi Şöbəsi</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Project Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Layihənin Adı *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Xəzər Logistika Portalı"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${
                      formErrors.name ? 'border-rose-500' : 'border-slate-800'
                    } text-xs text-white focus:outline-none focus:border-rose-500`}
                  />
                  {formErrors.name && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                {/* Client Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Müştəri / Şirkət *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Baku Holding MMC"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${
                      formErrors.client ? 'border-rose-500' : 'border-slate-800'
                    } text-xs text-white focus:outline-none focus:border-rose-500`}
                  />
                  {formErrors.client && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.client}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Service Type */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Xidmət Kateqoriyası *
                  </label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value as ServiceType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Web Development">Veb Proqramlaşdırma</option>
                    <option value="Internal Management Systems (Custom ERP/CRM)">
                      Daxili İdarəetmə Sistemləri (ERP/CRM)
                    </option>
                    <option value="Mobile Apps">Mobil Tətbiqlər</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Büdcə ($ USD) *
                  </label>
                  <input
                    type="number"
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${
                      formErrors.budget ? 'border-rose-500' : 'border-slate-800'
                    } text-xs text-white focus:outline-none focus:border-rose-500`}
                  />
                  {formErrors.budget && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.budget}</span>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Prioritet Səviyyəsi
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Urgent">Təcili</option>
                    <option value="High">Yüksək</option>
                    <option value="Medium">Orta</option>
                    <option value="Low">Aşağı</option>
                  </select>
                </div>
              </div>

              {/* Assigned Team */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Front-end Mütəxəssis *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Kamran Əliyev"
                    value={formFrontend}
                    onChange={(e) => setFormFrontend(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${
                      formErrors.frontend ? 'border-rose-500' : 'border-slate-800'
                    } text-xs text-white focus:outline-none focus:border-rose-500`}
                  />
                  {formErrors.frontend && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.frontend}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Back-end Mütəxəssis *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Fərid Quliyev"
                    value={formBackend}
                    onChange={(e) => setFormBackend(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${
                      formErrors.backend ? 'border-rose-500' : 'border-slate-800'
                    } text-xs text-white focus:outline-none focus:border-rose-500`}
                  />
                  {formErrors.backend && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.backend}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    UI/UX Dizayner
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Aysel Hüseynova"
                    value={formUiux}
                    onChange={(e) => setFormUiux(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Dates & Current Milestone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Hədəf Son Tarix *
                  </label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${
                      formErrors.deadline ? 'border-rose-500' : 'border-slate-800'
                    } text-xs text-white focus:outline-none focus:border-rose-500`}
                  />
                  {formErrors.deadline && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.deadline}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Hazırkı Mərhələ *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. API İnteqrasiyası və Ödəniş Şlüzü"
                    value={formMilestone}
                    onChange={(e) => setFormMilestone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${
                      formErrors.milestone ? 'border-rose-500' : 'border-slate-800'
                    } text-xs text-white focus:outline-none focus:border-rose-500`}
                  />
                  {formErrors.milestone && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.milestone}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Layihənin Miqyası / Texniki Təsvir
                </label>
                <textarea
                  rows={2}
                  placeholder="Layihənin əhatə dairəsi, arxitektura qeydləri və təhvil veriləcək modulların detalları..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Ləğv Et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40"
                >
                  Layihəni Yarat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Project Details Modal */}
      {inspectingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-rose-500 uppercase font-mono">
                    {inspectingProject.id}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-300 font-semibold">
                    {SERVICE_TYPE_LABELS[inspectingProject.serviceType] || inspectingProject.serviceType}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">{inspectingProject.projectName}</h3>
                <p className="text-xs text-slate-400">Müştəri: {inspectingProject.clientName}</p>
              </div>
              <button
                onClick={() => setInspectingProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Layihənin İrəliləyişi
                  </span>
                  <span className="font-bold text-rose-400">
                    {inspectingProject.progressPercentage}% Tamamlandı
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                    style={{ width: `${inspectingProject.progressPercentage}%` }}
                  />
                </div>
                <p className="text-slate-300 text-xs pt-1">
                  <span className="font-bold text-white">Hazırkı Mərhələ: </span>
                  {inspectingProject.currentMilestone}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                  <span className="font-bold text-white mt-1 block">
                    {DEV_STATUS_LABELS[inspectingProject.status] || inspectingProject.status}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Büdcə</span>
                  <span className="font-bold text-emerald-400 mt-1 block">
                    ${inspectingProject.budget.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Son Tarix</span>
                  <span className="font-bold text-white mt-1 block">{inspectingProject.deadlineDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Prioritet</span>
                  <span className="font-bold text-amber-400 mt-1 block">
                    {PRIORITY_LABELS[inspectingProject.priority] || inspectingProject.priority}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">
                  Təhkim Olunmuş Texniki Komanda
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Front-end:</span>
                    <span className="font-bold text-white">{inspectingProject.assignedTeam.frontend}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Back-end:</span>
                    <span className="font-bold text-white">{inspectingProject.assignedTeam.backend}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">UI/UX:</span>
                    <span className="font-bold text-white">{inspectingProject.assignedTeam.uiux}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Miqyas və Arxitektura Qeydləri
                </span>
                <p className="text-slate-300 leading-relaxed">{inspectingProject.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {inspectingProject.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  deleteProject(inspectingProject.id);
                  setInspectingProject(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Layihəni Sil</span>
              </button>

              <button
                onClick={() => setInspectingProject(null)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Pəncərəni Bağla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
