import React from 'react';
import { Activity, ArrowRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Payment } from '@/types/models';

const dummyPayments: Payment[] = [
  { id: 'PAY_1', timestamp: '2026-04-06T10:00:00Z', amountUsd: 15400, currency: 'USDT', originalAmount: 15400, sourceChannelId: 'ERC20_A', destinationChannelId: 'ERC20_B', status: 'CLEARED', typologyTags: ['HIGH_VELOCITY'] },
  { id: 'PAY_2', timestamp: '2026-04-06T10:02:14Z', amountUsd: 9500, currency: 'USD', originalAmount: 9500, sourceChannelId: 'SWIFT_1', destinationChannelId: 'FIAT_B', status: 'PENDING', typologyTags: ['STRUCTURING'] },
  { id: 'PAY_3', timestamp: '2026-04-06T10:05:30Z', amountUsd: 250000, currency: 'USDC', originalAmount: 250000, sourceChannelId: 'ERC20_C', destinationChannelId: 'WALLET_EX', status: 'CLEARED', typologyTags: ['OFF_RAMP_LARGE'] },
];

export default function MonitoringFeed() {
  return (
    <div className="flex-1 p-6 relative z-20 flex flex-col pointer-events-auto h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
          <Activity size={20} className="text-blue-400" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Real-Time Monitoring (Fiat & Crypto)</h2>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 text-xs text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <th className="p-4 font-black">Timestamp</th>
              <th className="p-4 font-black">Payment ID / Channels</th>
              <th className="p-4 font-black">Amount</th>
              <th className="p-4 font-black">Typology match / Tags</th>
              <th className="p-4 font-black text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {dummyPayments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 text-xs font-mono text-slate-500">
                  {new Date(p.timestamp).toLocaleTimeString()}
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-200">{p.id}</span>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span className="text-emerald-400"><ArrowUpRight size={10} className="inline mr-1"/>{p.sourceChannelId}</span>
                      <ArrowRight size={10} />
                      <span className="text-rose-400"><ArrowDownLeft size={10} className="inline mr-1"/>{p.destinationChannelId}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-bold text-slate-200">
                    ${p.amountUsd.toLocaleString()} 
                    <span className="text-[10px] ml-1 text-slate-500 font-normal">{p.currency}</span>
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {p.typologyTags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.status === 'CLEARED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
