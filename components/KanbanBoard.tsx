
import React from 'react';
import { MaintenanceRequest, RequestStage } from '../types';

interface KanbanBoardProps {
  requests: MaintenanceRequest[];
  onStageChange: (id: string, stage: RequestStage) => void;
}

const STAGES: RequestStage[] = ['New', 'In Progress', 'Repaired', 'Scrap'];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ requests, onStageChange }) => {
  const getRequestsForStage = (stage: RequestStage) => requests.filter(r => r.stage === stage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
      {STAGES.map(stage => (
        <div key={stage} className="bg-slate-50 p-4 rounded-xl min-w-[280px]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                stage === 'New' ? 'bg-blue-400' :
                stage === 'In Progress' ? 'bg-amber-400' :
                stage === 'Repaired' ? 'bg-green-400' : 'bg-red-400'
              }`}></span>
              {stage}
            </h3>
            <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
              {getRequestsForStage(stage).length}
            </span>
          </div>
          
          <div className="space-y-3">
            {getRequestsForStage(stage).map(req => (
              <div key={req.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    req.type === 'Corrective' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {req.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">#{req.id}</span>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm leading-tight mb-1">{req.title}</h4>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{req.description}</p>
                
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-4">
                  <span>📅 {req.scheduledDate}</span>
                  <span>🔧 Team {req.teamId.split('-')[1]}</span>
                </div>

                <div className="flex gap-1">
                  {STAGES.filter(s => s !== stage).map(s => (
                    <button
                      key={s}
                      onClick={() => onStageChange(req.id, s)}
                      className="flex-1 text-[10px] py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded border border-slate-200 transition-colors"
                    >
                      To {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {getRequestsForStage(stage).length === 0 && (
              <div className="border-2 border-dashed border-slate-200 rounded-lg py-8 text-center text-slate-400 text-xs italic">
                No items in this stage
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
