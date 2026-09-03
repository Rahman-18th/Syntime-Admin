export type AttendanceStatus =
  | 'present'
  | 'late'
  | string;

export interface AttendanceEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string | null;
  email: string;
  position: string | null;
}

export interface AttendanceShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceOffice {
  id: string;
  name: string;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  allowedRadiusMeters: number;
}

export interface AttendanceSchedule {
  id: string;
  employeeId: string;
  shiftId: string;
  officeId: string;
  workDate: string;
  status: string;

  employee: AttendanceEmployee;
  shift: AttendanceShift;
  office: AttendanceOffice;
}

export interface Attendance {
  id: string;
  scheduleId: string;

  checkInAt: string | null;
  checkOutAt: string | null;

  checkInLatitude: string | null;
  checkInLongitude: string | null;

  checkOutLatitude: string | null;
  checkOutLongitude: string | null;

  checkInDistanceMeters: string | null;
  checkOutDistanceMeters: string | null;

  status: AttendanceStatus;

  createdAt: string;
  updatedAt: string;

  schedule: AttendanceSchedule;
}

export interface AttendanceListResponse {
  success: boolean;
  message: string;
  data: Attendance[];
}