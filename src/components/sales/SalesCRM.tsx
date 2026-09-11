import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Plus,
  PhoneCall,
  Mail,
  Calendar,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Filter,
  Download,
  AlertCircle,
  FileText,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Lead,
  LeadStage,
  SalesAgent,
  LEAD_STAGE_LABELS,
  SERVICE_INTERESTED_LABELS,
  OUTREACH_TYPE_LABELS,
  LOG_TYPE_LABELS,
} from '../../types';
import { SinGroupLogo } from '../common/SinGroupLogo';

const PIPELINE_STAGES: {
  id: LeadStage;
  label: string;
  sublabel: string;
  badgeBg: string;
  color: string;
}[] = [
  {
    id: 'Contacted',
    label: 'Əlaqə Saxlanılanlar',
    sublabel: 'Soyuq və İsti Əlaqələr',
    badgeBg: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'Responded',
    label: 'Geri Dönüş Edənlər',
    sublabel: 'Maraqlanan Müştərilər',
    badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    color: 'from-amber-600 to-orange-600',
  },
  {
    id: 'Proposal Sent',
    label: 'Təklif / Görüş',
    sublabel: 'Təqdimat və Müzakirə',
    badgeBg: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    color: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'Won',
    label: 'Satış Bağlananlar',
    sublabel: 'Müqavilə İmzalandı',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'Lost',
    label: 'İmtina / Uğursuz',
    sublabel: 'Büdcə / Təxirə Salındı',
    badgeBg: 'bg-slate-800 text-slate-400 border border-slate-700',
    color: 'from-slate-700 to-slate-800',
  },
];

export const SalesCRM: React.FC = () => {
  const { leads, addLead, updateLead, updateLeadStage, logLeadContact, agents, searchQuery } =
    useApp();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'agents'>('pipeline');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');

  // Modals
  const [loggingLead, setLoggingLead] = useState<Lead | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [inspectingLead, setInspectingLead] = useState<Lead | null>(null);

  // Logging form state
  const [logType, setLogType] = useState<'Call' | 'Meeting' | 'Email' | 'WhatsApp / DM' | 'Proposal'>('Call');
  const [logNotes, setLogNotes] = useState('');
  const [logFollowUp, setLogFollowUp] = useState('');
  const [logNewStage, setLogNewStage] = useState<LeadStage>('Contacted');
  const [logAgent, setLogAgent] = useState(agents[0]?.name || 'Tural Hasanov');

  // Add Lead form state
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadService, setLeadService] = useState<'Dev & ERP' | 'SMM & Marketing' | 'Academy Training' | 'Enterprise Bundle'>('Dev & ERP');
  const [leadDealValue, setLeadDealValue] = useState('20000');
  const [leadOutreachType, setLeadOutreachType] = useState<'Cold Outreach' | 'Warm Referral' | 'Inbound Lead' | 'Social Media DM'>('Cold Outreach');
  const [leadAssignedAgent, setLeadAssignedAgent] = useState(agents[0]?.name || 'Tural Hasanov');
  const [leadStage, setLeadStage] = useState<LeadStage>('Contacted');
  const [leadNotes, setLeadNotes] = useState('');
  const [leadErrors, setLeadErrors] = useState<{ [key: string]: string }>({});

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        !searchQuery ||
        l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.assignedAgent.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStage = stageFilter === 'All' || l.stage === stageFilter;
      const matchService = serviceFilter === 'All' || l.serviceInterested === serviceFilter;

      return matchSearch && matchStage && matchService;
    });
  }, [leads, searchQuery, stageFilter, serviceFilter]);

  // Funnel calculations
  const contactedCount = leads.filter((l) => l.stage === 'Contacted').length;
  const respondedCount = leads.filter((l) => l.stage === 'Responded').length;
  const proposalCount = leads.filter((l) => l.stage === 'Proposal Sent').length;
  const wonCount = leads.filter((l) => l.stage === 'Won').length;
  const lostCount = leads.filter((l) => l.stage === 'Lost').length;

  const totalClosedRevenue = leads
    .filter((l) => l.stage === 'Won')
    .reduce((sum, l) => sum + l.dealValue, 0);

  const activePipelineValue = leads
    .filter((l) => l.stage !== 'Won' && l.stage !== 'Lost')
    .reduce((sum, l) => sum + l.dealValue, 0);

  // Handle open log modal
  const handleOpenLogModal = (lead: Lead) => {
    setLoggingLead(lead);
    setLogNewStage(lead.stage);
    setLogAgent(lead.assignedAgent);
    setLogFollowUp(lead.nextFollowUpDate || '');
    setLogNotes('');
  };

  // Submit Lead Log
  const handleSubmitLeadLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingLead || !logNotes.trim()) return;

    logLeadContact(loggingLead.id, {
      agentName: logAgent,
      type: logType,
      notes: logNotes.trim(),
      followUpReminder: logFollowUp,
      newStage: logNewStage,
    });

    setLoggingLead(null);
  };

  // Submit Add Lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!leadName.trim()) errors.name = 'Əlaqədar şəxsin adı tələb olunur';
    if (!leadCompany.trim()) errors.company = 'Şirkət adı tələb olunur';
    if (!leadPhone.trim()) errors.phone = 'Telefon nömrəsi tələb olunur';
    if (isNaN(Number(leadDealValue)) || Number(leadDealValue) <= 0)
      errors.deal = 'Düzgün müqavilə məbləği daxil edin';

    if (Object.keys(errors).length > 0) {
      setLeadErrors(errors);
      return;
    }

    addLead({
      contactName: leadName.trim(),
      companyName: leadCompany.trim(),
      email: leadEmail.trim() || 'info@client.az',
      phone: leadPhone.trim(),
      serviceInterested: leadService,
      stage: leadStage,
      outreachType: leadOutreachType,
      assignedAgent: leadAssignedAgent,
      dealValue: Number(leadDealValue),
      probability: leadStage === 'Won' ? 100 : leadStage === 'Proposal Sent' ? 70 : leadStage === 'Responded' ? 50 : 20,
      lastContactDate: new Date().toISOString().split('T')[0],
      nextFollowUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      contactAttemptsCount: 1,
      feedbackNotes: leadNotes.trim() || 'Sin Group CRM sisteminə yeni potensial müştəri əlavə edildi.',
    });

    setLeadName('');
    setLeadCompany('');
    setLeadEmail('');
    setLeadPhone('');
    setLeadDealValue('20000');
    setLeadNotes('');
    setLeadErrors({});
    setIsAddLeadModalOpen(false);
  };

  return (
    <div id="sales-crm-module" className="space-y-6 pb-12">
      {/* Header with Sin Group Logo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner shrink-0">
            <SinGroupLogo variant="icon" size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 font-mono">
                Sin Group Medya • Gəlir Mühərriki
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Satış Boru Kəməri &amp; CRM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Satış Meneceri CRM &amp; Qıf İdarəetməsi
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              5 mərhələli konversiya qıfı, agent kvotalarının izlənməsi və interaktiv əlaqə qeydiyyatı.
            </p>
          </div>
        </div>

        {/* View Switchers & Add Lead */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              id="sales-tab-pipeline-btn"
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Satış Boru Kəməri &amp; Müştərilər</span>
            </button>
            <button
              id="sales-tab-agents-btn"
              onClick={() => setActiveTab('agents')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'agents'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Agent Performansı</span>
            </button>
          </div>

          <button
            id="add-lead-btn"
            onClick={() => setIsAddLeadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Müştəri Əlavə Et</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Sales Funnel Tracking Visualizer */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <span>Tam Dövriyyəli Satış Qıfı Performansı</span>
            </h3>
            <p className="text-xs text-slate-400">
              İlkin əlaqədən bağlanmış gəlirə qədər müştəri axınının ölçülməsi
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Bağlanmış Gəlir
            </span>
            <span className="text-base font-black text-emerald-400 font-mono">
              ${totalClosedRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Funnel Stage Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {PIPELINE_STAGES.map((stage, idx) => {
            const stageLeads = leads.filter((l) => l.stage === stage.id);
            const stageVal = stageLeads.reduce((acc, l) => acc + l.dealValue, 0);

            return (
              <div
                key={stage.id}
                onClick={() => setStageFilter(stageFilter === stage.id ? 'All' : stage.id)}
                className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-200 relative overflow-hidden ${
                  stageFilter === stage.id
                    ? 'bg-rose-950/30 border-rose-500 ring-1 ring-rose-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold font-mono text-slate-400">
                    0{idx + 1}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.badgeBg}`}>
                    {stageLeads.length}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white leading-tight">{stage.label}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{stage.sublabel}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Value:</span>
                  <span className="font-mono font-bold text-slate-200">
                    ${stageVal.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeTab === 'pipeline' ? (
        /* Leads Pipeline & Logging Table */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Mərhələ:</span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200"
              >
                <option value="All">Bütün Qıf Mərhələləri</option>
                <option value="Contacted">Əlaqə Saxlanılanlar</option>
                <option value="Responded">Geri Dönüş Edənlər</option>
                <option value="Proposal Sent">Təklif Göndərilənlər</option>
                <option value="Won">Qazanılan Satışlar</option>
                <option value="Lost">İtirilən / Uğursuz</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">İstiqamət:</span>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200"
              >
                <option value="All">Bütün Xidmətlər</option>
                <option value="Dev & ERP">İnkişaf &amp; ERP</option>
                <option value="SMM & Marketing">SMM &amp; Marketinq</option>
                <option value="Academy Training">Akademiya Təlimi</option>
                <option value="Enterprise Bundle">Korporativ Paket</option>
              </select>
            </div>

            <div className="text-slate-400 font-mono">
              Göstərilir: {filteredLeads.length} müştəri
            </div>
          </div>

          {/* Lead Table */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Əlaqədar Şəxs &amp; Şirkət</th>
                    <th className="py-3.5 px-4 font-bold">Maraqlandığı Xidmət</th>
                    <th className="py-3.5 px-4 font-bold">Müqavilə Dəyəri</th>
                    <th className="py-3.5 px-4 font-bold">Qıf Mərhələsi</th>
                    <th className="py-3.5 px-4 font-bold">Təhkim Olunmuş Agent</th>
                    <th className="py-3.5 px-4 font-bold">Növbəti Əlaqə</th>
                    <th className="py-3.5 px-4 font-bold">Son Əlaqə Qeydi</th>
                    <th className="py-3.5 px-4 font-bold text-right">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        Seçilmiş filtrlərə uyğun satış müştərisi tapılmadı.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">
                            {lead.companyName}
                          </div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            {lead.contactName} • {lead.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {SERVICE_INTERESTED_LABELS[lead.serviceInterested] || lead.serviceInterested}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          ${lead.dealValue.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.stage}
                            onChange={(e) =>
                              updateLeadStage(lead.id, e.target.value as LeadStage)
                            }
                            className={`text-[11px] rounded-lg px-2 py-1 font-bold border focus:outline-none ${
                              lead.stage === 'Won'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : lead.stage === 'Proposal Sent'
                                ? 'bg-purple-950 text-purple-300 border-purple-700'
                                : lead.stage === 'Responded'
                                ? 'bg-amber-950 text-amber-300 border-amber-700'
                                : lead.stage === 'Lost'
                                ? 'bg-slate-800 text-slate-400 border-slate-700'
                                : 'bg-blue-950 text-blue-300 border-blue-700'
                            }`}
                          >
                            <option value="Contacted">Əlaqə saxlanıldı</option>
                            <option value="Responded">Geri dönüş edildi</option>
                            <option value="Proposal Sent">Təklif göndərildi</option>
                            <option value="Won">Satış bağlandı</option>
                            <option value="Lost">İmtina edildi</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-200">{lead.assignedAgent}</div>
                          <div className="text-[10px] text-slate-400">
                            {OUTREACH_TYPE_LABELS[lead.outreachType] || lead.outreachType}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-mono text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{lead.nextFollowUpDate || 'Təyin edilməyib'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Cəhdlər: {lead.contactAttemptsCount}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-[11px] text-slate-300 line-clamp-1 italic">
                            "{lead.feedbackNotes}"
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Son əlaqə: {lead.lastContactDate}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            id={`log-lead-btn-${lead.id}`}
                            onClick={() => handleOpenLogModal(lead)}
                            className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors whitespace-nowrap"
                          >
                            Fəaliyyət Qeyd Et
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Sales Agent Performance Table */
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Satış Agentlərinin Performansı və Kvota Lövhəsi</h3>
            <p className="text-xs text-slate-400">
              Fərdi agent göstəriciləri: əlaqə həcmi, cavab dərəcəsi, bağlanmış müqavilələr və gəlir bölgüsü.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Agentin Adı</th>
                  <th className="py-3.5 px-4 font-bold">Edilən Əlaqə Sayı</th>
                  <th className="py-3.5 px-4 font-bold">Cavab Faizi (%)</th>
                  <th className="py-3.5 px-4 font-bold">Qazanılan Satışlar</th>
                  <th className="py-3.5 px-4 font-bold">Konversiya Faizi (%)</th>
                  <th className="py-3.5 px-4 font-bold">Bağlanan Gəlir</th>
                  <th className="py-3.5 px-4 font-bold">Hədəf Kvotası</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {agents.map((agent) => {
                  const targetPct = Math.round((agent.closedRevenue / (agent.targetRevenue || 1)) * 100);
                  return (
                    <tr key={agent.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={agent.avatar}
                            alt={agent.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{agent.name}</div>
                            <div className="text-[11px] text-slate-400">{agent.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold font-mono text-white text-sm">
                        {agent.contactsMade}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-emerald-400">
                            {agent.responseRate}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({agent.responsesCount} cavab)
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold font-mono text-rose-400 text-sm">
                        {agent.wonDeals} müqavilə
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {agent.conversionRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-white text-sm">
                        ${agent.closedRevenue.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 min-w-[160px]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-400">${agent.targetRevenue.toLocaleString()}</span>
                          <span className="font-bold text-slate-200">{targetPct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              targetPct >= 100
                                ? 'bg-emerald-500'
                                : targetPct >= 70
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(targetPct, 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Logging Modal: Log contact attempt, client feedback, reminders, status */}
      {loggingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <SinGroupLogo variant="icon" size="sm" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Müştəri Əlaqəsini Qeyd Et: {loggingLead.companyName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Əlaqədar Şəxs: {loggingLead.contactName} ({loggingLead.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLoggingLead(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeadLog} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Əlaqə Kanalı / Növü *
                  </label>
                  <select
                    value={logType}
                    onChange={(e) => setLogType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Call">Telefon Zəngi</option>
                    <option value="Meeting">Canlı / Onlayn Görüş</option>
                    <option value="Email">E-poçt Yazışması</option>
                    <option value="WhatsApp / DM">WhatsApp / Sosial DM</option>
                    <option value="Proposal">Texniki Təklif Göndərildi</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Qeyd Edən Agent *
                  </label>
                  <select
                    value={logAgent}
                    onChange={(e) => setLogAgent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Müştəri Statusunu Yenilə
                  </label>
                  <select
                    value={logNewStage}
                    onChange={(e) => setLogNewStage(e.target.value as LeadStage)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Contacted">Əlaqə saxlanıldı</option>
                    <option value="Responded">Geri dönüş edənlər (Cavab verdi və Maraqlandı)</option>
                    <option value="Proposal Sent">Təklif göndərildi / Görüş təyin olundu</option>
                    <option value="Won">Satış bağlananlar (Müqavilə imzalandı)</option>
                    <option value="Lost">İmtina / Uğursuz</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Növbəti Əlaqə Xatırlatması Tarixi
                  </label>
                  <input
                    type="date"
                    value={logFollowUp}
                    onChange={(e) => setLogFollowUp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Müştəri Rəyi və Görüş Detalları *
                </label>
                <textarea
                  rows={3}
                  placeholder="Müştərinin tələbləri, etirazları, büdcə razılaşması və növbəti addımlar..."
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              {/* Past activity logs history */}
              {loggingLead.logs && loggingLead.logs.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 max-h-40 overflow-y-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Əvvəlki Əlaqə Tarixçəsi ({loggingLead.logs.length} qeyd)
                  </span>
                  <div className="space-y-2 text-xs">
                    {loggingLead.logs.map((log) => (
                      <div key={log.id} className="pb-2 border-b border-slate-800/60 last:border-none">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-rose-400">
                            {LOG_TYPE_LABELS[log.type] || log.type} • {log.agentName}
                          </span>
                          <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-0.5">{log.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setLoggingLead(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Ləğv Et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40"
                >
                  Qeydi Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Lead Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <SinGroupLogo variant="icon" size="sm" />
                <h3 className="text-base font-bold text-white">Yeni Potensial Müştəri Əlavə Et</h3>
              </div>
              <button
                onClick={() => setIsAddLeadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Şirkət / Təşkilat *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Caspian Logistics MMC"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  {leadErrors.company && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{leadErrors.company}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Əlaqədar Şəxsin Adı *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Orxan Əliyev"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  {leadErrors.name && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{leadErrors.name}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Telefon / WhatsApp *
                  </label>
                  <input
                    type="text"
                    placeholder="+994 50 123 45 67"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  {leadErrors.phone && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{leadErrors.phone}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    E-poçt Ünvanı
                  </label>
                  <input
                    type="email"
                    placeholder="info@client.az"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Maraqlandığı Xidmət
                  </label>
                  <select
                    value={leadService}
                    onChange={(e) => setLeadService(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Dev & ERP">İnkişaf &amp; ERP</option>
                    <option value="SMM & Marketing">SMM &amp; Marketinq</option>
                    <option value="Academy Training">Akademiya Təlimi</option>
                    <option value="Enterprise Bundle">Korporativ Paket</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Təxmini Dəyər ($)
                  </label>
                  <input
                    type="number"
                    value={leadDealValue}
                    onChange={(e) => setLeadDealValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  {leadErrors.deal && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{leadErrors.deal}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Təhkim Olunmuş Agent
                  </label>
                  <select
                    value={leadAssignedAgent}
                    onChange={(e) => setLeadAssignedAgent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  İlkin Tələblər və Qeydlər
                </label>
                <textarea
                  rows={2}
                  placeholder="İlkin danışıqdan qeydlər, müştərinin ehtiyacları..."
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Ləğv Et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40"
                >
                  Müştəri Yarat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
