import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

interface GraphExplorerProps {
  data: any[];
  isFastMode?: boolean;
  onNodeClick?: (nodeId: string) => void;
}

export default function GraphExplorer({ data, isFastMode = false, onNodeClick }: GraphExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Logarithmic scaling for edge thickness
    const elements = data.map(item => {
      if (item.data.source && item.data.target) {
        // Normalize edge thickness based on volume or amount
        const vol = item.data.volume || item.data.amount_usd || item.data.amount || 1;
        // log10 scale clamped between 1px and 12px
        let thickness = Math.max(1, Math.min(12, Math.log10(vol) * 1.2)); 
        return { ...item, data: { ...item.data, thickness: isFastMode ? thickness : Math.max(2, thickness) } };
      }
      return item;
    });

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: any) => {
              if (!isFastMode) {
                 const risk = ele.data('risk_score') || 0;
                 if (risk >= 80) return '#ef4444'; // High Risk (Red)
                 if (risk >= 50) return '#f59e0b'; // Medium (Amber)
                 return '#3b82f6'; // Default (Blue)
              }
              const status = ele.data('threshold_status');
              if (status === 'RED') return '#ef4444';
              if (status === 'AMBER') return '#f59e0b';
              if (status === 'GREEN') return '#22c55e';
              return '#475569';
            },
            'shape': (ele: any) => {
              const lbl = ele.data('label');
              if (lbl === 'Person' || lbl === 'Individual') return 'ellipse';
              if (lbl === 'Company' || lbl === 'Business' || lbl === 'Entity') return 'round-rectangle';
              if (lbl === 'Account' || lbl === 'Wallet') return 'hexagon';
              return 'ellipse';
            },
            'label': isFastMode ? '' : 'data(label)',
            'color': '#fff',
            'font-size': '12px',
            'text-valign': 'center',
            'width': isFastMode ? 24 : 40,
            'height': isFastMode ? 24 : 40,
            'border-width': isFastMode ? 2 : 0,
            'border-color': '#0f172a'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 'data(thickness)',
            'line-color': (ele: any) => {
              const type = ele.data('label');
              if (type === 'TRANSFERS' || type === 'SENT') return '#8b5cf6'; // Purple
              if (type === 'OWNS' || type === 'HAS_ACCOUNT') return '#10b981'; // Green
              return isFastMode ? '#64748b' : '#94a3b8';
            },
            'target-arrow-color': (ele: any) => {
              const type = ele.data('label');
              if (type === 'TRANSFERS' || type === 'SENT') return '#8b5cf6';
              if (type === 'OWNS' || type === 'HAS_ACCOUNT') return '#10b981';
              return isFastMode ? '#64748b' : '#94a3b8';
            },
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': isFastMode ? '' : 'data(amount_usd)',
            'font-size': '10px',
            'opacity': isFastMode ? 0.7 : 1
          }
        },
        {
          selector: 'node[type="SuperNode"]',
          style: {
            'background-color': '#dc2626',
            'shape': 'diamond'
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: true,
        // Optional: tweak layout parameters for denser graphs
        nodeRepulsion: 400000,
        idealEdgeLength: 50,
      }
    });

    cyRef.current.on('tap', 'node', (evt: any) => {
      const node = evt.target;
      if (onNodeClick) onNodeClick(node.id());
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [data, isFastMode, onNodeClick]);

  return (
    <div className="w-full h-full bg-slate-950 rounded-xl border border-slate-800/80 shadow-inner relative overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md p-2 rounded text-xs font-bold text-slate-300 border border-slate-700 shadow-xl">
        {isFastMode ? 'FAST MODE (TOPOLOGY)' : 'FULL DISCOVERY'}: {data.length} elements
      </div>
    </div>
  );
}
