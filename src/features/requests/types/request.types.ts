export type RequestType =
  | 'leave'
  | 'permission'
  | 'attendance_correction';

export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export interface RequestEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  position: string | null;
  workType: string | null;
}

export interface RequestReviewer {
  id: string;
  employeeId: string | null;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RequestAttachment {
  id: string;
  requestId: string;
  fileName: string;
  fileUrl: string;
  fileType: string | null;
  fileSize: string | null;
  createdAt: string;
}

export interface EmployeeRequest {
  id: string;
  employeeId: string;
  reviewedBy: string | null;

  type: RequestType;

  startDate: string;
  endDate: string;

  reason: string;

  status: RequestStatus;

  submittedAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;

  createdAt: string;
  updatedAt: string;

  employee: RequestEmployee;
  reviewer: RequestReviewer | null;
  attachments: RequestAttachment[];
}

export interface RequestListResponse {
  success: boolean;
  message: string;
  data: EmployeeRequest[];
}

export interface RequestResponse {
  success: boolean;
  message: string;
  data: EmployeeRequest;
}

export interface ReviewRequestPayload {
  status: 'approved' | 'rejected';
  reviewNote?: string;
}