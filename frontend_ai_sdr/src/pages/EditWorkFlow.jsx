import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SideNavDash from "../components/SideNavDash";

// npm install @xyflow/react

const initialNodes = [
  { id: "1", type: "input", position: { x: 250, y: 0 }, data: { label: "Trigger: Add CSV File" } },
  { id: "2", position: { x: 250, y: 150 }, data: { label: "Enrich Leads using AI" } },
  { id: "3", position: { x: 250, y: 300 }, data: { label: "Draft Email using AI" } },
  { id: "4", position: { x: 250, y: 450 }, data: { label: "Send Outreach Email" } },
  { id: "5", position: { x: 250, y: 600 }, data: { label: "After 2 Days - Send Follow-up Email" } },
  { id: "6", position: { x: 250, y: 750 }, data: { label: "If User Responds - Schedule Meet" } },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e4-5", source: "4", target: "5" },
  { id: "e5-6", source: "5", target: "6" },
];

const EditWorkFlow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex" }}>
      <SideNavDash />
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default EditWorkFlow;
