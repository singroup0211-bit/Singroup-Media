import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  BookOpen,
  DollarSign,
  Download,
  Calendar,
  X,
  FileCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Student,
  CourseTrack,
  PaymentStatus,
  CertificateStatus,
  COURSE_TRACK_LABELS,
  PAYMENT_STATUS_LABELS,
  CERTIFICATE_STATUS_LABELS,
} from '../../types';
import { SinGroupLogo } from '../common/SinGroupLogo';

export const AcademyPortal: React.FC = () => {
  const { students, addStudent, updateStudent, courseTracks, searchQuery } = useApp();

  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [selectedPayment, setSelectedPayment] = useState<string>('All');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [inspectingStudent, setInspectingStudent] = useState<Student | null>(null);

  // Enroll form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTrack, setFormTrack] = useState<CourseTrack>('Social Media Marketing (SMM)');
  const [formCohort, setFormCohort] = useState('SMM-Cohort-05');
  const [formPayment, setFormPayment] = useState<PaymentStatus>('Full');
  const [formPaidAmount, setFormPaidAmount] = useState('950');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !searchQuery ||
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.cohortGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTrack = selectedTrack === 'All' || s.courseTrack === selectedTrack;
      const matchPayment = selectedPayment === 'All' || s.paymentStatus === selectedPayment;

      return matchSearch && matchTrack && matchPayment;
    });
  }, [students, searchQuery, selectedTrack, selectedPayment]);

  // Aggregate metrics
  const totalStudents = students.length;
  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1)
  );
  const totalTuitionCollected = students.reduce((acc, s) => acc + s.paidAmount, 0);
  const totalTuitionReceivable = students.reduce((acc, s) => acc + s.totalFee, 0);

  // Handle Enroll submit
  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formName.trim()) errors.name = 'Tələbənin tam adı tələb olunur';
    if (!formPhone.trim()) errors.phone = 'Telefon nömrəsi tələb olunur';

    const trackFee =
      formTrack === 'Artificial Intelligence (AI & Automation)'
        ? 1400
        : formTrack === 'Data Analytics'
        ? 1250
        : 950;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addStudent({
      studentName: formName.trim(),
      email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@student.az`,
      phone: formPhone.trim(),
      courseTrack: formTrack,
      cohortGroup: formCohort.trim() || 'Aktiv Kohort',
      attendanceRate: 100,
      paymentStatus: formPayment,
      totalFee: trackFee,
      paidAmount: Number(formPaidAmount) || trackFee,
      certificateStatus: 'In Progress',
      enrollmentDate: new Date().toISOString().split('T')[0],
      graduationDate: '2026-11-15',
      progressMilestone: 'Oriyentasiya və Modul 1 Əsasları',
      mentorName:
        formTrack === 'Social Media Marketing (SMM)'
          ? 'Aydan Cəfərova'
          : formTrack === 'Data Analytics'
          ? 'Dr. Rövşən Quliyev'
          : 'Vüsal Rüstəmov',
    });

    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormPaidAmount('950');
    setFormErrors({});
    setIsEnrollModalOpen(false);
  };

  // Export roster
  const handleExportRoster = () => {
    const headers = ['Tələbənin Adı', 'Tədris İstiqaməti', 'Qrup (Kohort)', 'Davamiyyət (%)', 'Ödəniş Statusu', 'Ödənilən ($)', 'Cəmi ($)', 'Sertifikat'];
    const rows = filteredStudents.map((s) => [
      `"${s.studentName}"`,
      `"${s.courseTrack}"`,
      `"${s.cohortGroup}"`,
      `${s.attendanceRate}%`,
      `"${s.paymentStatus}"`,
      s.paidAmount,
      s.totalFee,
      `"${s.certificateStatus}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SinGroup_Akademiya_Siyahi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="academy-portal-module" className="space-y-6 pb-12">
      {/* Header with Sin Group Logo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner shrink-0">
            <SinGroupLogo variant="icon" size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 font-mono">
                Sin Group Medya • Akademiya Portalı
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Texnologiya &amp; Media Təhsili</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Təlim &amp; Akademiya İdarəetməsi
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Üç flaqman sənaye istiqaməti: SMM Strategiyası, Data Analitikası və AI &amp; Avtomatlaşdırma kohortları.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            id="export-roster-btn"
            onClick={handleExportRoster}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Siyahını İxrac Et</span>
          </button>

          <button
            id="enroll-student-btn"
            onClick={() => setIsEnrollModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Tələbə Qeydiyyatı</span>
          </button>
        </div>
      </div>

      {/* 3 Distinct Course Tracks Showcase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {courseTracks.map((track) => {
          const trackStudents = students.filter((s) => s.courseTrack === track.track);
          const capacityPct = Math.round((track.activeStudents / track.maxCapacity) * 100);

          return (
            <div
              key={track.id}
              onClick={() => setSelectedTrack(selectedTrack === track.track ? 'All' : track.track)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                selectedTrack === track.track
                  ? 'bg-slate-900 border-rose-500 ring-1 ring-rose-500/50 shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      track.track.includes('AI')
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : track.track.includes('Data')
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    Track {track.track.split(' ')[0]}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    ${track.tuitionFee} USD
                  </span>
                </div>

                <h3 className="text-base font-black text-white leading-snug">{COURSE_TRACK_LABELS[track.track] || track.track}</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{track.title}</p>

                <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Tələbə Tutumu:</span>
                    <span className="font-bold text-white">
                      {track.activeStudents} / {track.maxCapacity} Yer ({capacityPct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        capacityPct >= 90
                          ? 'bg-rose-500'
                          : capacityPct >= 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${capacityPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Bitirmə Dərəcəsi:</span>
                    <span className="font-bold text-emerald-400">{track.completionRate}%</span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-400">
                  <span className="block font-semibold text-slate-300">
                    Aparıcı Təlimçi: {track.leadInstructor}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    Müddət: {track.durationWeeks} Həftə ({track.totalHours} Saat Canlı Dərs)
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-rose-400 font-medium">Növbəti Kohort: {track.nextCohortDate}</span>
                <span className="text-slate-400 font-semibold">{trackStudents.length} Tələbə</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student & Cohort Management Table */}
      <div className="space-y-4">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Tədris İstiqaməti:</span>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200"
            >
              <option value="All">Bütün 3 İstiqamət</option>
              <option value="Social Media Marketing (SMM)">Sosial Media Marketinqi (SMM)</option>
              <option value="Data Analytics">Data Analitikası</option>
              <option value="Artificial Intelligence (AI & Automation)">
                Süni İntellekt (AI &amp; Avtomatlaşdırma)
              </option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Ödəniş Statusu:</span>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200"
            >
              <option value="All">Bütün Ödəniş Statusları</option>
              <option value="Full">Tam ödənilib</option>
              <option value="Installment">Hissə-hissə</option>
              <option value="Pending">Gözləmədə</option>
              <option value="Overdue">Gecikmədə</option>
            </select>
          </div>

          <div className="text-slate-400 font-mono">
            Qeydiyyatda: {filteredStudents.length} tələbə
          </div>
        </div>

        {/* Student Table */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Tələbənin Adı</th>
                  <th className="py-3.5 px-4 font-bold">Tədris İstiqaməti &amp; Qrup</th>
                  <th className="py-3.5 px-4 font-bold">Davamiyyət Dərəcəsi</th>
                  <th className="py-3.5 px-4 font-bold">Təhsil Haqqı Statusu</th>
                  <th className="py-3.5 px-4 font-bold">Sertifikat Statusu</th>
                  <th className="py-3.5 px-4 font-bold">Buraxılış / Mərhələ Qeydi</th>
                  <th className="py-3.5 px-4 font-bold text-right">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Filtrlərə uyğun tələbə tapılmadı.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setInspectingStudent(s)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{s.studentName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {s.phone} • {s.email}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">
                          {COURSE_TRACK_LABELS[s.courseTrack] || s.courseTrack}
                        </div>
                        <div className="text-[11px] text-rose-400 font-mono mt-0.5">
                          {s.cohortGroup}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                              s.attendanceRate >= 90
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : s.attendanceRate >= 80
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {s.attendanceRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={s.paymentStatus}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateStudent(s.id, {
                              paymentStatus: e.target.value as PaymentStatus,
                            });
                          }}
                          className={`text-[11px] rounded-lg px-2 py-1 font-bold border focus:outline-none ${
                            s.paymentStatus === 'Full'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                              : s.paymentStatus === 'Installment'
                              ? 'bg-blue-950 text-blue-300 border-blue-700'
                              : s.paymentStatus === 'Overdue'
                              ? 'bg-rose-950 text-rose-300 border-rose-700'
                              : 'bg-amber-950 text-amber-300 border-amber-700'
                          }`}
                        >
                          <option value="Full">Tam ödənilib (${s.paidAmount})</option>
                          <option value="Installment">Hissə-hissə (${s.paidAmount}/${s.totalFee})</option>
                          <option value="Pending">Gözləmədə</option>
                          <option value="Overdue">Gecikmədə</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.certificateStatus === 'Issued'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : s.certificateStatus === 'Eligible'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : s.certificateStatus === 'In Progress'
                              ? 'bg-slate-800 text-slate-300'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {CERTIFICATE_STATUS_LABELS[s.certificateStatus] || s.certificateStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="line-clamp-1 text-slate-300 text-[11px]">
                          {s.progressMilestone}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Mentor: {s.mentorName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingStudent(s);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        >
                          Baxış
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

      {/* Enroll New Student Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <SinGroupLogo variant="icon" size="sm" />
                <div>
                  <h3 className="text-base font-bold text-white">Tələbəni Akademiyaya Qeydiyyatdan Keçir</h3>
                  <p className="text-xs text-slate-400">Sin Group Medya Akademiya Reyestri</p>
                </div>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollStudent} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Tələbənin Tam Adı *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Murad Qasımov"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  {formErrors.name && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Telefon / WhatsApp *
                  </label>
                  <input
                    type="text"
                    placeholder="+994 50 555 44 33"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  {formErrors.phone && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    E-poçt Ünvanı
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Tədris İstiqaməti *
                  </label>
                  <select
                    value={formTrack}
                    onChange={(e) => {
                      const newTrack = e.target.value as CourseTrack;
                      setFormTrack(newTrack);
                      setFormCohort(
                        newTrack.includes('AI')
                          ? 'AI-Cohort-03'
                          : newTrack.includes('Data')
                          ? 'Data-Cohort-03'
                          : 'SMM-Cohort-05'
                      );
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Social Media Marketing (SMM)">Sosial Media Marketinqi (SMM)</option>
                    <option value="Data Analytics">Data Analitikası</option>
                    <option value="Artificial Intelligence (AI & Automation)">
                      Süni İntellekt (AI &amp; Avtomatlaşdırma)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Qrup (Kohort)</label>
                  <input
                    type="text"
                    value={formCohort}
                    onChange={(e) => setFormCohort(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Ödəniş Statusu</label>
                  <select
                    value={formPayment}
                    onChange={(e) => setFormPayment(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Full">Tam ödəniş (İlkin)</option>
                    <option value="Installment">Hissə-hissə (1-ci Hissə)</option>
                    <option value="Pending">Bank köçürməsi gözlənilir</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Ödənilən Məbləğ ($)</label>
                  <input
                    type="number"
                    value={formPaidAmount}
                    onChange={(e) => setFormPaidAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Ləğv Et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40"
                >
                  Tələbəni Qeydiyyata Al
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Student Modal */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-rose-500 font-bold uppercase">
                  {inspectingStudent.id}
                </span>
                <h3 className="text-lg font-black text-white">{inspectingStudent.studentName}</h3>
                <p className="text-xs text-slate-400">
                  {inspectingStudent.email} • {inspectingStudent.phone}
                </p>
              </div>
              <button
                onClick={() => setInspectingStudent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Tədris İstiqaməti
                </span>
                <span className="text-sm font-bold text-white block">
                  {COURSE_TRACK_LABELS[inspectingStudent.courseTrack] || inspectingStudent.courseTrack}
                </span>
                <span className="text-xs text-rose-400 font-mono mt-0.5 block">
                  Qrup (Kohort): {inspectingStudent.cohortGroup}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Davamiyyət</span>
                  <span className="text-base font-bold text-emerald-400 mt-0.5 block">
                    {inspectingStudent.attendanceRate}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Sertifikat</span>
                  <span className="text-base font-bold text-cyan-400 mt-0.5 block">
                    {CERTIFICATE_STATUS_LABELS[inspectingStudent.certificateStatus] || inspectingStudent.certificateStatus}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Təhsil Haqqı Ödənişi</span>
                  <span className="font-bold text-slate-200">
                    ${inspectingStudent.paidAmount} / ${inspectingStudent.totalFee} USD
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-1">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${Math.round(
                        (inspectingStudent.paidAmount / (inspectingStudent.totalFee || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Status: {PAYMENT_STATUS_LABELS[inspectingStudent.paymentStatus] || inspectingStudent.paymentStatus}</span>
                  <span>Mentor: {inspectingStudent.mentorName}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Mərhələ &amp; Yekun Layihə (Capstone)
                </span>
                <p className="text-slate-300 leading-relaxed">{inspectingStudent.progressMilestone}</p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={() => setInspectingStudent(null)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
