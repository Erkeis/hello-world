// [Intent] Smooth sidebar transitions and conflict notifications.
// Employs a local "lastAgent" state to ensure content remains visible during the 
// CSS transform transition even after the context selection is cleared (2026-04-17).

import React, { useEffect, useRef, useState } from 'react';
import { useAgents, type Agent } from '../context/AgentContext';

const AgentDetailSidebar: React.FC = () => {
  const { agents, selectedAgentId, setSelectedAgentId } = useAgents();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Local state to retain agent data during close animation
  const [lastAgent, setLastAgent] = useState<Agent | null>(null);
  
  const currentAgent = selectedAgentId ? agents[selectedAgentId] : null;

  // Update lastAgent when a new agent is selected, but don't clear it immediately on deselect
  useEffect(() => {
    if (currentAgent) {
      setLastAgent(currentAgent);
    }
  }, [currentAgent]);

  // Beep logic for conflicts
  useEffect(() => {
    if (currentAgent?.status === 'BLOCKED:CONFLICT') {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  }, [currentAgent?.status]);

  // If we have neither a current nor a previous agent, we can't render anything
  if (!lastAgent && !currentAgent) return null;

  // Use currentAgent if available (for live updates), otherwise use lastAgent (for closing transition)
  const displayAgent = currentAgent || lastAgent!;
  const { approveAgent, provisionAgent } = useAgents();

  return (
    <div 
      className="sidebar-container"
      style={{
        transform: selectedAgentId ? 'translateX(0)' : 'translateX(100%)'
      }}
    >
      <div className="sidebar-header">
        <div>
          <h2 className="sidebar-title">{displayAgent.name}</h2>
          <div className="sidebar-meta">
            ID: {displayAgent.id} | Status: {displayAgent.status}
          </div>
        </div>
        <button 
          onClick={() => setSelectedAgentId(null)}
          className="close-button"
        >
          &times;
        </button>
      </div>

      <div className="sidebar-content">
        {displayAgent.status === 'PROPOSING' && (
          <div className="proposal-alert" style={{ 
            backgroundColor: 'rgba(99, 102, 241, 0.1)', 
            border: '1px solid #6366f1',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            color: '#818cf8'
          }}>
            <strong>⚡ Action Required:</strong> Agent is proposing a new plan. Review the logs below and approve to proceed.
          </div>
        )}
        {displayAgent.logs.map((log, i) => (
          <div 
            key={i} 
            className="sidebar-log-line"
            style={{ 
              borderLeft: `2px solid ${log.includes('[SYS]') ? '#6366f1' : '#2e303a'}`
            }}
          >
            {log}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        {displayAgent.status === 'PROPOSING' && (
          <button 
            className="action-button approve-btn"
            style={{ backgroundColor: '#10b981', color: '#fff' }}
            onClick={() => approveAgent(displayAgent.name)}
          >
            APPROVE
          </button>
        )}
        <button 
          className="action-button provision-btn"
          onClick={() => provisionAgent(displayAgent.name)}
        >
          RE-PROVISION
        </button>
        <button 
          className="action-button restart-btn"
          onClick={() => provisionAgent(displayAgent.name)} // [Intent] Reuse provision logic for now as per Issue 1A
        >
          RESTART
        </button>
      </div>
    </div>
  );
};

export default AgentDetailSidebar;
