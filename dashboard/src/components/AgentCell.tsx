// [Intent] Performance optimization via React.memo and prop-based isolation.
// This ensures that log updates in one agent only re-render its specific cell, 
// rather than triggering a full grid re-render (2026-04-17).

import React from 'react';
import { type Agent } from '../context/AgentContext';

interface AgentCellProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const AgentCell: React.FC<AgentCellProps> = React.memo(({ agent, isSelected, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WORKING': return '#eab308';
      case 'SUCCESS': return '#22c55e';
      case 'BLOCKED:CONFLICT': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  return (
    <div
      onClick={() => onSelect(agent.id)}
      className="agent-cell"
      style={{
        border: `2px solid ${isSelected ? '#6366f1' : '#2e303a'}`,
      }}
    >
      <div className="agent-cell-header">
        <span className="agent-name">{agent.name}</span>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(agent.status) }}
        >
          {agent.status}
        </span>
      </div>

      <div className="agent-logs-preview">
        {agent.logs.slice(-5).map((log, i) => (
          <div key={i} className="log-line" style={{ opacity: 1 - (4 - i) * 0.15 }}>
            {log}
          </div>
        ))}
      </div>

      {agent.status === 'BLOCKED:CONFLICT' && <div className="conflict-pulse" />}
    </div>
  );
});

export default AgentCell;
