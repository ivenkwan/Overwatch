import React from 'react';
import { AlertTriangle, User, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Alert, Customer } from '@/types/models';

const dummyAlerts: Alert[] = [
  { id: 'ALT-9921', createdAt: '2026-04-06T09:12:00Z', customerId: 'CUST_A89', severity: 'CRITICAL', type: 'BEHAVIORAL', triggerScenario: 'Rapid in-and-out movement with low economic purpose', score: 92, status: 'IN_REVIEW', relatedPayments: ['PAY_1'] },
  { id: 'ALT-9922', createdAt: '2026-04-06T08:45:00Z', customerId: 'CUST_B12', severity: 'HIGH', type: 'TRANSACTIONAL', triggerScenario: 'Structing/smurfing below threshold bands', score: 78, status: 'NEW', relatedPayments: ['PAY_2'] }
];

export default function AlertWorkbench() {
  const activeAlert: Alert = dummyAlerts[0];

  return (
    <div className="flex-1 p-6 relative z-20 flex flex-col pointer-events-auto h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
          <AlertTriangle size={20} className="text-orange-400" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Alert Workbench (L1 / L2)</h2>
      </div>

      <div className="grid grid-cols-3 gap-6 h-full">
        {/* Alerts Queue */}
        <div className="col-span-1 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-4 overflow-y-auto shadow-xl">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Pending Queue</h3>
          <div className="space-y-3">
            {dummyAlerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-xl border cursor-pointer transition-all ${alert.id === activeAlert.id ? 'bg-slate-800 border-orange-500/50 shadow-lg' : 'bg-slate-950/50 border-slate-800/60 hover:border-slate-700'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-slate-200">{alert.id}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>{alert.severity}</span>
                </div>
                <div className="text-xs text-slate-400 line-clamp-2">{alert.triggerScenario}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Alert Details */}
        <div className="col-span-2 flex flex-col space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-100">{activeAlert.id}</h3>
                <span className="text-sm text-slate-500">Trigger: {activeAlert.triggerScenario}</span>
              </div>
              <div className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert size={14} /> Risk Score: {activeAlert.score}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h4 className="text-xs text-slate-500 font-black uppercase tracking-widest flex items-center gap-2"><User size={12}/> Subject Profile</h4>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Customer ID:</span><span className="font-mono text-blue-400 font-bold">{activeAlert.customerId}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Risk Rating:</span><span className="text-red-400 font-bold">HIGH</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Prior Alerts:</span><span className="text-slate-200">3 (1 Escalated)</span></div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs text-slate-500 font-black uppercase tracking-widest">Metadata / Footprint</h4>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Related Payments:</span><span className="font-mono text-slate-200">{activeAlert.relatedPayments.length} Event(s)</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">IP Geolocation:</span><span className="text-slate-200">Hong Kong (HK)</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Device ID:</span><span className="font-mono text-slate-200">MAC-9A-00</span></div>
                </div>
              </div>
            </div>

            {/* Disposition Panel */}
            <div className="border-t border-slate-800 pt-6">
               <h4 className="text-xs text-slate-500 font-black uppercase tracking-widest mb-4">Disposition Decision (HKMA Mandatory Rationale)</h4>
               <textarea className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors h-24" placeholder="Document source-of-funds analysis, CDD references, and justification for closure or escalation here..."></textarea>
               <div className="flex gap-4 mt-4">
                 <button className="flex-1 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2">
                   <ShieldAlert size={16}/> Escalate to L2 / Case
                 </button>
                 <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2">
                   <CheckCircle2 size={16}/> Close Alert (False Positive)
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
