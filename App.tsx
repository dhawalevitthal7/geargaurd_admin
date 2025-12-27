
import React, { useState, useEffect, useCallback } from 'react';
import { User, MaintenanceRequest, Equipment, MaintenanceTeam, TeamMember, Department, DashboardStats, RequestStage } from './types';
import { apiService } from './services/api';
import Sidebar from './components/Sidebar';
import KPISection from './components/KPICards';
import KanbanBoard from './components/KanbanBoard';
import { TypeDistributionChart, TeamPerformanceChart, EquipmentFailuresChart } from './components/Charts';
import CalendarView from './components/CalendarView';

const LoginView: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@gearguard.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await apiService.login({ email, password });
      onLogin(user);
    } catch (err) {
      setError('Invalid admin credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold text-white">GearGuard Admin</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide uppercase">Maintenance Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tighter">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
              placeholder="admin@gearguard.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tighter">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transform transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">
            Authorized Personnel Only. GearGuard Security Protocol v3.1
          </p>
        </form>
      </div>
    </div>
  );
};

const DashboardView: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [employees, setEmployees] = useState<TeamMember[]>([]);
  const [overdue, setOverdue] = useState<MaintenanceRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    activeRequests: 0,
    overdueRequests: 0,
    departmentCount: 0,
    employeeCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [reqs, eqs, tm, emp, od] = await Promise.all([
        apiService.getMaintenanceRequests(),
        apiService.getEquipmentList(),
        apiService.getMaintenanceTeams(),
        apiService.getEmployees(),
        apiService.getOverdueRequests()
      ]);

      setRequests(reqs);
      setEquipment(eqs);
      setTeams(tm);
      setEmployees(emp);
      setOverdue(od);

      setStats({
        totalEquipment: eqs.length,
        activeRequests: reqs.filter(r => r.stage === 'New' || r.stage === 'In Progress').length,
        overdueRequests: od.length,
        departmentCount: eqs.reduce((acc, e) => acc.add(e.departmentId), new Set()).size,
        employeeCount: emp.length
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStageChange = async (id: string, stage: RequestStage) => {
    try {
      await apiService.updateRequestStage(id, stage);
      fetchData(); // Refresh all data to reflect equipment status changes if scrap
    } catch (err) {
      console.error('Failed to update stage', err);
    }
  };

  // Chart data preps
  const typeDistributionData = [
    { name: 'Preventive', value: requests.filter(r => r.type === 'Preventive').length },
    { name: 'Corrective', value: requests.filter(r => r.type === 'Corrective').length },
  ];

  const teamPerformanceData = teams.map(t => ({
    name: t.name,
    requests: requests.filter(r => r.teamId === t.id).length
  }));

  const equipmentFailureData = Array.from(
    requests.reduce((acc, r) => {
      const eq = equipment.find(e => e.id === r.equipmentId);
      if (eq) {
        acc.set(eq.name, (acc.get(eq.name) || 0) + 1);
      }
      return acc;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ name, count }))
   .sort((a, b) => b.count - a.count)
   .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Syncing Maintenance Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ')}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Welcome back, {user.name} | System status: <span className="text-green-600 font-bold">OPTIMAL</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData} 
              className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
              title="Refresh Data"
            >
              🔄
            </button>
            <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live Admin Session
            </div>
          </div>
        </header>

        {currentView === 'dashboard' && (
          <>
            <KPISection stats={{
              totalEquipment: stats.totalEquipment,
              activeRequests: stats.activeRequests,
              overdueRequests: stats.overdueRequests,
              coverage: `${stats.departmentCount} Depts`
            }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <TypeDistributionChart data={typeDistributionData} />
              <TeamPerformanceChart data={teamPerformanceData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <EquipmentFailuresChart data={equipmentFailureData} />
              </div>
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                    Critical Asset Health
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 uppercase text-[10px] font-bold tracking-widest">
                        <th className="pb-4">Equipment</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Last Check</th>
                        <th className="pb-4">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700 divide-y divide-slate-50">
                      {equipment.map(eq => (
                        <tr key={eq.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-semibold">{eq.name}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              eq.status === 'Operational' ? 'bg-green-50 text-green-600' :
                              eq.status === 'Maintenance' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {eq.status}
                            </span>
                          </td>
                          <td className="py-4 text-slate-500">{eq.lastMaintenanceDate}</td>
                          <td className="py-4">
                             <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className={`h-full ${
                                  eq.status === 'Operational' ? 'w-1/4 bg-green-500' :
                                  eq.status === 'Maintenance' ? 'w-3/4 bg-amber-500' : 'w-full bg-red-500'
                                }`}></div>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'requests' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h2 className="text-lg font-bold text-slate-900 mb-4">Operations Pipeline</h2>
               <p className="text-sm text-slate-500 mb-6 font-medium">Manage current maintenance lifecycle stages. Use the buttons on cards to transition requests.</p>
               <KanbanBoard requests={requests} onStageChange={handleStageChange} />
            </div>
          </div>
        )}

        {currentView === 'calendar' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h2 className="text-lg font-bold text-slate-900 mb-2">Preventive Maintenance Schedule</h2>
               <p className="text-sm text-slate-500 mb-8 font-medium">Planning maturity visualization. Routine checks ensure asset longevity.</p>
               <CalendarView requests={requests.filter(r => r.type === 'Preventive' || (new Date(r.scheduledDate) < new Date()))} />
            </div>
          </div>
        )}

        {currentView === 'equipment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EquipmentFailuresChart data={equipmentFailureData} />
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-bold text-slate-900">Maintenance Suggestion</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                Equipment <b>EQ-001 (Hydraulic Press)</b> has been through 4 corrective cycles this month. 
                Our AI suggests moving this asset to a <b>weekly preventive schedule</b> or initiating a <b>scrap review</b>.
              </p>
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
                Schedule Review
              </button>
            </div>
          </div>
        )}

        {currentView === 'teams' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TeamPerformanceChart data={teamPerformanceData} />
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Current Technician Loads</h3>
                <div className="space-y-6">
                  {employees.map(emp => (
                    <div key={emp.id}>
                      <div className="flex justify-between text-sm mb-1.5 font-bold text-slate-700">
                        <span>{emp.name}</span>
                        <span>{emp.load} Tasks</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            emp.load > 2 ? 'bg-red-500' : emp.load > 1 ? 'bg-amber-500' : 'bg-blue-500'
                          } ${emp.load === 0 ? 'w-0' : emp.load === 1 ? 'w-1/5' : emp.load === 2 ? 'w-2/5' : emp.load === 3 ? 'w-3/5' : emp.load === 4 ? 'w-4/5' : 'w-full'}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginView onLogin={setUser} />;
  }

  // Double verification for Admin role as per requirements
  if (user.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-10 rounded-2xl shadow-xl border border-red-100">
           <div className="text-5xl mb-6">⛔</div>
           <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
           <p className="text-slate-500 mt-4 leading-relaxed font-medium">
             This portal is exclusively for System Administrators. Your account (<b>{user.role}</b>) does not have the necessary privileges.
           </p>
           <button 
             onClick={handleLogout}
             className="mt-8 px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
           >
             Return to Login
           </button>
        </div>
      </div>
    );
  }

  return <DashboardView user={user} onLogout={handleLogout} />;
};

export default App;
