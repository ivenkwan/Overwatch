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
  ExternalLink
} from 'lucide-react';

const MOCK_DATA = [
  { data: { id: 'ACC_SUSPECT_01', label: 'Suspect Entity' } },
  { data: { id: 'ACC_02', label: 'Counterparty 1' } },
  { data: { id: 'SWIFT-1', source: 'ACC_SUSPECT_01', target: 'ACC_02', amount_usd: '$15,000' } },
  { data: { id: 'SWIFT-2', source: 'ACC_02', target: 'ACC_SUSPECT_01', amount_usd: '$14,000' } }
];

export default function Dashboard() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

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
        {/* Navigation Sidebar */}
        <aside className="w-80 border-r border-slate-800 bg-slate-950 flex flex-col">
          <div className="p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 inline-flex items-center gap-2">
              <Activity size={12} className="text-blue-500" />
              Live Pulse
            </h2>
            
            <div className="space-y-4">
              <section>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] text-slate-400 font-medium">Critical Alerts</span>
                  <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-bold">12 Active</span>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 1, type: 'PEELING_CHAIN', severity: 'CRITICAL', entity: 'SOURCE_X_8b1' },
                    { id: 2, type: 'HIGH_VELOCITY', severity: 'CRITICAL', entity: 'SINK_LAYER_a2e' },
                    { id: 3, type: 'CIRCULAR_FLOW', severity: 'HIGH', entity: 'ACC_SUSPECT_01' }
                  ].map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => setSelectedEntity(alert.entity)}
                      className={`group p-3 rounded-xl border transition-all cursor-pointer ${selectedEntity === alert.entity ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/5' : 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/60 hover:border-slate-700'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[9px] font-black tracking-tighter px-1.5 py-0.5 rounded uppercase ${alert.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                          {alert.severity}
                        </span>
                        <span className="text-[9px] text-slate-600 group-hover:text-slate-400 transition-colors">2m ago</span>
                      </div>
                      <div className="text-xs font-bold text-slate-200">{alert.type}</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">{alert.entity}</div>
                    </div>
                  ))}
                </div>
              </section>

              <button className="w-full py-2.5 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-400 hover:bg-slate-900 transition-colors uppercase tracking-widest">
                View All History
              </button>
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/20">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Database: age_prod_01</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed">
               System is monitoring incoming <b>SWIFT</b> & <b>ERC-20</b> streams. Rules engine running at 14.2 ops/s.
             </p>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <section className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          <div className="p-8 flex flex-col h-full relative z-10 overflow-y-auto">
            {/* KPI Header */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <KPICard 
                title="Active Investigations" 
                value="142" 
                change="+12%" 
                trend="up" 
                icon={Search} 
                color="blue"
              />
              <KPICard 
                title="Critical Hits" 
                value="28" 
                change="+5.2%" 
                trend="up" 
                icon={AlertTriangle} 
                color="red"
              />
              <KPICard 
                title="Network Velocity" 
                value="4,821" 
                change="-2.1%" 
                trend="neutral" 
                icon={Activity} 
                color="orange"
              />
              <KPICard 
                title="Avg Resolution" 
                value="4.2h" 
                change="-12%" 
                trend="down" 
                icon={ShieldCheck} 
                color="green"
              />
            </div>

            {/* Workspace Title */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Graph Network Voyager</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Visualizing: <span className="font-mono text-blue-400">{selectedEntity || 'Global Network'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                   <button className="px-3 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-white">Full Discovery</button>
                   <button className="px-3 py-1 rounded-md text-[10px] font-bold text-slate-500 hover:text-slate-300">Fast Mode</button>
                </div>
                <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">
                  <BarChart3 size={16} className="text-slate-400" />
                </button>
              </div>
            </div>
            
            {/* Graph Container */}
            <div className="flex-1 min-h-[400px] bg-slate-900/30 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-sm group">
              <GraphExplorer 
                data={MOCK_DATA} 
                onNodeClick={(id) => setSelectedEntity(id)}
              />
              
              {/* Floating Overlays */}
              <div className="absolute bottom-6 left-6 p-4 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-6 shadow-2xl">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Nodes Found</span>
                    <span className="text-sm font-bold">12,402</span>
                 </div>
                 <div className="w-px h-8 bg-slate-800" />
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Edges Traced</span>
                    <span className="text-sm font-bold">88,291</span>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intelligence Sidebar */}
        <aside className="w-96 border-l border-slate-800 bg-slate-950/80 backdrop-blur-xl p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Audit Intelligence</h2>
            <ExternalLink size={14} className="text-slate-600 hover:text-blue-400 cursor-pointer transition-colors" />
          </div>

          {selectedEntity ? (
            <div className="space-y-8">
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

              <div className="space-y-4">
                <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Rule Engine Verdict</div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                   <div className="text-xs text-slate-400 leading-relaxed italic">
                     "Pattern detected suggests high-velocity structuring across multiple intermediate accounts in the NY-1 region."
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                  GENERATE STR REPORT
                </button>
                <button className="w-full py-3 bg-transparent border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold transition-all">
                  FREEZE ASSETS
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center text-slate-700">
              <div className="w-24 h-24 border border-dashed border-slate-800 rounded-2xl mb-6 flex items-center justify-center opacity-40">
                <Search size={32} />
              </div>
              <h4 className="text-sm font-bold text-slate-500 mb-1">No Entity Selected</h4>
              <p className="text-[10px] font-medium max-w-[180px] text-center opacity-60">
                Select a cluster in the graph or an alert from the live feed to begin auditing.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
