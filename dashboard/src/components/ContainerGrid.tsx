// [Intent] Orchestrates the rendering of the agent grid. 
// Uses the agent record from context to pass individual agent data to memoized cells (2026-04-17).

import React, { useCallback } from 'react';
import AgentCell from './AgentCell';
import { useAgents } from '../context/AgentContext';

const ContainerGrid: React.FC = () => {
  const { agents, selectedAgentId, setSelectedAgentId } = useAgents();
  const agentIds = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleSelect = useCallback((id: number) => {
    setSelectedAgentId(id);
  }, [setSelectedAgentId]);

  return (
    <div className="container-grid">
      {agentIds.map((id) => (
        <AgentCell 
          key={id} 
          agent={agents[id]} 
          isSelected={selectedAgentId === id}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

export default ContainerGrid;
