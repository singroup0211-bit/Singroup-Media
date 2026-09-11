import React from 'react';
import {
  FileSpreadsheet,
  Download,
  Database,
  Layers,
  Code2,
  Share2,
  TrendingUp,
  GraduationCap,
  X,
  CheckCircle2,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SinGroupLogo } from './SinGroupLogo';

export const ExportModal: React.FC = () => {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    projects,
    campaigns,
    leads,
    students,
    agents,
    payrollEmployees,
  } = useApp();

  if (!isExportModalOpen) return null;

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAllJSON = () => {
    const fullBackup = {
      agency: 'Sin Group Medya & Technology',
      exportDate: new Date().toISOString(),
      projects,
      campaigns,
      leads,
      students,
      agents,
      payrollEmployees,
    };
    downloadFile(
      `SinGroup_Enterprise_Backup_${new Date().toISOString().split('T')[0]}.json`,
      JSON.stringify(fullBackup, null, 2),
      'application/json'
    );
  };

  const exportPayrollCSV = () => {
    const headers = ['Employee Name', 'Role', 'Department', 'Rate %', 'Basis', 'Commission', 'Bonus', 'Total USD', 'Status'];
    const rows = payrollEmployees.map((e) => [
      `"${e.name}"`,
      `"${e.role}"`,
      `"${e.department}"`,
      `${e.ratePercentage}%`,
      `"${e.revenueBasisLabel}"`,
      e.calculatedAmount,
      e.bonusAmount,
      e.calculatedAmount + e.bonusAmount,
      `"${e.paymentStatus}"`,
    ]);
    downloadFile(
      `SinGroup_Payroll_Commissions_${new Date().toISOString().split('T')[0]}.csv`,
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n'),
      'text/csv'
    );
  };

  const exportProjectsCSV = () => {
    const headers = ['Project Name', 'Client', 'Service Type', 'Status', 'Frontend', 'Backend', 'Budget', 'Progress', 'Deadline'];
    const rows = projects.map((p) => [
      `"${p.projectName}"`,
      `"${p.clientName}"`,
      `"${p.serviceType}"`,
      `"${p.status}"`,
      `"${p.assignedTeam.frontend}"`,
      `"${p.assignedTeam.backend}"`,
      p.budget,
      `${p.progressPercentage}%`,
      p.deadlineDate,
    ]);
    downloadFile(
      `SinGroup_Dev_Projects_${new Date().toISOString().split('T')[0]}.csv`,
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n'),
      'text/csv'
    );
  };

  const exportLeadsCSV = () => {
    const headers = ['Company', 'Contact', 'Phone', 'Service Interested', 'Stage', 'Deal Value', 'Agent'];
    const rows = leads.map((l) => [
      `"${l.companyName}"`,
      `"${l.contactName}"`,
      `"${l.phone}"`,
      `"${l.serviceInterested}"`,
      `"${l.stage}"`,
      l.dealValue,
      `"${l.assignedAgent}"`,
    ]);
    downloadFile(
      `SinGroup_Sales_Leads_${new Date().toISOString().split('T')[0]}.csv`,
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n'),
      'text/csv'
    );
  };

  const exportStudentsCSV = () => {
    const headers = ['Student Name', 'Course Track', 'Cohort', 'Attendance', 'Payment Status', 'Paid', 'Total Fee', 'Certificate'];
    const rows = students.map((s) => [
      `"${s.studentName}"`,
      `"${s.courseTrack}"`,
      `"${s.cohortGroup}"`,
      `${s.attendanceRate}%`,
      `"${s.paymentStatus}"`,
      s.paidAmount,
      s.totalFee,
      `"${s.certificateStatus}"`,
    ]);
    downloadFile(
      `SinGroup_Academy_Roster_${new Date().toISOString().split('T')[0]}.csv`,
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n'),
      'text/csv'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <SinGroupLogo variant="icon" size="sm" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Müəssisə Məlumatlarının İxracı</h3>
              <p className="text-xs text-slate-400">Sin Group Medya ERP &amp; CRM Mərkəzi Qovşaq</p>
            </div>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {/* Full JSON Backup */}
          <div
            onClick={exportAllJSON}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                  Tam Agentlik JSON Ehtiyat Nüsxəsi
                </h4>
                <p className="text-xs text-slate-400">
                  Bütün modulların tam sistem ehtiyat nüsxəsi (Layihələr, Satışlar, SMM, Akademiya, Nümayəndələr)
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </div>

          {/* Dev Projects CSV */}
          <div
            onClick={exportProjectsCSV}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  Proqram Təminatı Layihələri Siyahısı (CSV)
                </h4>
                <p className="text-[11px] text-slate-400">
                  {projects.length} Veb, ERP və Mobil layihə (büdcə və mərhələlərlə)
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </div>

          {/* Leads CSV */}
          <div
            onClick={exportLeadsCSV}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Satış Qıfı və Potensial Müştərilər (CSV)
                </h4>
                <p className="text-[11px] text-slate-400">
                  5 mərhələ üzrə dəyərləndirilmiş {leads.length} müştəri təması
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </div>

          {/* Academy CSV */}
          <div
            onClick={exportStudentsCSV}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                  Akademiya Tələbə Qeydiyyatı Siyahısı (CSV)
                </h4>
                <p className="text-[11px] text-slate-400">
                  SMM, Data Analitikası və AI üzrə {students.length} tələbə
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </div>

          {/* Payroll CSV */}
          <div
            onClick={exportPayrollCSV}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                  Əməkhaqqı və Faiz Bölgüsü Cədvəli (CSV)
                </h4>
                <p className="text-[11px] text-slate-400">
                  20% Satış, 10% Veb və 40% Müəllim payları üzrə {payrollEmployees.length} əməkdaş
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 mt-5 border-t border-slate-800">
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
};
