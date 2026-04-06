import React from 'react';
import { FileText, Upload, Save, Send } from 'lucide-react';

export default function STRPreparation() {
  return (
    <div className="flex-1 p-6 relative z-20 flex flex-col pointer-events-auto h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
          <FileText size={20} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">JFIU STR Reporting Form</h2>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-8 shadow-xl max-w-5xl mx-auto w-full">
         <div className="mb-6 pb-4 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-300">Suspicious Transaction Report (STREAMS Prep)</h3>
              <p className="text-[10px] text-slate-500 mt-1">Fields mapped to JFIU mandatory requirements. Digital footprint section is mandated for cyber-enabled reports.</p>
            </div>
            <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500 font-bold text-[10px] uppercase tracking-wider">
               Draft Mode
            </div>
         </div>

         <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">1. Triggering Factors & Intelligence</label>
                  <textarea className="w-full h-24 bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 focus:border-emerald-500 focus:outline-none" placeholder="E.g., Alerted on circular flow typology, verified adverse news match..."></textarea>
               </div>
               
               <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">2. Subject Background (CDD)</label>
                  <textarea className="w-full h-24 bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 focus:border-emerald-500 focus:outline-none" placeholder="Corporate shell entity incorporated in BVI. Source of wealth stated as consulting..."></textarea>
               </div>

               <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">3. Digital Footprints (Required for Crypto/Online)</label>
                  <textarea className="w-full h-24 bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 focus:border-emerald-500 focus:outline-none" defaultValue={`IP Address: 203.0.113.43 (HK)\nDevice Hash: MAC-9A-00-B2-CD-11\nOn-chain Wallet: 0x8b1...a9d (ERC-20 USDT)`}></textarea>
               </div>
            </div>

            <div className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">4. Transaction Summary & Source of Funds</label>
                  <textarea className="w-full h-24 bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 focus:border-emerald-500 focus:outline-none" placeholder="Review period: Jan-Mar 2026. $5M structured inwards and $4.9M outwards to offshore accounts..."></textarea>
               </div>
               
               <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">5. Attachments (Editable Schedules)</label>
                  <div className="w-full h-24 bg-slate-950/50 border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 transition-colors">
                     <Upload size={24} className="text-slate-500 mb-2" />
                     <span className="text-xs text-slate-400 font-bold">Attach Network Graph PDF & Tx Excel</span>
                  </div>
               </div>

               <div className="pt-4 border-t border-slate-800 flex justify-end gap-4">
                  <button className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-slate-700 transition-colors">
                    <Save size={16} /> Save Draft
                  </button>
                  <button className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all">
                    <Send size={16} /> Finalize & Submit to JFIU
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
