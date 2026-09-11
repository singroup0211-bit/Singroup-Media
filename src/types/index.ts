export type AppModule = 'dashboard' | 'dev-hub' | 'smm' | 'sales' | 'academy' | 'payroll';

export type ServiceType = 
  | 'Web Development' 
  | 'Internal Management Systems (Custom ERP/CRM)' 
  | 'Mobile Apps';

export type DevStatus = 
  | 'Backlog' 
  | 'In Progress' 
  | 'Code Review/QA' 
  | 'Client Testing' 
  | 'Deployed';

export interface DevProject {
  id: string;
  projectName: string;
  clientName: string;
  serviceType: ServiceType;
  assignedTeam: {
    frontend: string;
    backend: string;
    uiux: string;
  };
  startDate: string;
  deadlineDate: string;
  budget: number;
  spentBudget: number;
  currentMilestone: string;
  status: DevStatus;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  progressPercentage: number;
  description: string;
  techStack: string[];
}

export type RetainerPackage = 
  | 'Starter Brand' 
  | 'Growth Pro' 
  | 'Enterprise Scale' 
  | 'Custom 360°';

export type SocialPlatform = 
  | 'Instagram' 
  | 'TikTok' 
  | 'LinkedIn' 
  | 'YouTube' 
  | 'Facebook';

export type CampaignStatus = 
  | 'Active' 
  | 'Content Approval' 
  | 'Paused' 
  | 'Completed';

export interface SMMCampaign {
  id: string;
  brandName: string;
  retainerPackage: RetainerPackage;
  platforms: SocialPlatform[];
  assignedCreator: string;
  assignedMediaBuyer: string;
  monthlyPostQuota: number;
  postsPublished: number;
  reelsQuota: number;
  reelsPublished: number;
  adBudgetAllocated: number;
  adBudgetSpent: number;
  campaignStatus: CampaignStatus;
  startDate: string;
  renewalDate: string;
  targetAudience: string;
  engagementRate: number; // e.g., 4.8%
}

export type ContentItemStatus = 
  | 'Idea' 
  | 'Scripting' 
  | 'Shooting' 
  | 'Editing' 
  | 'Approved' 
  | 'Scheduled' 
  | 'Published';

export interface SMMContentItem {
  id: string;
  campaignId: string;
  brandName: string;
  title: string;
  platform: SocialPlatform;
  contentType: 'Reel' | 'Carousel' | 'Static Post' | 'Story' | 'Shorts';
  scheduledDate: string;
  status: ContentItemStatus;
  creator: string;
  captionPreview: string;
}

export type LeadStage = 
  | 'Contacted' 
  | 'Responded' 
  | 'Proposal Sent' 
  | 'Won' 
  | 'Lost';

export interface LeadLog {
  id: string;
  timestamp: string;
  agentName: string;
  type: 'Call' | 'Meeting' | 'Email' | 'WhatsApp / DM' | 'Proposal';
  notes: string;
  followUpReminder?: string;
  previousStage?: LeadStage;
  newStage?: LeadStage;
}

export interface Lead {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  serviceInterested: 'Dev & ERP' | 'SMM & Marketing' | 'Academy Training' | 'Enterprise Bundle';
  stage: LeadStage;
  outreachType: 'Cold Outreach' | 'Warm Referral' | 'Inbound Lead' | 'Social Media DM';
  assignedAgent: string;
  dealValue: number;
  probability: number;
  lastContactDate: string;
  nextFollowUpDate: string;
  contactAttemptsCount: number;
  feedbackNotes: string;
  logs: LeadLog[];
}

export interface SalesAgent {
  id: string;
  name: string;
  avatar: string;
  email: string;
  contactsMade: number;
  responsesCount: number;
  responseRate: number; // percentage
  wonDeals: number;
  conversionRate: number; // percentage
  closedRevenue: number;
  targetRevenue: number;
  activeLeadsCount: number;
}

export type CourseTrack = 
  | 'Social Media Marketing (SMM)' 
  | 'Data Analytics' 
  | 'Artificial Intelligence (AI & Automation)';

export type PaymentStatus = 
  | 'Full' 
  | 'Installment' 
  | 'Pending' 
  | 'Overdue';

export type CertificateStatus = 
  | 'Eligible' 
  | 'In Progress' 
  | 'Issued' 
  | 'On Hold';

export interface Student {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  courseTrack: CourseTrack;
  cohortGroup: string;
  attendanceRate: number; // percentage e.g. 92
  paymentStatus: PaymentStatus;
  totalFee: number;
  paidAmount: number;
  certificateStatus: CertificateStatus;
  enrollmentDate: string;
  graduationDate: string;
  progressMilestone: string;
  mentorName: string;
}

export interface CourseTrackOverview {
  id: string;
  track: CourseTrack;
  title: string;
  leadInstructor: string;
  durationWeeks: number;
  totalHours: number;
  activeStudents: number;
  maxCapacity: number;
  completionRate: number;
  nextCohortDate: string;
  tuitionFee: number;
  syllabusHighlights: string[];
}

export interface UrgentAlert {
  id: string;
  type: 'deadline' | 'payment' | 'lead' | 'approval' | 'system';
  title: string;
  message: string;
  timeAgo: string;
  severity: 'urgent' | 'warning' | 'info' | 'success';
  module: AppModule;
  actionText?: string;
}

export interface ActivityFeedItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  module: AppModule;
  timeAgo: string;
  badgeColor?: string;
}

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  'Web Development': 'Veb Proqramlaşdırma',
  'Internal Management Systems (Custom ERP/CRM)': 'Daxili İdarəetmə Sistemləri (ERP/CRM)',
  'Mobile Apps': 'Mobil Tətbiqlər',
};

export const DEV_STATUS_LABELS: Record<DevStatus, string> = {
  'Backlog': 'Planlaşdırma (Backlog)',
  'In Progress': 'İcrada',
  'Code Review/QA': 'Kod Yoxlanışı / QA',
  'Client Testing': 'Müştəri Sınağı',
  'Deployed': 'Təhvil verildi',
};

export const PRIORITY_LABELS: Record<string, string> = {
  'Urgent': 'Təcili',
  'High': 'Yüksək',
  'Medium': 'Orta',
  'Low': 'Aşağı',
};

export const LEAD_STAGE_LABELS: Record<LeadStage, { label: string; sublabel: string }> = {
  'Contacted': { label: 'Əlaqə saxlanıldı', sublabel: 'Soyuq və İsti Əlaqələr' },
  'Responded': { label: 'Geri dönüş edənlər', sublabel: 'Cavab verdi və Maraqlandı' },
  'Proposal Sent': { label: 'Təklif / Görüş', sublabel: 'Təqdimat və Müzakirə' },
  'Won': { label: 'Satış bağlananlar', sublabel: 'Müqavilə İmzalandı' },
  'Lost': { label: 'İmtina / Uğursuz', sublabel: 'Büdcə / Təxirə salındı' },
};

export const COURSE_TRACK_LABELS: Record<CourseTrack, string> = {
  'Social Media Marketing (SMM)': 'Sosial Media Marketinqi (SMM)',
  'Data Analytics': 'Data Analitikası',
  'Artificial Intelligence (AI & Automation)': 'Süni İntellekt (AI & Avtomatlaşdırma)',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  'Full': 'Tam ödənilib',
  'Installment': 'Hissə-hissə',
  'Pending': 'Gözləmədə',
  'Overdue': 'Gecikmədə',
};

export const CERTIFICATE_STATUS_LABELS: Record<CertificateStatus, string> = {
  'Eligible': 'Uyğundur',
  'In Progress': 'Davam edir',
  'Issued': 'Təqdim edildi',
  'On Hold': 'Saxlanılıb',
};

export const CONTENT_STATUS_LABELS: Record<ContentItemStatus, string> = {
  'Idea': 'İdeya və Beyin Həmləsi',
  'Scripting': 'Kopiraytinq və Ssenari',
  'Shooting': 'İstehsalat / Çəkiliş',
  'Editing': 'Video Montaj və Animasiya',
  'Approved': 'Müştəri Təsdiqi',
  'Scheduled': 'Planlaşdırılmış Növbə',
  'Published': 'Yayımlandı / Canlı',
};

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  'Active': 'Aktiv',
  'Content Approval': 'Məzmun Təsdiqi',
  'Paused': 'Dayandırılıb',
  'Completed': 'Tamamlandı',
};

export const RETAINER_PACKAGE_LABELS: Record<RetainerPackage, string> = {
  'Starter Brand': 'Başlanğıc Brend',
  'Growth Pro': 'İnkişaf Pro',
  'Enterprise Scale': 'Böyük Müəssisə',
  'Custom 360°': 'Xüsusi 360°',
};

export const SERVICE_INTERESTED_LABELS: Record<string, string> = {
  'Dev & ERP': 'İnkişaf & ERP',
  'SMM & Marketing': 'SMM & Marketinq',
  'Academy Training': 'Akademiya Təlimi',
  'Enterprise Bundle': 'Korporativ Paket',
};

export const OUTREACH_TYPE_LABELS: Record<string, string> = {
  'Cold Outreach': 'Soyuq Əlaqə',
  'Warm Referral': 'Tövsiyə (Referal)',
  'Inbound Lead': 'Daxil Olan Sorğu',
  'Social Media DM': 'Sosial Media DM',
};

export const LOG_TYPE_LABELS: Record<string, string> = {
  'Call': 'Telefon Zəngi',
  'Meeting': 'Canlı / Onlayn Görüş',
  'Email': 'E-poçt Yazışması',
  'WhatsApp / DM': 'WhatsApp / Sosial DM',
  'Proposal': 'Texniki Təklif Göndərildi',
};

export type EmployeeRole = 
  | 'Sales Manager'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'SMM Instructor'
  | 'Data Analytics Instructor'
  | 'AI Instructor';

export type PayrollDepartment = 
  | 'Sales'
  | 'Engineering'
  | 'Academy';

export interface EmployeePayroll {
  id: string;
  name: string;
  role: EmployeeRole;
  department: PayrollDepartment;
  avatar?: string;
  phone: string;
  email: string;
  ratePercentage: number; // 20 for sales, 10 for frontend, 10 for backend, 40 for SMM, 40 for Data, etc.
  revenueBasis: 'total_revenue' | 'web_dev_revenue' | 'smm_course_revenue' | 'data_course_revenue' | 'ai_course_revenue';
  revenueBasisLabel: string;
  calculatedAmount: number; // in USD
  bonusAmount: number; // bonus or manual deduction
  paymentStatus: 'Paid' | 'Pending' | 'Approved';
  paymentDate?: string;
  notes?: string;
}

export const EMPLOYEE_ROLE_LABELS: Record<EmployeeRole, string> = {
  'Sales Manager': 'Satış Meneceri',
  'Frontend Developer': 'Front-end Proqramçı',
  'Backend Developer': 'Back-end Proqramçı',
  'SMM Instructor': 'SMM Təlimçisi / Müəllimi',
  'Data Analytics Instructor': 'Data Analitika Müəllimi',
  'AI Instructor': 'Süni İntellekt (AI) Müəllimi',
};

export const PAYROLL_STATUS_LABELS: Record<'Paid' | 'Pending' | 'Approved', string> = {
  'Paid': 'Ödənildi',
  'Pending': 'Gözləmədə',
  'Approved': 'Təsdiqləndi',
};

