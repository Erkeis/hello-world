// [Intent] Main entry point for the Dashboard UI. 
// Provides the AgentContext and orchestrates the primary layout components (2026-04-17).

import './App.css'
import ContainerGrid from './components/ContainerGrid'
import AgentDetailSidebar from './components/AgentDetailSidebar'
import { AgentProvider } from './context/AgentContext'

function App() {
  return (
    <AgentProvider>
      <div className="App war-room-container">
        <header className="war-room-header">
          <h1 className="war-room-title">AGENT FARM WAR ROOM</h1>
          <div className="war-room-subtitle">PHASE 2 OPERATIONAL COMMAND</div>
        </header>
        <ContainerGrid />
        <AgentDetailSidebar />
      </div>
    </AgentProvider>
  )
}

export default App
