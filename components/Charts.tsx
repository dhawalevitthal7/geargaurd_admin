
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';

interface ChartProps {
  title: string;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartProps> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-slate-800 font-bold mb-6 text-sm flex items-center gap-2">
      <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
      {title}
    </h3>
    <div className="h-[300px] w-full">
      {children}
    </div>
  </div>
);

export const TypeDistributionChart: React.FC<{ data: any[] }> = ({ data }) => {
  const COLORS = ['#3b82f6', '#f59e0b'];
  return (
    <ChartContainer title="Maintenance Type Distribution">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export const TeamPerformanceChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ChartContainer title="Requests per Team">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip 
            cursor={{fill: '#f1f5f9'}}
            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
          />
          <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export const EquipmentFailuresChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ChartContainer title="Top 5 Most Failed Equipment">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" fontSize={12} />
          <YAxis dataKey="name" type="category" width={100} fontSize={10} />
          <Tooltip cursor={{fill: '#f1f5f9'}} />
          <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
