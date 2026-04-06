"use client";

import React, { useState } from 'react';
import GraphExplorer from '@/components/GraphExplorer';
import { KPICard } from '@/components/KPICard';
import { 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  BarChart3, 
  Search,
  Settings,
  Bell,
  User,
  ExternalLink,
  Briefcase,
  FileText,
  Target,
  Share2
} from 'lucide-react';

import MonitoringFeed from '@/components/modules/MonitoringFeed';
import AlertWorkbench from '@/components/modules/AlertWorkbench';
import CaseManagement from '@/components/modules/CaseManagement';
import STRPreparation from '@/components/modules/STRPreparation';
import ScreeningModule from '@/components/modules/ScreeningModule';
import GovernanceMIS from '@/components/modules/GovernanceMIS';

const MOCK_DATA = [
  // --- CIRCULAR TOPOLOGY (Wash Trading / Tax Evasion) ---
  { data: { id: 'CIRC_A', label: 'Offshore Trust', threshold_status: 'RED' } },
  { data: { id: 'CIRC_B', label: 'Shell Co. A', threshold_status: 'AMBER' } },
  { data: { id: 'CIRC_C', label: 'Shell Co. B', threshold_status: 'AMBER' } },
  { data: { id: 'CIRC_D', label: 'Real Estate Holding', threshold_status: 'RED' } },
  // Edges for Circular Flow (High Volume Loop will result in very thick connecting lines)
  { data: { id: 'C_EDGE_1', source: 'CIRC_A', target: 'CIRC_B', amount_usd: '$5,000,000', volume: 5000000 } },
  { data: { id: 'C_EDGE_2', source: 'CIRC_B', target: 'CIRC_C', amount_usd: '$4,950,000', volume: 4950000 } },
  { data: { id: 'C_EDGE_3', source: 'CIRC_C', target: 'CIRC_D', amount_usd: '$4,900,000', volume: 4900000 } },
  { data: { id: 'C_EDGE_4', source: 'CIRC_D', target: 'CIRC_A', amount_usd: '$4,800,000', volume: 4800000 } },

  // --- SMURFING TOPOLOGY (Structuring / Micro-laundering) ---
  { data: { id: 'AGGREGATOR', label: 'Suspect Aggregator', threshold_status: 'RED', type: 'SuperNode' } },
  // The "Smurfs" (Low volume, high frequency, usually Green/Amber until aggregated)
  { data: { id: 'SMURF_1', label: 'Retail Acc 1', threshold_status: 'GREEN' } },
  { data: { id: 'SMURF_2', label: 'Retail Acc 2', threshold_status: 'GREEN' } },
  { data: { id: 'SMURF_3', label: 'Retail Acc 3', threshold_status: 'GREEN' } },
  { data: { id: 'SMURF_4', label: 'Retail Acc 4', threshold_status: 'GREEN' } },
  { data: { id: 'SMURF_5', label: 'Retail Acc 5', threshold_status: 'AMBER' } },
  { data: { id: 'SMURF_6', label: 'Retail Acc 6', threshold_status: 'AMBER' } },
  // Edges for Smurfing (Low volume each, very thin, acting as a funnel to the aggregator)
  { data: { id: 'S_EDGE_1', source: 'SMURF_1', target: 'AGGREGATOR', amount_usd: '$9,500', volume: 9500 } },
  { data: { id: 'S_EDGE_2', source: 'SMURF_2', target: 'AGGREGATOR', amount_usd: '$9,800', volume: 9800 } },
  { data: { id: 'S_EDGE_3', source: 'SMURF_3', target: 'AGGREGATOR', amount_usd: '$9,200', volume: 9200 } },
  { data: { id: 'S_EDGE_4', source: 'SMURF_4', target: 'AGGREGATOR', amount_usd: '$9,900', volume: 9900 } },
  { data: { id: 'S_EDGE_5', source: 'SMURF_5', target: 'AGGREGATOR', amount_usd: '$8,500', volume: 8500 } },
  { data: { id: 'S_EDGE_6', source: 'SMURF_6', target: 'AGGREGATOR', amount_usd: '$9,100', volume: 9100 } },

  // Aggregator passes it on to main holding (thicker connection)
  { data: { id: 'MAIN_HOLDING', label: 'Main Account', threshold_status: 'RED' } },
  { data: { id: 'S_EDGE_OUT', source: 'AGGREGATOR', target: 'MAIN_HOLDING', amount_usd: '$56,000', volume: 56000 } },
  
  // A connection between typologies to form a unified network view
  { data: { id: 'LINK_EDGE', source: 'MAIN_HOLDING', target: 'CIRC_A', amount_usd: '$500,000', volume: 500000 } }
];

export default function Dashboard() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [isFastMode, setIsFastMode] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<string>('NETWORK');

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-slate-800/50 px-8 py-3 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-white shadow-lg shadow-blue-500/20">OW</div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">OVERWATCH <span className="text-blue-500">AML</span></h1>
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="#" className="text-xs font-semibold text-blue-400 border-b-2 border-blue-500 pb-4 -mb-4">Investigations</a>
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors">Reports</a>
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors">System Health</a>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Entities / Tx Hashes..." 
              className="bg-slate-800/50 border border-slate-700/50 rounded-full py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all w-64"
            />
          </div>
          <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
             <Bell size={18} className="text-slate-400 cursor-pointer hover:text-blue-400 transition-colors" />
             <Settings size={18} className="text-slate-400 cursor-pointer hover:text-blue-400 transition-colors" />
             <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 cursor-pointer hover:border-blue-500 transition-all">
               <User size={16} className="text-slate-400" />
             </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Unified Workspace Sidebar */}
        <aside className="w-16 border-r border-slate-800 bg-slate-950 flex flex-col items-center py-6 gap-4 z-50">
           <button onClick={() => setActiveModule('NETWORK')} className={`p-3 rounded-xl transition-colors ${activeModule === 'NETWORK' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`} title="Network Graph">
             <Share2 size={22}/>
           </button>
           <button onClick={() => setActiveModule('MONITORING')} className={`p-3 rounded-xl transition-colors ${activeModule === 'MONITORING' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`} title="Monitoring Feed">
             <Activity size={22}/>
           </button>
           <button onClick={() => setActiveModule('ALERTS')} className={`p-3 rounded-xl transition-colors ${activeModule === 'ALERTS' ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`} title="Alerts Workbench">
             <AlertTriangle size={22}/>
           </button>
           <button onClick={() => setActiveModule('CASES')} className={`p-3 rounded-xl transition-colors ${activeModule === 'CASES' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`} title="Case Management">
             <Briefcase size={22}/>
           </button>
           <button onClick={() => setActiveModule('STR')} className={`p-3 rounded-xl transition-colors ${activeModule === 'STR' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`} title="STR Reporting">
             <FileText size={22}/>
           </button>
           <button onClick={() => setActiveModule('SCREENING')} className={`p-3 rounded-xl transition-colors ${activeModule === 'SCREENING' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`} title="Screening">
             <Target size={22}/>
           </button>
           <button onClick={() => setActiveModule('GOVERNANCE')} className={`p-3 rounded-xl transition-colors ${activeModule === 'GOVERNANCE' ? 'bg-slate-500/20 text-slate-300' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`} title="Governance MIS">
             <BarChart3 size={22}/>
           </button>
        </aside>

        {/* Main Content Workspace */}
        <section className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden py-4">
          <div className="flex-1 mx-4 relative z-10 bg-slate-900/20 rounded-[2rem] border border-slate-800/80 shadow-2xl overflow-hidden group flex flex-col">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

            {/* Background Graph Layer - Constantly Mounted */}
            <div className={`absolute inset-0 z-0 flex flex-col transition-all duration-500 ${activeModule === 'NETWORK' ? 'opacity-100' : 'opacity-[0.03] pointer-events-none blur-sm'}`}>
              {/* Top Workspace Bar */}
              <div className="relative z-20 flex flex-col pointer-events-auto border-b border-slate-800/50 pb-2">
                <div className="px-6 py-4 flex justify-between items-start">
                  <div className="flex flex-col items-start shrink-0">
                    <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/60 rounded-2xl px-5 py-3 shadow-xl">
                      <h3 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Graph Network Voyager</h3>
                    </div>
                    <div className="mt-3 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/50">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visualizing:</span>
                      <span className="font-mono text-xs font-bold text-blue-400 truncate max-w-[120px]">{selectedEntity || 'Global Network View'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 bg-slate-950/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800/60 shadow-xl w-64 justify-end shrink-0">
                    <div className="flex bg-slate-900/50 p-1 rounded-xl">
                       <button 
                         onClick={() => setIsFastMode(false)}
                         className={`px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-lg ${!isFastMode ? 'bg-blue-600 text-white shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                       >
                         Discovery
                       </button>
                       <button 
                         onClick={() => setIsFastMode(true)}
                         className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg ${isFastMode ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                       >
                         Fast
                       </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full relative z-10">
                <GraphExplorer 
                  data={MOCK_DATA} 
                  isFastMode={isFastMode}
                  onNodeClick={(id) => setSelectedEntity(id)}
                />
              </div>
            </div>

            {/* Dynamic Foreground Modules */}
            {activeModule === 'MONITORING' && <MonitoringFeed />}
            {activeModule === 'ALERTS' && <AlertWorkbench />}
            {activeModule === 'CASES' && <CaseManagement />}
            {activeModule === 'STR' && <STRPreparation />}
            {activeModule === 'SCREENING' && <ScreeningModule />}
            {activeModule === 'GOVERNANCE' && <GovernanceMIS />}
          </div>
        </section>

        {/* Contextual Intelligence Sidebar (Visible only when in Network view) */}
        <aside className={`border-l border-slate-800 bg-slate-950/80 backdrop-blur-xl overflow-y-auto transition-all duration-300 ${activeModule === 'NETWORK' ? 'w-96 p-8' : 'w-0 opacity-0 overflow-hidden'}`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Audit Intelligence</h2>
            <ExternalLink size={14} className="text-slate-600 hover:text-blue-400 cursor-pointer transition-colors" />
          </div>

          {selectedEntity ? (
            <div className="space-y-8 min-w-[280px]">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 relative overflow-hidden">
                <div className="text-[10px] font-black text-blue-400 mb-2 tracking-widest uppercase">Target Entity</div>
                <div className="text-lg font-mono font-bold leading-none">{selectedEntity}</div>
                <div className="mt-4 flex items-center gap-2">
                   <div className="h-6 w-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                     <ShieldCheck size={14} className="text-blue-500" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-300">Verified Institution</span>
                </div>
                {/* Decorative background logo */}
                <BarChart3 size={120} className="absolute -right-6 -bottom-6 text-blue-500/5 rotate-12" />
              </div>
              
              <div className="space-y-4">
                <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Metadata Profile</div>
                <div className="space-y-3">
                  {[
                    { label: 'Type', value: 'FIAT_ACCOUNT', color: 'slate' },
                    { label: 'Jurisdiction', value: 'UNITED STATES', color: 'slate' },
                    { label: 'Risk Score', value: '88 / 100', color: 'red' },
                    { label: 'Wallet Count', value: '2 Linked', color: 'blue' },
                  ].map(meta => (
                    <div key={meta.label} className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-[11px] font-medium text-slate-500">{meta.label}</span>
                      <span className={`text-[11px] font-bold tracking-tight ${meta.color === 'red' ? 'text-red-500' : meta.color === 'blue' ? 'text-blue-400' : 'text-slate-200'}`}>
                        {meta.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                   onClick={() => setActiveModule('STR')}
                   className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  PREPARE STR
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center text-slate-700 min-w-[280px]">
              <div className="w-24 h-24 border border-dashed border-slate-800 rounded-2xl mb-6 flex items-center justify-center opacity-40">
                <Search size={32} />
              </div>
              <h4 className="text-sm font-bold text-slate-500 mb-1">No Entity Selected</h4>
              <p className="text-[10px] font-medium max-w-[180px] text-center opacity-60">
                Select a cluster in the graph to begin specific auditing.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
