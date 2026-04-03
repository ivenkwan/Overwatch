import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

interface GraphExplorerProps {
  data: any;
  onNodeClick?: (nodeId: string) => void;
}

export default function GraphExplorer({ data, onNodeClick }: GraphExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: data,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#2563eb',
            'label': 'data(label)',
            'color': '#fff',
            'font-size': '12px',
            'text-valign': 'center',
            'width': 40,
            'height': 40
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(amount_usd)',
            'font-size': '10px'
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
        animate: true
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
  }, [data, onNodeClick]);

  return (
    <div className="w-full h-full bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-slate-900/80 p-2 rounded text-xs text-slate-300 border border-slate-700">
        Investigator View: {data.length} elements
      </div>
    </div>
  );
}
