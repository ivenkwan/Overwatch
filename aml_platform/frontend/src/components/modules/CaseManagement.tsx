import React from 'react';
import { Briefcase, Link, Calendar, History } from 'lucide-react';
import { Case } from '@/types/models';

const dummyCases: Case[] = [
  { id: 'CASE-2026-001', createdAt: '2026-04-05T14:20:00Z', investigatorId: 'INV092', status: 'OPEN', linkedCustomers: ['CUST_A89'], linkedAlerts: ['ALT-9921', 'ALT-8819'], timeline: [
    { timestamp: '2026-04-05T14:20:00Z', action: 'Case Opened from Alert ALT-8819', actor: 'System' },
    { timestamp: '2026-04-05T16:00:00Z', action: 'Requested enhanced CDD from compliance team', actor: 'INV092' }
  ]}
];

export default function CaseManagement() {
  const activeCase = dummyCases[0];

  return (
    <div className="flex-1 p-6 relative z-20 flex flex-col pointer-events-auto h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
          <Briefcase size={20} className="text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Case Management (Network Investigation)</h2>
      </div>

      <div className="grid grid-cols-4 gap-6 h-full">
        {/* Main Case Info */}
        <div className="col-span-3 space-y-6">
           <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col gap-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                 <div>
                   <h3 className="text-2xl font-bold text-slate-100">{activeCase.id}</h3>
                   <span className="text-sm text-slate-500 flex items-center gap-2"><Calendar size={14}/> Opened: {new Date(activeCase.createdAt).toLocaleString()}</span>
                 </div>
                 <div className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold rounded-lg uppercase tracking-wider text-sm flex items-center gap-2">
                   {activeCase.status}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800/60">
                   <h4 className="text-xs text-slate-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2"><Link size={12}/> Linked Network Entities</h4>
                   <div className="space-y-2">
                     <span className="inline-block px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono rounded mr-2">Subject: {activeCase.linkedCustomers[0]}</span>
                     {activeCase.linkedAlerts.map(a => <span key={a} className="inline-block px-2 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-mono rounded mr-2">Alert: {a}</span>)}
                   </div>
                   <button className="mt-4 text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest border border-slate-800 px-3 py-1.5 rounded-md w-full transition-colors">Add Network Link</button>
                 </div>

                 <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800/60 flex flex-col justify-between">
                   <div>
                     <h4 className="text-xs text-slate-500 font-black uppercase tracking-widest mb-3">Maker / Checker Approval</h4>
                     <p className="text-xs text-slate-400 leading-relaxed">HKMA mandates documented approvals for closure or STR escalation. Maker assigns disposition rationale, Checker corroborates.</p>
                   </div>
                   <div className="flex gap-2 mt-4">
                      <div className="flex-1 bg-slate-800 rounded-lg p-2 text-center text-[10px] font-bold text-slate-300 uppercase tracking-wider">Maker: INV092</div>
                      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-[10px] items-center justify-center font-bold text-slate-500 uppercase tracking-wider border-dashed flex">Pending Checker</div>
                   </div>
                 </div>
              </div>
           </div>
           
           {/* Timeline */}
           <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl flex-1 border-l-4 border-l-indigo-500">
             <h4 className="text-xs text-slate-500 font-black uppercase tracking-widest mb-6 flex items-center gap-2"><History size={14}/> Investigation Timeline</h4>
             <div className="space-y-4">
                {activeCase.timeline.map((event, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5"></div>
                      {i !== activeCase.timeline.length - 1 && <div className="w-px h-full bg-slate-800 mt-2"></div>}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-500">{new Date(event.timestamp).toLocaleString()} - {event.actor}</div>
                      <div className="text-sm font-medium text-slate-300 mt-0.5">{event.action}</div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-6 flex gap-3">
               <input type="text" placeholder="Add chronological note..." className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg px-4 text-sm focus:outline-none focus:border-indigo-500 text-slate-200" />
               <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors">Add Note</button>
             </div>
           </div>
        </div>

        {/* Action Panel */}
        <div className="col-span-1 flex flex-col gap-4">
          <button className="w-full py-4 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg flex flex-col items-center gap-2">
            Initiate STR Draft
          </button>
          <button className="w-full py-4 bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all">
            Close Case (Document Rationale)
          </button>
          <button className="w-full py-4 bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all">
            Place Financial Block / Hold
          </button>
          <button className="w-full py-4 bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all">
            Generate Network PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}
