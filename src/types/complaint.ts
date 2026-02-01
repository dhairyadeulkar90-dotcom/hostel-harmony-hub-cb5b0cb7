export type ComplaintStatus = 'submitted' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
export type ComplaintPriority = 'low' | 'medium' | 'high';
export type ComplaintCategory = 'plumbing' | 'electricity' | 'cleanliness' | 'internet' | 'room' | 'other';
export type UserRole = 'student' | 'warden';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roomNumber?: string;
  hostelBlock?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  studentId: string;
  studentName: string;
  roomNumber: string;
  hostelBlock: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  feedback?: string;
  rating?: number;
}

export interface DashboardStats {
  total: number;
  submitted: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  closed: number;
  overdue: number;
  avgResolutionTime: number;
}
