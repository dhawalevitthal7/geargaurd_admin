
import { 
  Equipment, 
  MaintenanceRequest, 
  MaintenanceTeam, 
  Department, 
  User, 
  TeamMember,
  RequestStage 
} from '../types';

// Initial Mock Data
let MOCK_EQUIPMENT: Equipment[] = [
  { id: 'EQ-001', name: 'Hydraulic Press HP-20', type: 'Industrial', departmentId: 'DEP-01', status: 'Operational', assignedTeamId: 'TEAM-A', lastMaintenanceDate: '2023-10-15' },
  { id: 'EQ-002', name: 'CNC Milling Machine', type: 'Precision', departmentId: 'DEP-01', status: 'Maintenance', assignedTeamId: 'TEAM-A', lastMaintenanceDate: '2023-11-20' },
  { id: 'EQ-003', name: 'Forklift F-400', type: 'Logistics', departmentId: 'DEP-02', status: 'Operational', assignedTeamId: 'TEAM-B', lastMaintenanceDate: '2023-09-01' },
  { id: 'EQ-004', name: 'Assembly Line A-1', type: 'Assembly', departmentId: 'DEP-01', status: 'Operational', assignedTeamId: 'TEAM-A', lastMaintenanceDate: '2023-12-05' },
  { id: 'EQ-005', name: 'Industrial Boiler', type: 'Utility', departmentId: 'DEP-03', status: 'Unusable', assignedTeamId: 'TEAM-C', lastMaintenanceDate: '2023-08-20' },
];

let MOCK_REQUESTS: MaintenanceRequest[] = [
  { id: 'MR-101', equipmentId: 'EQ-001', title: 'Leaking Fluid', description: 'Small leak in primary valve', type: 'Corrective', stage: 'New', teamId: 'TEAM-A', technicianId: 'U-002', createdAt: '2024-01-20', scheduledDate: '2024-01-22' },
  { id: 'MR-102', equipmentId: 'EQ-002', title: 'Monthly Routine', description: 'Regular oil change and sensor check', type: 'Preventive', stage: 'In Progress', teamId: 'TEAM-A', technicianId: 'U-002', createdAt: '2024-01-15', scheduledDate: '2024-01-18' },
  { id: 'MR-103', equipmentId: 'EQ-003', title: 'Engine Noise', description: 'Loud grinding during high revs', type: 'Corrective', stage: 'Repaired', teamId: 'TEAM-B', technicianId: 'U-003', createdAt: '2024-01-05', scheduledDate: '2024-01-07', completedAt: '2024-01-10' },
  { id: 'MR-104', equipmentId: 'EQ-004', title: 'Belt Inspection', description: 'Preventive belt tensioning', type: 'Preventive', stage: 'New', teamId: 'TEAM-A', technicianId: 'U-002', createdAt: '2024-02-10', scheduledDate: '2024-02-12' },
  { id: 'MR-105', equipmentId: 'EQ-005', title: 'Critical Burnout', description: 'Total system failure', type: 'Corrective', stage: 'Scrap', teamId: 'TEAM-C', technicianId: 'U-004', createdAt: '2024-01-01', scheduledDate: '2024-01-02', completedAt: '2024-01-03' },
];

const MOCK_TEAMS: MaintenanceTeam[] = [
  { id: 'TEAM-A', name: 'Alpha Mechanics', departmentId: 'DEP-01' },
  { id: 'TEAM-B', name: 'Beta Logistics', departmentId: 'DEP-02' },
  { id: 'TEAM-C', name: 'Gamma Utilities', departmentId: 'DEP-03' },
];

const MOCK_DEPARTMENTS: Department[] = [
  { id: 'DEP-01', name: 'Manufacturing' },
  { id: 'DEP-02', name: 'Warehousing' },
  { id: 'DEP-03', name: 'Facilities' },
];

const MOCK_MEMBERS: TeamMember[] = [
  { id: 'M-1', teamId: 'TEAM-A', userId: 'U-002', name: 'John Doe', load: 3 },
  { id: 'M-2', teamId: 'TEAM-B', userId: 'U-003', name: 'Jane Smith', load: 1 },
  { id: 'M-3', teamId: 'TEAM-C', userId: 'U-004', name: 'Bob Wilson', load: 0 },
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const apiService = {
  // AUTH
  async login(credentials: { email: string; password: string }): Promise<User> {
    await delay(800);
    // Simple mock logic: if email is admin@gearguard.com, they are Admin
    if (credentials.email.includes('admin')) {
      return { id: 'U-001', email: credentials.email, name: 'Main Admin', role: 'Admin', token: 'fake-jwt-token' };
    }
    throw new Error('Unauthorized role or invalid credentials');
  },

  // EQUIPMENT
  async getEquipmentList(): Promise<Equipment[]> {
    await delay(500);
    return [...MOCK_EQUIPMENT];
  },

  async getEquipmentById(id: string): Promise<Equipment | undefined> {
    return MOCK_EQUIPMENT.find(e => e.id === id);
  },

  // MAINTENANCE REQUESTS
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    await delay(500);
    return [...MOCK_REQUESTS];
  },

  async updateRequestStage(id: string, stage: RequestStage): Promise<MaintenanceRequest> {
    await delay(300);
    const index = MOCK_REQUESTS.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    MOCK_REQUESTS[index].stage = stage;
    
    // Smart Logic: If Scrap, update Equipment status
    if (stage === 'Scrap') {
      const eqId = MOCK_REQUESTS[index].equipmentId;
      const eqIndex = MOCK_EQUIPMENT.findIndex(e => e.id === eqId);
      if (eqIndex !== -1) {
        MOCK_EQUIPMENT[eqIndex].status = 'Unusable';
      }
    }
    
    return MOCK_REQUESTS[index];
  },

  // CALENDAR
  async getOverdueRequests(): Promise<MaintenanceRequest[]> {
    await delay(400);
    const now = new Date();
    return MOCK_REQUESTS.filter(r => {
      const scheduled = new Date(r.scheduledDate);
      return scheduled < now && (r.stage === 'New' || r.stage === 'In Progress');
    });
  },

  // ORG
  async getDepartments(): Promise<Department[]> {
    return [...MOCK_DEPARTMENTS];
  },

  async getEmployees(): Promise<TeamMember[]> {
    return [...MOCK_MEMBERS];
  },

  // TEAMS
  async getMaintenanceTeams(): Promise<MaintenanceTeam[]> {
    return [...MOCK_TEAMS];
  },

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return MOCK_MEMBERS.filter(m => m.teamId === teamId);
  }
};
