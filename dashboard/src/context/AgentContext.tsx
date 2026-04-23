import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Agent {
  id: number;
  name: string;
  status: 'IDLE' | 'WORKING' | 'SUCCESS' | 'BLOCKED:CONFLICT' | 'PROPOSING';
  logs: string[];
}

interface AgentContextType {
  agents: Record<number, Agent>;
  selectedAgentId: number | null;
  setSelectedAgentId: (id: number | null) => void;
  updateAgent: (id: number, update: Partial<Agent>) => void;
  addLog: (id: number, log: string) => void;
  approveAgent: (name: string) => Promise<void>;
  provisionAgent: (name: string) => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const LOG_LIMIT = 200;

const AGENT_ROSTER = [
  "sec-forge", "qa-scout", "front-pilot", "back-builder",
  "auth-shield", "data-miner", "deploy-hawk", "ux-vision",
  "test-runner", "api-proxy", "log-watcher", "cache-master"
];

const agentNameToId: Record<string, number> = {};
AGENT_ROSTER.forEach((name, i) => { agentNameToId[name] = i + 1; });

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Record<number, Agent>>(() => {
    const initialAgents: Record<number, Agent> = {};
    AGENT_ROSTER.forEach((name, i) => {
      const id = i + 1;
      initialAgents[id] = {
        id,
        name,
        status: 'IDLE',
        logs: [`[SYS] Agent ${name} initialized. Ready for commands.`]
      };
    });
    return initialAgents;
  });

  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

  const updateAgent = useCallback((id: number, update: Partial<Agent>) => {
    setAgents(prev => ({
      ...prev,
      [id]: { ...prev[id], ...update }
    }));
  }, []);

  const addLog = useCallback((id: number, log: string) => {
    setAgents(prev => {
      const agent = prev[id];
      if (!agent) return prev;
      const newLogs = [...agent.logs, log].slice(-LOG_LIMIT);
      return {
        ...prev,
        [id]: { ...agent, logs: newLogs }
      };
    });
  }, []);

  const approveAgent = async (name: string) => {
    try {
      const res = await fetch(`http://localhost:3000/agent/${name}/approve`, { method: 'POST' });
      if (res.ok) {
        console.log(`[AgentContext] Approved ${name}`);
        // Optimistic status update
        const id = agentNameToId[name];
        if (id) updateAgent(id, { status: 'WORKING' });
      }
    } catch (err) {
      console.error(`[AgentContext] Failed to approve ${name}:`, err);
    }
  };

  const provisionAgent = async (name: string) => {
    try {
      const res = await fetch(`http://localhost:3000/agent/${name}/provision`, { method: 'POST' });
      if (res.ok) console.log(`[AgentContext] Triggered provisioning for ${name}`);
    } catch (err) {
      console.error(`[AgentContext] Failed to provision ${name}:`, err);
    }
  };

  // [Intent] Finalize end-to-end SSE wiring by replacing simulation with real event stream (2026-04-17)
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/events');
    
    console.log('[AgentContext] SSE Listener Connected to Orchestrator');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          console.log('[AgentContext] SSE Connection Confirmed:', data.timestamp);
          return;
        }

        if (data.agentId) {
          const id = agentNameToId[data.agentId];
          if (id) {
            if (data.message) {
              addLog(id, `[${new Date(data.timestamp).toLocaleTimeString()}] ${data.message}`);
              
              if (data.message.includes('Waiting for Shareholder Approval')) {
                updateAgent(id, { status: 'PROPOSING' });
              }
            }

            if (data.status) {
              updateAgent(id, { status: data.status });
            } else if (data.type === 'MERGE_SUCCESS') {
              updateAgent(id, { status: 'SUCCESS' });
            } else if (data.message && data.message.includes('Task complete')) {
              updateAgent(id, { status: 'SUCCESS' });
            } else if (data.message && data.message.includes('New Intent Detected')) {
              updateAgent(id, { status: 'WORKING' });
            }
          }
        }
      } catch (err) {
        console.error('[AgentContext] Error parsing SSE message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('[AgentContext] SSE Error:', err);
    };

    return () => {
      console.log('[AgentContext] Closing SSE Connection');
      eventSource.close();
    };
  }, [updateAgent, addLog]);

  return (
    <AgentContext.Provider value={{ agents, selectedAgentId, setSelectedAgentId, updateAgent, addLog, approveAgent, provisionAgent }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
};

export const useAgent = (id: number) => {
  const { agents } = useAgents();
  return agents[id];
};
