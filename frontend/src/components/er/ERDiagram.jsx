import React, { useMemo, useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomTableNode from './CustomTableNode';
import RelationshipPanel from './RelationshipPanel';

const nodeTypes = {
  tableNode: CustomTableNode,
};

export default function ERDiagram({ schema, onSelectTable }) {
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [activeTable, setActiveTable] = useState(null);

  // Derive Nodes
  const initialNodes = useMemo(() => {
    if (!schema?.tables) return [];

    return schema.tables.map((t, index) => ({
      id: t.tableName,
      type: 'tableNode',
      position: index === 0 ? { x: 80, y: 120 } : { x: 480, y: 120 },
      data: {
        tableName: t.tableName,
        columns: t.columns,
        rowCount: t.rowCount,
        isHighlighted: activeTable === t.tableName
      }
    }));
  }, [schema, activeTable]);

  // Derive Edges
  const initialEdges = useMemo(() => {
    if (!schema?.relationships) return [];

    return schema.relationships.map((rel) => ({
      id: rel.id,
      source: rel.parentTable,
      target: rel.childTable,
      sourceHandle: 'source-right',
      targetHandle: 'target-left',
      type: 'smoothstep',
      animated: true,
      label: '1 : N (Foreign Key)',
      labelStyle: { fill: '#38bdf8', fontWeight: 600, fontSize: 11, fontFamily: 'monospace' },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 6,
      labelBgStyle: { fill: '#0c1222', stroke: '#1f2d52', strokeWidth: 1 },
      style: { stroke: '#38bdf8', strokeWidth: 2.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#38bdf8',
        width: 18,
        height: 18,
      },
      data: rel
    }));
  }, [schema]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when initialNodes change
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    if (schema?.relationships?.length > 0 && !selectedRelationship) {
      setSelectedRelationship(schema.relationships[0]);
    }
  }, [initialNodes, initialEdges, schema]);

  const onNodeClick = useCallback((event, node) => {
    setActiveTable(node.id);
    if (onSelectTable) onSelectTable(node.id);

    // Find relationship associated with this table
    const rel = schema?.relationships?.find(
      r => r.parentTable === node.id || r.childTable === node.id
    );
    if (rel) setSelectedRelationship(rel);
  }, [schema, onSelectTable]);

  const onEdgeClick = useCallback((event, edge) => {
    if (edge.data) {
      setSelectedRelationship(edge.data);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[640px]">
      {/* Canvas Area */}
      <div className="lg:col-span-2 bg-navy-950 border border-navy-700/80 rounded-2xl overflow-hidden relative shadow-2xl">
        <div className="absolute top-4 left-4 z-10 bg-navy-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-navy-700 text-xs font-mono text-slate-300 flex items-center gap-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>Interactive ER Graph: Drag nodes or click to inspect</span>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#1e293b" gap={20} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Side Details Panel */}
      <div className="space-y-4">
        <RelationshipPanel
          relationship={selectedRelationship}
          selectedNode={activeTable}
        />

        {/* ER Theory Tip */}
        <div className="bg-navy-900/80 border border-navy-700/60 rounded-xl p-4 text-xs text-slate-400 space-y-2">
          <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
            ER Concept: One-to-Many (1:N)
          </h5>
          <p className="leading-relaxed">
            A <strong>One-to-Many</strong> relationship is implemented by placing the primary key of the parent (<code className="text-amber-300">courses.course_id</code>) as a foreign key attribute inside the child (<code className="text-blue-300">students.course_id</code>).
          </p>
        </div>
      </div>
    </div>
  );
}
