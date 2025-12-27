
import React from 'react';
import { MaintenanceRequest } from '../types';

interface CalendarProps {
  requests: MaintenanceRequest[];
}

const CalendarView: React.FC<CalendarProps> = ({ requests }) => {
  // Simple monthly grid view for current month
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const monthName = today.toLocaleString('default', { month: 'long' });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => null);

  const getRequestsForDay = (day: number) => {
    return requests.filter(r => {
      const d = new Date(r.scheduledDate);
      return d.getDate() === day && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-slate-900 p-6 flex justify-between items-center">
        <h3 className="text-white font-bold text-xl">{monthName} {today.getFullYear()}</h3>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1 text-blue-300"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Preventive</span>
          <span className="flex items-center gap-1 text-red-300"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Overdue</span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="p-4 text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {[...padding, ...days].map((day, idx) => (
          <div key={idx} className={`min-h-[120px] border-r border-b border-slate-100 p-2 ${day === null ? 'bg-slate-50/50' : ''}`}>
            {day && (
              <>
                <div className={`text-sm font-semibold mb-2 ${day === today.getDate() ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {getRequestsForDay(day).map(req => {
                    const isOverdue = new Date(req.scheduledDate) < today && req.stage !== 'Repaired';
                    return (
                      <div key={req.id} className={`text-[10px] p-1.5 rounded border leading-tight ${
                        isOverdue 
                        ? 'bg-red-50 text-red-700 border-red-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        <span className="font-bold block truncate">{req.title}</span>
                        <span className="opacity-70">{req.id}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
