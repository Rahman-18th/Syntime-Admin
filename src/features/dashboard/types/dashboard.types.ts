export interface AdminDashboardPeriod {
  date: string;
  month: number;
  year: number;
}

export interface AdminDashboardEmployees {
  total: number;
  active: number;
  inactive: number;
}

export interface AdminDashboardAttendance {
  presentToday: number;
  lateToday: number;
  totalCheckedInToday: number;
}

export interface AdminDashboardRequests {
  pending: number;
}

export interface AdminDashboardPayroll {
  totalPayslips: number;
  published: number;
  draft: number;
  totalTakeHomePay: number;
}

export interface AdminDashboardAnnouncements {
  published: number;
}

export interface DashboardEmployeeSummary {
  id: string;
  employeeNumber: string;
  name: string;
}

export interface RecentAttendance {
  id: string;

  employee: DashboardEmployeeSummary;

  office: string;
  status: string;
  workDate: string;

  checkInTime: string | null;
  checkOutTime: string | null;
}

export interface RecentRequest {
  id: string;

  employee: DashboardEmployeeSummary;

  type: string;
  status: string;
  submittedAt: string;
}

export interface AdminDashboard {
  period: AdminDashboardPeriod;

  employees: AdminDashboardEmployees;

  attendance: AdminDashboardAttendance;

  requests: AdminDashboardRequests;

  payroll: AdminDashboardPayroll;

  announcements: AdminDashboardAnnouncements;

  recentAttendance: RecentAttendance[];

  recentRequests: RecentRequest[];
}

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: AdminDashboard;
}