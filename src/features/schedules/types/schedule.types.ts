export type ScheduleStatus =
  | 'scheduled'
  | 'off'
  | 'holiday';

export interface ScheduleEmployee {
  id: string;
  companyId: string;
  officeId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string | null;
  status: string;
}

export interface ScheduleShift {
  id: string;
  companyId: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleOffice {
  id: string;
  companyId: string;
  name: string;
}

export interface ScheduleAttendance {
  id: string;
  status: string;
  checkInAt: string | null;
  checkOutAt: string | null;
}

export interface Schedule {
  id: string;
  employeeId: string;
  shiftId: string;
  officeId: string;
  workDate: string;
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;

  employee: ScheduleEmployee;
  shift: ScheduleShift;
  office: ScheduleOffice;
  attendance: ScheduleAttendance | null;
}

export interface SchedulePayload {
  employeeId: string;
  shiftId: string;
  officeId: string;
  workDate: string;
  status?: ScheduleStatus;
}

export interface ScheduleListResponse {
  success: boolean;
  message: string;
  data: Schedule[];
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  data: Schedule;
}