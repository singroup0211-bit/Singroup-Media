import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Calculator,
  TrendingUp,
  Users,
  Building2,
  Code2,
  GraduationCap,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Printer,
  FileText,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  X,
  Sliders,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  EmployeePayroll,
  EmployeeRole,
  PayrollDepartment,
  EMPLOYEE_ROLE_LABELS,
  PAYROLL_STATUS_LABELS,
} from '../../types';
import { SinGroupLogo } from '../common/SinGroupLogo';

export const PayrollModule: React.FC = () => {
  const {
    payrollEmployees,
    addPayrollEmployee,
    updatePayrollEmployee,
    deletePayrollEmployee,
    resetPayrollCalculations,
    projects,
    campaigns,
    students,
    leads,
  } = useApp();

  // Filters & Search
  const [departmentFilter, setDepartmentFilter] = useState<'All' | PayrollDepartment>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Approved'>('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployeeSlip, setSelectedEmployeeSlip] = useState<EmployeePayroll | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // New Employee Form State
  const [newEmployee, setNewEmployee] = useState<Omit<EmployeePayroll, 'id'>>({
    name: '',
    role: 'Sales Manager',
    department: 'Sales',
    phone: '',
    email: '',
    ratePercentage: 20,
    revenueBasis: 'total_revenue',
    revenueBasisLabel: 'Ümumi Aylıq Gəlir (Bütün Xidmətlər)',
    calculatedAmount: 0,
    bonusAmount: 0,
    paymentStatus: 'Pending',
    notes: '',
  });

  // Calculate live base figures from active modules
  const liveFinancials = useMemo(() => {
    // 1. Web Dev projects active budget sum
    const webDevTotal = projects.reduce((acc, p) => acc + p.budget, 0);
    // Monthly active revenue estimation for dev
    const webDevMonthly = Math.round(webDevTotal * 0.35); // monthly project cashflow

    // 2. SMM Retainers monthly revenue
    const smmRetainersMonthly = campaigns.reduce(
      (acc, c) => acc + (c.retainerPackage === 'Custom 360°' ? 6000 : c.retainerPackage === 'Enterprise Scale' ? 4500 : c.retainerPackage === 'Growth Pro' ? 3200 : 1800),
      0
    );

    // 3. Academy Tuition collected
    const smmStudentsTotal = students
      .filter((s) => s.courseTrack === 'Social Media Marketing (SMM)')
      .reduce((acc, s) => acc + s.paidAmount, 0);

    const dataStudentsTotal = students
      .filter((s) => s.courseTrack === 'Data Analytics')
      .reduce((acc, s) => acc + s.paidAmount, 0);

    const aiStudentsTotal = students
      .filter((s) => s.courseTrack === 'Artificial Intelligence (AI & Automation)')
      .reduce((acc, s) => acc + s.paidAmount, 0);

    const academyTotal = smmStudentsTotal + dataStudentsTotal + aiStudentsTotal;

    // 4. Sales deals won
    const wonDeals = leads.filter((l) => l.stage === 'Won').reduce((acc, l) => acc + l.dealValue, 0);

    // Total monthly revenue pool
    const totalAgencyMonthlyRevenue = webDevMonthly + smmRetainersMonthly + academyTotal + wonDeals;

    return {
      webDevMonthly,
      smmRetainersMonthly,
      smmStudentsTotal,
      dataStudentsTotal,
      aiStudentsTotal,
      academyTotal,
      wonDeals,
      totalAgencyMonthlyRevenue,
    };
  }, [projects, campaigns, students, leads]);

  // Simulation inputs (initialized from live values)
  const [simTotalRevenue, setSimTotalRevenue] = useState<number>(liveFinancials.totalAgencyMonthlyRevenue);
  const [simWebRevenue, setSimWebRevenue] = useState<number>(liveFinancials.webDevMonthly);
  const [simSMMCourseRevenue, setSimSMMCourseRevenue] = useState<number>(liveFinancials.smmStudentsTotal);
  const [simDataCourseRevenue, setSimDataCourseRevenue] = useState<number>(liveFinancials.dataStudentsTotal);
  const [simAICourseRevenue, setSimAICourseRevenue] = useState<number>(liveFinancials.aiStudentsTotal);

  // Default statutory percentage rules specified by user:
  // - Satış meneceri: 20% (ümumi aylıq gəlirin 20%-i)
  // - Veb proqramlaşdırma: 10%-i front-end-in, 10%-i back-end-in
  // - SMM və data analitika müəllimlərində: 40% (40% SMM, 40% Data Analitika)
  const [ruleSalesPct, setRuleSalesPct] = useState<number>(20);
  const [ruleFrontendPct, setRuleFrontendPct] = useState<number>(10);
  const [ruleBackendPct, setRuleBackendPct] = useState<number>(10);
  const [ruleSMMPct, setRuleSMMPct] = useState<number>(40);
  const [ruleDataPct, setRuleDataPct] = useState<number>(40);
  const [ruleAIPct, setRuleAIPct] = useState<number>(40);

  // Compute calculated amounts dynamically for each employee based on rules
  const enrichedEmployees = useMemo(() => {
    return payrollEmployees.map((emp) => {
      let basisAmount = 0;
      let effectivePct = emp.ratePercentage;

      if (emp.role === 'Sales Manager') {
        basisAmount = simTotalRevenue;
        effectivePct = ruleSalesPct;
      } else if (emp.role === 'Frontend Developer') {
        basisAmount = simWebRevenue;
        effectivePct = ruleFrontendPct;
      } else if (emp.role === 'Backend Developer') {
        basisAmount = simWebRevenue;
        effectivePct = ruleBackendPct;
      } else if (emp.role === 'SMM Instructor') {
        basisAmount = simSMMCourseRevenue;
        effectivePct = ruleSMMPct;
      } else if (emp.role === 'Data Analytics Instructor') {
        basisAmount = simDataCourseRevenue;
        effectivePct = ruleDataPct;
      } else if (emp.role === 'AI Instructor') {
        basisAmount = simAICourseRevenue;
        effectivePct = ruleAIPct;
      } else {
        basisAmount = simTotalRevenue;
      }

      const calculated = Math.round((basisAmount * effectivePct) / 100);
      const netPayable = calculated + (emp.bonusAmount || 0);

      return {
        ...emp,
        ratePercentage: effectivePct,
        calculatedAmount: calculated,
        netPayable,
        basisAmount,
      };
    });
  }, [
    payrollEmployees,
    simTotalRevenue,
    simWebRevenue,
    simSMMCourseRevenue,
    simDataCourseRevenue,
    simAICourseRevenue,
    ruleSalesPct,
    ruleFrontendPct,
    ruleBackendPct,
    ruleSMMPct,
    ruleDataPct,
    ruleAIPct,
  ]);

  // High-level aggregates
  const totalPayrollFund = enrichedEmployees.reduce((acc, e) => acc + e.netPayable, 0);
  const totalPaidCount = enrichedEmployees.filter((e) => e.paymentStatus === 'Paid').length;
  const totalApprovedCount = enrichedEmployees.filter((e) => e.paymentStatus === 'Approved').length;
  const totalPendingCount = enrichedEmployees.filter((e) => e.paymentStatus === 'Pending').length;
  const agencyRetainedMargin = Math.max(0, simTotalRevenue - totalPayrollFund);
  const marginPercentage = simTotalRevenue > 0 ? Number(((agencyRetainedMargin / simTotalRevenue) * 100).toFixed(1)) : 0;

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return enrichedEmployees.filter((emp) => {
      const matchDept = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchStatus = statusFilter === 'All' || emp.paymentStatus === statusFilter;
      const matchSearch =
        searchKeyword === '' ||
        emp.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchDept && matchStatus && matchSearch;
    });
  }, [enrichedEmployees, departmentFilter, statusFilter, searchKeyword]);

  // Export payroll table to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Əməkdaşın Adı',
      'Vəzifə',
      'Şöbə',
      'Gəlir Bazası ($)',
      'Faiz (%)',
      'Hesablanmış Komissiya ($)',
      'Bonus ($)',
      'Yekun Ödəniləcək ($)',
      'Yekun Ödəniləcək (AZN)',
      'Ödəniş Statusu',
      'Tarix',
    ];

    const rows = filteredEmployees.map((e) => [
      `"${e.id}"`,
      `"${e.name}"`,
      `"${EMPLOYEE_ROLE_LABELS[e.role]}"`,
      `"${e.department}"`,
      e.basisAmount,
      `${e.ratePercentage}%`,
      e.calculatedAmount,
      e.bonusAmount,
      e.netPayable,
      Math.round(e.netPayable * 1.7), // USD to AZN standard conversion rate 1.70
      `"${PAYROLL_STATUS_LABELS[e.paymentStatus]}"`,
      `"${e.paymentDate || '2026-09-15'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SinGroup_Emekhaqqi_Faiz_Cedveli_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Role change helper to update default percentage and basis
  const handleRoleSelect = (role: EmployeeRole) => {
    let dept: PayrollDepartment = 'Sales';
    let rate = 20;
    let basis: EmployeePayroll['revenueBasis'] = 'total_revenue';
    let basisLabel = 'Ümumi Aylıq Gəlir (Bütün Xidmətlər)';

    if (role === 'Sales Manager') {
      dept = 'Sales';
      rate = 20;
      basis = 'total_revenue';
      basisLabel = 'Ümumi Aylıq Gəlir (Bütün Xidmətlər)';
    } else if (role === 'Frontend Developer') {
      dept = 'Engineering';
      rate = 10;
      basis = 'web_dev_revenue';
      basisLabel = 'Veb Proqramlaşdırma Layihələri Gəliri';
    } else if (role === 'Backend Developer') {
      dept = 'Engineering';
      rate = 10;
      basis = 'web_dev_revenue';
      basisLabel = 'Veb Proqramlaşdırma Layihələri Gəliri';
    } else if (role === 'SMM Instructor') {
      dept = 'Academy';
      rate = 40;
      basis = 'smm_course_revenue';
      basisLabel = 'SMM Kursu Təhsil Haqqı Gəliri';
    } else if (role === 'Data Analytics Instructor') {
      dept = 'Academy';
      rate = 40;
      basis = 'data_course_revenue';
      basisLabel = 'Data Analitikası Kursu Təhsil Haqqı Gəliri';
    } else if (role === 'AI Instructor') {
      dept = 'Academy';
      rate = 40;
      basis = 'ai_course_revenue';
      basisLabel = 'AI & Avtomatlaşdırma Kursu Təhsil Haqqı Gəliri';
    }

    setNewEmployee((prev) => ({
      ...prev,
      role,
      department: dept,
      ratePercentage: rate,
      revenueBasis: basis,
      revenueBasisLabel: basisLabel,
    }));
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name.trim()) return;

    addPayrollEmployee(newEmployee);
    setIsAddModalOpen(false);
    setNewEmployee({
      name: '',
      role: 'Sales Manager',
      department: 'Sales',
      phone: '',
      email: '',
      ratePercentage: 20,
      revenueBasis: 'total_revenue',
      revenueBasisLabel: 'Ümumi Aylıq Gəlir (Bütün Xidmətlər)',
      calculatedAmount: 0,
      bonusAmount: 0,
      paymentStatus: 'Pending',
      notes: '',
    });
  };

  const toggleEmployeeStatus = (emp: EmployeePayroll) => {
    const nextStatus: 'Paid' | 'Pending' | 'Approved' =
      emp.paymentStatus === 'Pending'
        ? 'Approved'
        : emp.paymentStatus === 'Approved'
        ? 'Paid'
        : 'Pending';
    updatePayrollEmployee(emp.id, { paymentStatus: nextStatus });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Faizlə Əməkhaqqı Portalı
            </span>
            <span className="text-xs text-slate-400 font-mono">Sin Group Maliyyə v4.2</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-rose-500" />
            Əməkhaqqı və Faiz Hesablanması
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Rəsmi korporativ faiz bölgüsü qaydalarına əsasən real vaxtda hesablanan əməkhaqqı fondu:
            Satış Meneceri (<strong>20%</strong>), Veb Proqramlaşdırma (<strong>10% Front-end + 10% Back-end</strong>) və Müəllimlər (<strong>40% SMM, 40% Data Analitika</strong>).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsSimulatorOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              isSimulatorOpen
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-rose-400" />
            <span>{isSimulatorOpen ? 'Simulyatoru Bağla' : 'Faiz Simulyatoru'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold transition-colors"
            title="Hesablanmış əməkhaqqı cədvəlini CSV sənədi kimi yüklə"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>CSV İxrac</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Əməkdaş Əlavə Et</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue Pool */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ümumi Aylıq Gəlir Bazası
            </span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight font-mono">
              ${simTotalRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">
              (~{(simTotalRevenue * 1.7).toLocaleString()} ₼)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Veb: ${simWebRevenue.toLocaleString()} | Akademiya: ${(simSMMCourseRevenue + simDataCourseRevenue + simAICourseRevenue).toLocaleString()}</span>
          </p>
        </div>

        {/* Card 2: Total Payroll Fund */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Hesablanmış Əməkhaqqı Fondu
            </span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-400 tracking-tight font-mono">
              ${totalPayrollFund.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">
              (~{(totalPayrollFund * 1.7).toLocaleString()} ₼)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="font-bold text-rose-300 font-mono">
              {simTotalRevenue > 0 ? ((totalPayrollFund / simTotalRevenue) * 100).toFixed(1) : 0}%
            </span>
            <span>ümumi daxilolmaların komissiya payı</span>
          </p>
        </div>

        {/* Card 3: Agency Retained Net Margin */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Agentliyin Xalis Qazancı (Qalıq)
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
              ${agencyRetainedMargin.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">
              (~{(agencyRetainedMargin * 1.7).toLocaleString()} ₼)
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Marja: {marginPercentage}%</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
              Sabit Rentabellik
            </span>
          </div>
        </div>

        {/* Card 4: Team Payout Status */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ödəniş və Təsdiq Statusu
            </span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div>
              <span className="text-2xl font-black text-white tracking-tight">
                {enrichedEmployees.length}
              </span>
              <span className="text-xs text-slate-400 ml-1">əməkdaş</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-bold font-mono">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              {totalPaidCount} Ödənilib
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
              {totalApprovedCount} Təsdiq
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
              {totalPendingCount} Gözləyir
            </span>
          </div>
        </div>
      </div>

      {/* Statutory Rules Spotlight Bar (Faiz Qaydaları Kartları) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-extrabold text-white">
              Tələb Edilən Faiz Qaydaları &amp; Şöbə Bölgüsü
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Avtomatlaşdırılmış faiz dərəcələri
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Rule 1: Sales Manager 20% */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Satış Meneceri</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-black text-sm border border-emerald-500/30">
                20%
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Ümumi aylıq gəlirin <strong>20%-i</strong> satış menecerinin əməkhaqqısıdır.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
              <span>Baza: Ümumi Gəlir</span>
              <span className="font-mono text-emerald-400 font-bold">
                ${Math.round((simTotalRevenue * ruleSalesPct) / 100).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Rule 2: Web Development 10% + 10% */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400">
                <Code2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Veb Proqramlaşdırma</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs font-bold">
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  10% Front
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  10% Back
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Veb/İnkişaf layihələrindən <strong>10%-i front-end-in</strong>, <strong>10%-i back-end-in</strong> əmək haqqısıdır.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
              <span>Baza: Veb Gəliri (${simWebRevenue.toLocaleString()})</span>
              <span className="font-mono text-blue-400 font-bold">
                ${Math.round((simWebRevenue * (ruleFrontendPct + ruleBackendPct)) / 100).toLocaleString()} (Cəmi 20%)
              </span>
            </div>
          </div>

          {/* Rule 3: Instructors 40% */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Akademiya Müəllimləri</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-black text-sm border border-purple-500/30">
                40% SMM / 40% Data
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Kurs təhsil haqqından <strong>40% SMM müəlliminə</strong>, <strong>40% data analitika müəlliminə</strong> (və 40% AI) verilir.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
              <span>Baza: Kurs Təhsil Haqqı</span>
              <span className="font-mono text-purple-400 font-bold">
                ${(Math.round((simSMMCourseRevenue * ruleSMMPct) / 100) + Math.round((simDataCourseRevenue * ruleDataPct) / 100) + Math.round((simAICourseRevenue * ruleAIPct) / 100)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Interactive Simulation Sandbox Card */}
      {isSimulatorOpen && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-rose-500/40 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  İnteraktiv Faiz və Gəlir Simulyatoru (Kalkulyator)
                </h3>
                <p className="text-xs text-slate-400">
                  Aylıq büdcə rəqəmlərini və faizləri dəyişərək yekun əməkhaqqı fondunu və xalis gəliri dərhal hesablayın
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSimTotalRevenue(liveFinancials.totalAgencyMonthlyRevenue);
                setSimWebRevenue(liveFinancials.webDevMonthly);
                setSimSMMCourseRevenue(liveFinancials.smmStudentsTotal);
                setSimDataCourseRevenue(liveFinancials.dataStudentsTotal);
                setSimAICourseRevenue(liveFinancials.aiStudentsTotal);
                setRuleSalesPct(20);
                setRuleFrontendPct(10);
                setRuleBackendPct(10);
                setRuleSMMPct(40);
                setRuleDataPct(40);
                setRuleAIPct(40);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold self-start sm:self-center"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sistem Rəqəmlərinə Sıfırla</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Input 1: Total Revenue */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200">Ümumi Aylıq Gəlir ($)</label>
                <span className="text-rose-400 font-mono font-bold">${simTotalRevenue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={200000}
                step={1000}
                value={simTotalRevenue}
                onChange={(e) => setSimTotalRevenue(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400">Dəqiq Məbləğ:</span>
                <input
                  type="number"
                  value={simTotalRevenue}
                  onChange={(e) => setSimTotalRevenue(Number(e.target.value))}
                  className="w-28 px-2 py-1 text-xs rounded bg-slate-900 border border-slate-750 text-white font-mono"
                />
              </div>
            </div>

            {/* Input 2: Web Dev Revenue */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200">Veb Layihələri Gəliri ($)</label>
                <span className="text-blue-400 font-mono font-bold">${simWebRevenue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={100000}
                step={500}
                value={simWebRevenue}
                onChange={(e) => setSimWebRevenue(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400">Dəqiq Məbləğ:</span>
                <input
                  type="number"
                  value={simWebRevenue}
                  onChange={(e) => setSimWebRevenue(Number(e.target.value))}
                  className="w-28 px-2 py-1 text-xs rounded bg-slate-900 border border-slate-750 text-white font-mono"
                />
              </div>
            </div>

            {/* Input 3: SMM Course Tuition */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200">SMM Kursu Təhsil Haqqı ($)</label>
                <span className="text-amber-400 font-mono font-bold">${simSMMCourseRevenue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={30000}
                step={200}
                value={simSMMCourseRevenue}
                onChange={(e) => setSimSMMCourseRevenue(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400">Dəqiq Məbləğ:</span>
                <input
                  type="number"
                  value={simSMMCourseRevenue}
                  onChange={(e) => setSimSMMCourseRevenue(Number(e.target.value))}
                  className="w-28 px-2 py-1 text-xs rounded bg-slate-900 border border-slate-750 text-white font-mono"
                />
              </div>
            </div>

            {/* Input 4: Data Analytics Course Tuition */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200">Data Analitika Təhsil Haqqı ($)</label>
                <span className="text-purple-400 font-mono font-bold">${simDataCourseRevenue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={30000}
                step={200}
                value={simDataCourseRevenue}
                onChange={(e) => setSimDataCourseRevenue(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400">Dəqiq Məbləğ:</span>
                <input
                  type="number"
                  value={simDataCourseRevenue}
                  onChange={(e) => setSimDataCourseRevenue(Number(e.target.value))}
                  className="w-28 px-2 py-1 text-xs rounded bg-slate-900 border border-slate-750 text-white font-mono"
                />
              </div>
            </div>

            {/* Input 5: AI Course Tuition */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200">AI Kursu Təhsil Haqqı ($)</label>
                <span className="text-cyan-400 font-mono font-bold">${simAICourseRevenue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={40000}
                step={200}
                value={simAICourseRevenue}
                onChange={(e) => setSimAICourseRevenue(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400">Dəqiq Məbləğ:</span>
                <input
                  type="number"
                  value={simAICourseRevenue}
                  onChange={(e) => setSimAICourseRevenue(Number(e.target.value))}
                  className="w-28 px-2 py-1 text-xs rounded bg-slate-900 border border-slate-750 text-white font-mono"
                />
              </div>
            </div>

            {/* Percentage Controls */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200 block">Faiz Dərəcələri Tənzimlənməsi</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Satış</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={ruleSalesPct}
                      onChange={(e) => setRuleSalesPct(Number(e.target.value))}
                      className="w-full px-1.5 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Veb (F/B)</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={ruleFrontendPct}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRuleFrontendPct(val);
                        setRuleBackendPct(val);
                      }}
                      className="w-full px-1.5 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Müəllimlər</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={ruleSMMPct}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRuleSMMPct(val);
                        setRuleDataPct(val);
                        setRuleAIPct(val);
                      }}
                      className="w-full px-1.5 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-emerald-400 mt-1">
                Dəyişikliklər dərhal aşağıdakı əməkhaqqı cədvəlində əks olunur!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Section: Filters, Search, Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* Table Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Department Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start">
            <button
              onClick={() => setDepartmentFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                departmentFilter === 'All'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bütün Şöbələr ({enrichedEmployees.length})
            </button>
            <button
              onClick={() => setDepartmentFilter('Sales')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                departmentFilter === 'Sales'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Satış (20%)
            </button>
            <button
              onClick={() => setDepartmentFilter('Engineering')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                departmentFilter === 'Engineering'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Veb Proqramlaşdırma (10%+10%)
            </button>
            <button
              onClick={() => setDepartmentFilter('Academy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                departmentFilter === 'Academy'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Akademiya (40%)
            </button>
          </div>

          {/* Search and Status filter */}
          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Əməkdaş axtarışı..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-rose-500 font-semibold"
            >
              <option value="All">Bütün Statuslar</option>
              <option value="Paid">Yalnız Ödənilənlər</option>
              <option value="Approved">Yalnız Təsdiqlənənlər</option>
              <option value="Pending">Yalnız Gözləmədə</option>
            </select>
          </div>
        </div>

        {/* The Payroll Records Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Əməkdaş</th>
                <th className="py-3.5 px-3">Şöbə &amp; Vəzifə</th>
                <th className="py-3.5 px-3">Gəlir Bazası</th>
                <th className="py-3.5 px-3">Təsdiqlənmiş Faiz</th>
                <th className="py-3.5 px-3">Komissiya Məbləği</th>
                <th className="py-3.5 px-3">Bonus</th>
                <th className="py-3.5 px-3">Yekun Maaş (USD / AZN)</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Axtarış meyarlarına uyğun heç bir əməkdaş tapılmadı.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Employee info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {emp.avatar ? (
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold flex items-center justify-center shrink-0">
                              {emp.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                              {emp.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department & Role */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              emp.department === 'Sales'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : emp.department === 'Engineering'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {emp.department === 'Sales'
                              ? 'Satış Şöbəsi'
                              : emp.department === 'Engineering'
                              ? 'Proqramlaşdırma'
                              : 'Akademiya Tədris'}
                          </span>
                          <p className="text-[11px] text-slate-300 font-medium">
                            {EMPLOYEE_ROLE_LABELS[emp.role]}
                          </p>
                        </div>
                      </td>

                      {/* Revenue basis */}
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-200 block">
                          ${emp.basisAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                          {emp.revenueBasisLabel}
                        </span>
                      </td>

                      {/* Rate Percentage Badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-black ${
                            emp.role === 'Sales Manager'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : emp.role === 'Frontend Developer' || emp.role === 'Backend Developer'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          }`}
                        >
                          {emp.ratePercentage}%
                        </span>
                      </td>

                      {/* Calculated commission */}
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        ${emp.calculatedAmount.toLocaleString()}
                      </td>

                      {/* Bonus */}
                      <td className="py-3 px-3 font-mono text-emerald-400">
                        {emp.bonusAmount > 0 ? `+$${emp.bonusAmount}` : '$0'}
                      </td>

                      {/* Net Payable */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-black text-rose-400 text-sm">
                          ${emp.netPayable.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          ~{(emp.netPayable * 1.7).toLocaleString()} ₼
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleEmployeeStatus(emp)}
                          title="Statusu dəyişmək üçün klikləyin"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-transform active:scale-95 ${
                            emp.paymentStatus === 'Paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : emp.paymentStatus === 'Approved'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {emp.paymentStatus === 'Paid' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : emp.paymentStatus === 'Approved' ? (
                            <Clock className="w-3.5 h-3.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5" />
                          )}
                          <span>{PAYROLL_STATUS_LABELS[emp.paymentStatus]}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEmployeeSlip(emp)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Ödəniş Qəbzi & Detallar"
                          >
                            <FileText className="w-4 h-4 text-rose-400" />
                          </button>
                          <button
                            onClick={() => deletePayrollEmployee(emp.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Siyahıdan Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Inspection Modal ("Ödəniş Qəbzi") */}
      {selectedEmployeeSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <SinGroupLogo variant="icon" size="sm" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Rəsmi Kompensasiya Qəbzi</h3>
                  <p className="text-xs text-slate-400">Sin Group Medya Maliyyə Departamenti</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployeeSlip(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Employee Summary Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3.5">
                {selectedEmployeeSlip.avatar ? (
                  <img
                    src={selectedEmployeeSlip.avatar}
                    alt={selectedEmployeeSlip.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold flex items-center justify-center text-sm shrink-0">
                    {selectedEmployeeSlip.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-extrabold text-white">
                    {selectedEmployeeSlip.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {EMPLOYEE_ROLE_LABELS[selectedEmployeeSlip.role]} • {selectedEmployeeSlip.department}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedEmployeeSlip.email} | {selectedEmployeeSlip.phone}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedEmployeeSlip.paymentStatus === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : selectedEmployeeSlip.paymentStatus === 'Approved'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {PAYROLL_STATUS_LABELS[selectedEmployeeSlip.paymentStatus]}
                  </span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Hesablama Bazası:</span>
                  <span className="font-mono text-white font-bold">
                    ${selectedEmployeeSlip.basisAmount.toLocaleString()} ({selectedEmployeeSlip.revenueBasisLabel})
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Təyin Olunmuş Faiz:</span>
                  <span className="font-mono text-rose-400 font-extrabold text-sm">
                    {selectedEmployeeSlip.ratePercentage}%
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Hesablanmış Komissiya:</span>
                  <span className="font-mono text-white font-bold">
                    ${selectedEmployeeSlip.calculatedAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Əlavə Bonus / Mükafat:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    +${selectedEmployeeSlip.bonusAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-sm font-black text-white block">Yekun Ödəniləcək Məbləğ:</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      AZN ekvivalenti (1 USD = 1.70 AZN)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-rose-400 font-mono block">
                      ${selectedEmployeeSlip.netPayable.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-300 font-mono">
                      ~{(selectedEmployeeSlip.netPayable * 1.7).toLocaleString()} ₼
                    </span>
                  </div>
                </div>
              </div>

              {selectedEmployeeSlip.notes && (
                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-[11px] text-slate-400">
                  <strong className="text-slate-300">Qeyd:</strong> {selectedEmployeeSlip.notes}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-800">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Çap Et</span>
              </button>

              <button
                onClick={() => setSelectedEmployeeSlip(null)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Yeni Əməkdaş Əlavə Et</h3>
                  <p className="text-xs text-slate-400">Faiz dərəcəsi və gəlir bazasını müəyyən edin</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Əməkdaşın Adı və Soyadı *</label>
                <input
                  type="text"
                  required
                  placeholder="məs. Elvin Qasımov"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Vəzifə / Rol</label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => handleRoleSelect(e.target.value as EmployeeRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500 font-semibold"
                  >
                    <option value="Sales Manager">Satış Meneceri (20%)</option>
                    <option value="Frontend Developer">Front-end Proqramçı (10%)</option>
                    <option value="Backend Developer">Back-end Proqramçı (10%)</option>
                    <option value="SMM Instructor">SMM Müəllimi (40%)</option>
                    <option value="Data Analytics Instructor">Data Analitika Müəllimi (40%)</option>
                    <option value="AI Instructor">Süni İntellekt (AI) Müəllimi (40%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Müəyyən Olunmuş Faiz (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newEmployee.ratePercentage}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, ratePercentage: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Telefon</label>
                  <input
                    type="text"
                    placeholder="+994 50 123 45 67"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">E-poçt</label>
                  <input
                    type="email"
                    placeholder="ad@singroup.az"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Bonus Məbləği ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={newEmployee.bonusAmount}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, bonusAmount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">İlkin Ödəniş Statusu</label>
                  <select
                    value={newEmployee.paymentStatus}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, paymentStatus: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Pending">Gözləmədə</option>
                    <option value="Approved">Təsdiqləndi</option>
                    <option value="Paid">Ödənildi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Qeydlər</label>
                <textarea
                  rows={2}
                  placeholder="Xüsusi razılaşmalar, müqavilə nömrəsi və s."
                  value={newEmployee.notes}
                  onChange={(e) => setNewEmployee({ ...newEmployee, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Ləğv Et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md"
                >
                  Yadda Saxla &amp; Əlavə Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
