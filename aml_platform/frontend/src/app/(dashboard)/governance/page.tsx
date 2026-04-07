"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/services/api";
import { AlertCircle, TrendingUp, TrendingDown, CheckCircle, Clock, FileText, Settings, ShieldAlert, Activity } from "lucide-react";

export default function GovernanceMISPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const kpiData = await api.reports.getDailyKPIs();
        setData(kpiData);
      } catch (err: any) {
        setError(err.message || "Failed to load Governance MIS data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500 animation-delay-200"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500 animation-delay-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-900 border border-red-200 p-4 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Governance MIS</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Format datestring
  const reportDate = data?.report_date ? new Date(data.report_date).toLocaleDateString() : 'N/A';

  // RAG Configuration logic based on HKMA requirements
  const getRagStatus = (value: number, thresholdType: 'low_better' | 'high_better', boundaries: [number, number]) => {
    // boundaries: [amber_start, red_start] relative to 'better' direction
    // For low_better: green < boundaries[0] <= amber < boundaries[1] <= red
    // For high_better: red < boundaries[1] <= amber < boundaries[0] <= green
    if (thresholdType === 'low_better') {
      if (value >= boundaries[1]) return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      if (value > boundaries[0]) return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    } else {
      if (value <= boundaries[1]) return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      if (value < boundaries[0]) return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    }
  };

  const kpis = [
    {
      title: "False Positive Rate",
      value: `${data.false_positive_rate?.toFixed(1)}%`,
      status: getRagStatus(data.false_positive_rate || 0, 'low_better', [90, 95]),
      desc: "Closed non-suspicious / Reviewed",
      icon: <Activity className="w-5 h-5" />
    },
    {
      title: "First-Review SLA",
      value: `${data.first_review_sla_rate?.toFixed(1)}%`,
      status: getRagStatus(data.first_review_sla_rate || 0, 'high_better', [95, 90]),
      desc: "Alerts reviewed within 72h SLA",
      icon: <Clock className="w-5 h-5" />
    },
    {
      title: "Backlog Ageing",
      value: `${data.backlog_ageing?.toFixed(1)}%`,
      status: getRagStatus(data.backlog_ageing || 0, 'low_better', [10, 20]),
      desc: "Open alerts past 72h SLA",
      icon: <Settings className="w-5 h-5" />
    },
    {
      title: "Productive Alert Rate",
      value: `${data.productive_alert_rate?.toFixed(1)}%`,
      status: getRagStatus(data.productive_alert_rate || 0, 'high_better', [10, 5]),
      desc: "Escalated to case / Reviewed",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: "STR Conversion Rate",
      value: `${data.str_conversion_rate?.toFixed(1)}%`,
      status: getRagStatus(data.str_conversion_rate || 0, 'high_better', [10, 5]),
      desc: "STRs filed / Cases Closed",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "QA Clearance Defect",
      value: `${data.qa_clearance_defect_rate?.toFixed(1)}%`,
      status: getRagStatus(data.qa_clearance_defect_rate || 0, 'low_better', [5, 10]),
      desc: "QA exceptions on closures",
      icon: <ShieldAlert className="w-5 h-5" />
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Governance MIS</h1>
          <p className="text-slate-500 mt-1">HKMA-aligned AML Compliance KPIs</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-500">Reporting Date (T-1)</p>
          <p className="text-lg font-bold text-indigo-600">{reportDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md ${kpi.status.bg} border-opacity-50`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white bg-opacity-60 backdrop-blur-sm ${kpi.status.color}`}>
                {kpi.icon}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white bg-opacity-70 ${kpi.status.color}`}>
                {kpi.status.color.includes('emerald') ? 'On Target' : kpi.status.color.includes('amber') ? 'Monitor' : 'Action Required'}
              </span>
            </div>
            
            <h3 className="text-slate-600 font-medium text-sm">{kpi.title}</h3>
            <div className="flex items-end space-x-2 mt-1">
              <span className={`text-3xl font-bold tracking-tight ${kpi.status.color}`}>
                {kpi.value}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-3">{kpi.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-500" />
            Operational Volume
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-slate-500 text-xs font-medium mb-1">Total Alerts</p>
              <p className="text-2xl font-bold text-slate-800">{data.total_alerts || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-slate-500 text-xs font-medium mb-1">Closed (Level 1)</p>
              <p className="text-2xl font-bold text-slate-800">{data.closed_non_suspicious || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-slate-500 text-xs font-medium mb-1">Escalated</p>
              <p className="text-2xl font-bold text-slate-800">{data.cases_opened || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-slate-500 text-xs font-medium mb-1">STRs Filed</p>
              <p className="text-2xl font-bold text-slate-800">{data.strs_filed || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-medium text-white-900 mb-2 opacity-90">Overall Health Score</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-extrabold tracking-tighter">88</span>
              <span className="text-indigo-200 font-medium">/ 100</span>
            </div>
            <p className="text-sm mt-4 text-indigo-100">
              Based on composite metrics including SLA adherence, false positive deviation, and quality control.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <ShieldAlert className="w-48 h-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
