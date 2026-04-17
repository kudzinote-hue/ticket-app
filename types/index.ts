export interface Ticket {
    id: string;
    title: string;
    description: string;
    user: string;
    timestamp: string; // ISO string
    category?: TicketCategory;
    priority?: Priority;
    suggestedResponse?: string;
    resolvedAt?: string;
  }
  
  export type TicketCategory = 'IT' | 'HR' | 'Access' | 'Payroll' | 'Other';
  export type Priority = 'Low' | 'Medium' | 'High';
  
  export interface KnowledgeBaseEntry {
    patterns: RegExp[];
    category: TicketCategory;
    priority: Priority;
    responseTemplate: string;
  }
  
  export interface DailyReport {
    date: string;
    totalTickets: number;
    volumeByCategory: Record<TicketCategory, number>;
    averageResponseTimeHours: number;
    topDepartment: TicketCategory;
    topDepartmentCount: number;
    departmentsByIssues: Array<{
      department: TicketCategory;
      count: number;
      percentage: number;
    }>;
    topIssues: Array<{ issue: string; count: number }>; // Keep for compatibility
    anomaly: {
      detected: boolean;
      message?: string;
      currentCount: number;
      averageCount: number;
    };
  }