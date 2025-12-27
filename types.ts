
export type Role = 'Admin' | 'Technician' | 'Operator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  token?: string;
}

export type EquipmentStatus = 'Operational' | 'Maintenance' | 'Unusable';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  departmentId: string;
  status: EquipmentStatus;
  assignedTeamId: string;
  lastMaintenanceDate: string;
}

export type RequestStage = 'New' | 'In Progress' | 'Repaired' | 'Scrap';
export type RequestType = 'Corrective' | 'Preventive';

export interface MaintenanceRequest {
  id: string;
  equipmentId: string;
  title: string;
  description: string;
  type: RequestType;
  stage: RequestStage;
  teamId: string;
  technicianId: string;
  createdAt: string;
  scheduledDate: string;
  completedAt?: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  departmentId: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  name: string;
  load: number; // number of current active requests
}

export interface Department {
  id: string;
  name: string;
}

export interface DashboardStats {
  totalEquipment: number;
  activeRequests: number;
  overdueRequests: number;
  departmentCount: number;
  employeeCount: number;
}
