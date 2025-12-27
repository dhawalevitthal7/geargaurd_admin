
import React from 'react';

interface KPIProps {
  label: string;
  value: number | string;
  trend?: string;
  icon: string;
  color: string;
}

const Card: React.FC<KPIProps> = ({ label, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-xl`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        }`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

interface KPISectionProps {
  stats: {
    totalEquipment: number;
    activeRequests: number;
    overdueRequests: number;
    coverage: string;
  }
}

const KPISection: React.FC<KPISectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card 
        label="Total Equipment" 
        value={stats.totalEquipment} 
        icon="🏭" 
        color="bg-blue-500 text-blue-500"
        trend="+12% vs LY"
      />
      <Card 
        label="Active Maintenance" 
        value={stats.activeRequests} 
        icon="🔧" 
        color="bg-amber-500 text-amber-500"
      />
      <Card 
        label="Overdue Alerts" 
        value={stats.overdueRequests} 
        icon="⚠️" 
        color="bg-red-500 text-red-500"
      />
      <Card 
        label="Org Coverage" 
        value={stats.coverage} 
        icon="🏢" 
        color="bg-emerald-500 text-emerald-500"
      />
    </div>
  );
};

export default KPISection;
