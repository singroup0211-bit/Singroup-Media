import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppModule,
  DevProject,
  SMMCampaign,
  SMMContentItem,
  Lead,
  SalesAgent,
  Student,
  CourseTrackOverview,
  UrgentAlert,
  ActivityFeedItem,
  LeadStage,
  DevStatus,
  EmployeePayroll,
} from '../types';
import {
  INITIAL_DEV_PROJECTS,
  INITIAL_SMM_CAMPAIGNS,
  INITIAL_CONTENT_CALENDAR,
  INITIAL_LEADS,
  INITIAL_SALES_AGENTS,
  COURSE_TRACKS,
  INITIAL_STUDENTS,
  INITIAL_URGENT_ALERTS,
  INITIAL_ACTIVITY_FEED,
  INITIAL_PAYROLL_EMPLOYEES,
} from '../data/mockData';

interface AppContextType {
  currentModule: AppModule;
  setCurrentModule: (m: AppModule) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Dev Projects
  projects: DevProject[];
  addProject: (project: Omit<DevProject, 'id'>) => void;
  updateProject: (id: string, updates: Partial<DevProject>) => void;
  deleteProject: (id: string) => void;
  updateProjectStatus: (id: string, newStatus: DevStatus) => void;

  // SMM
  campaigns: SMMCampaign[];
  addCampaign: (campaign: Omit<SMMCampaign, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<SMMCampaign>) => void;
  contentCalendar: SMMContentItem[];
  addContentItem: (item: Omit<SMMContentItem, 'id'>) => void;
  updateContentItem: (id: string, updates: Partial<SMMContentItem>) => void;

  // Sales CRM
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'logs'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStage: (id: string, newStage: LeadStage) => void;
  logLeadContact: (
    leadId: string,
    log: {
      agentName: string;
      type: 'Call' | 'Meeting' | 'Email' | 'WhatsApp / DM' | 'Proposal';
      notes: string;
      followUpReminder?: string;
      newStage?: LeadStage;
    }
  ) => void;
  agents: SalesAgent[];

  // Academy
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  courseTracks: CourseTrackOverview[];

  // Payroll & Commission Calculator
  payrollEmployees: EmployeePayroll[];
  addPayrollEmployee: (emp: Omit<EmployeePayroll, 'id'>) => void;
  updatePayrollEmployee: (id: string, updates: Partial<EmployeePayroll>) => void;
  deletePayrollEmployee: (id: string) => void;
  resetPayrollCalculations: () => void;

  // Urgent Alerts & Activity
  urgentAlerts: UrgentAlert[];
  dismissAlert: (id: string) => void;
  activityFeed: ActivityFeedItem[];

  // UI state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean | ((prev: boolean) => boolean)) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentModule, setCurrentModule] = useState<AppModule>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize state with local storage fallback
  const [projects, setProjects] = useState<DevProject[]>(() => {
    try {
      const saved = localStorage.getItem('singroup_projects');
      return saved ? JSON.parse(saved) : INITIAL_DEV_PROJECTS;
    } catch {
      return INITIAL_DEV_PROJECTS;
    }
  });

  const [campaigns, setCampaigns] = useState<SMMCampaign[]>(() => {
    try {
      const saved = localStorage.getItem('singroup_campaigns');
      return saved ? JSON.parse(saved) : INITIAL_SMM_CAMPAIGNS;
    } catch {
      return INITIAL_SMM_CAMPAIGNS;
    }
  });

  const [contentCalendar, setContentCalendar] = useState<SMMContentItem[]>(() => {
    try {
      const saved = localStorage.getItem('singroup_content');
      return saved ? JSON.parse(saved) : INITIAL_CONTENT_CALENDAR;
    } catch {
      return INITIAL_CONTENT_CALENDAR;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('singroup_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [agents, setAgents] = useState<SalesAgent[]>(INITIAL_SALES_AGENTS);

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('singroup_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [payrollEmployees, setPayrollEmployees] = useState<EmployeePayroll[]>(() => {
    try {
      const saved = localStorage.getItem('singroup_payroll');
      return saved ? JSON.parse(saved) : INITIAL_PAYROLL_EMPLOYEES;
    } catch {
      return INITIAL_PAYROLL_EMPLOYEES;
    }
  });

  const [courseTracks] = useState<CourseTrackOverview[]>(COURSE_TRACKS);
  const [urgentAlerts, setUrgentAlerts] = useState<UrgentAlert[]>(INITIAL_URGENT_ALERTS);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITY_FEED);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('singroup_projects', JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('singroup_campaigns', JSON.stringify(campaigns));
    } catch {
      // ignore
    }
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem('singroup_leads', JSON.stringify(leads));
    } catch {
      // ignore
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('singroup_students', JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('singroup_payroll', JSON.stringify(payrollEmployees));
    } catch {
      // ignore
    }
  }, [payrollEmployees]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Dev actions
  const addProject = (projectData: Omit<DevProject, 'id'>) => {
    const newProject: DevProject = {
      ...projectData,
      id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
    };
    setProjects((prev) => [newProject, ...prev]);
    addActivity(`yeni layihə yaratdı:`, `${newProject.projectName} (${newProject.serviceType})`, 'dev-hub');
  };

  const updateProject = (id: string, updates: Partial<DevProject>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProjectStatus = (id: string, newStatus: DevStatus) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const progress = newStatus === 'Deployed' ? 100 : newStatus === 'Client Testing' ? 85 : newStatus === 'Code Review/QA' ? 70 : newStatus === 'In Progress' ? 45 : 15;
          return { ...p, status: newStatus, progressPercentage: progress };
        }
        return p;
      })
    );
  };

  // SMM actions
  const addCampaign = (campaignData: Omit<SMMCampaign, 'id'>) => {
    const newCampaign: SMMCampaign = {
      ...campaignData,
      id: `SMM-${Math.floor(200 + Math.random() * 800)}`,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    addActivity(`yeni SMM kampaniyası başlatdı:`, newCampaign.brandName, 'smm');
  };

  const updateCampaign = (id: string, updates: Partial<SMMCampaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const addContentItem = (itemData: Omit<SMMContentItem, 'id'>) => {
    const newItem: SMMContentItem = {
      ...itemData,
      id: `CNT-${Math.floor(10 + Math.random() * 90)}`,
    };
    setContentCalendar((prev) => [newItem, ...prev]);
  };

  const updateContentItem = (id: string, updates: Partial<SMMContentItem>) => {
    setContentCalendar((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  // Sales CRM actions
  const addLead = (leadData: Omit<Lead, 'id' | 'logs'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `LD-${Math.floor(500 + Math.random() * 500)}`,
      logs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString().split('T')[0],
          agentName: leadData.assignedAgent,
          type: 'Call',
          notes: 'İlkin əlaqə CRM sisteminə daxil edildi.',
          newStage: leadData.stage,
        },
      ],
    };
    setLeads((prev) => [newLead, ...prev]);
    addActivity(`yeni satış müştərisi daxil etdi:`, `${newLead.companyName} ($${newLead.dealValue.toLocaleString()})`, 'sales');
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const updateLeadStage = (id: string, newStage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const prob = newStage === 'Won' ? 100 : newStage === 'Lost' ? 0 : newStage === 'Proposal Sent' ? 70 : newStage === 'Responded' ? 50 : 20;
          return { ...l, stage: newStage, probability: prob };
        }
        return l;
      })
    );
  };

  const logLeadContact = (
    leadId: string,
    log: {
      agentName: string;
      type: 'Call' | 'Meeting' | 'Email' | 'WhatsApp / DM' | 'Proposal';
      notes: string;
      followUpReminder?: string;
      newStage?: LeadStage;
    }
  ) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const newLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString().split('T')[0],
            agentName: log.agentName,
            type: log.type,
            notes: log.notes,
            followUpReminder: log.followUpReminder,
            previousStage: l.stage,
            newStage: log.newStage || l.stage,
          };

          const stageToUse = log.newStage || l.stage;
          const prob = stageToUse === 'Won' ? 100 : stageToUse === 'Lost' ? 0 : stageToUse === 'Proposal Sent' ? 70 : stageToUse === 'Responded' ? 50 : 20;

          return {
            ...l,
            stage: stageToUse,
            probability: prob,
            contactAttemptsCount: l.contactAttemptsCount + 1,
            lastContactDate: new Date().toISOString().split('T')[0],
            nextFollowUpDate: log.followUpReminder || l.nextFollowUpDate,
            feedbackNotes: log.notes,
            logs: [newLog, ...l.logs],
          };
        }
        return l;
      })
    );

    // Update agent metrics if won
    if (log.newStage === 'Won') {
      const targetLead = leads.find((l) => l.id === leadId);
      if (targetLead) {
        setAgents((prev) =>
          prev.map((a) => {
            if (a.name === log.agentName) {
              const newWon = a.wonDeals + 1;
              const newRev = a.closedRevenue + targetLead.dealValue;
              const newConv = Number(((newWon / (a.contactsMade || 1)) * 100).toFixed(1));
              return {
                ...a,
                wonDeals: newWon,
                closedRevenue: newRev,
                conversionRate: newConv,
              };
            }
            return a;
          })
        );
        addActivity('uğurlu müqavilə bağladı:', `${targetLead.companyName} ($${targetLead.dealValue.toLocaleString()})`, 'sales');
      }
    }
  };

  // Academy actions
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    addActivity('tələbəni qeydiyyatdan keçirdi:', `${newStudent.studentName} (${newStudent.cohortGroup})`, 'academy');
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  // Payroll actions
  const addPayrollEmployee = (empData: Omit<EmployeePayroll, 'id'>) => {
    const newEmp: EmployeePayroll = {
      ...empData,
      id: `EMP-${Math.floor(10 + Math.random() * 90)}`,
    };
    setPayrollEmployees((prev) => [...prev, newEmp]);
    addActivity('yeni əməkdaş əlavə etdi:', `${newEmp.name} (${newEmp.role})`, 'payroll');
  };

  const updatePayrollEmployee = (id: string, updates: Partial<EmployeePayroll>) => {
    setPayrollEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deletePayrollEmployee = (id: string) => {
    setPayrollEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const resetPayrollCalculations = () => {
    setPayrollEmployees(INITIAL_PAYROLL_EMPLOYEES);
  };

  // Alerts & Activity
  const dismissAlert = (id: string) => {
    setUrgentAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const addActivity = (action: string, target: string, module: AppModule) => {
    const newItem: ActivityFeedItem = {
      id: `ACT-${Date.now()}`,
      user: 'Admin (Sin Group)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      action,
      target,
      module,
      timeAgo: 'İndicə',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    };
    setActivityFeed((prev) => [newItem, ...prev.slice(0, 9)]);
  };

  return (
    <AppContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        theme,
        toggleTheme,
        projects,
        addProject,
        updateProject,
        deleteProject,
        updateProjectStatus,
        campaigns,
        addCampaign,
        updateCampaign,
        contentCalendar,
        addContentItem,
        updateContentItem,
        leads,
        addLead,
        updateLead,
        updateLeadStage,
        logLeadContact,
        agents,
        students,
        addStudent,
        updateStudent,
        courseTracks,
        payrollEmployees,
        addPayrollEmployee,
        updatePayrollEmployee,
        deletePayrollEmployee,
        resetPayrollCalculations,
        urgentAlerts,
        dismissAlert,
        activityFeed,
        searchQuery,
        setSearchQuery,
        isExportModalOpen,
        setIsExportModalOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
