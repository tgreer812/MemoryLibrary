import './App.css';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import FoundAddressesSection from './components/FoundAddressesSection';
import ScanSection from './components/ScanSection';
import EditableAddressesSection from './components/EditableAddressesSection';
import ProcessesDebugSection from './components/ProcessesDebugSection';

function App() {
  const [selectedAgentUUID, setSelectedAgentUUID] = useState(null);

  const handleAgentSelected = (uuid) => {
    console.log("Agent selected: " + uuid);
    setSelectedAgentUUID(uuid);
  };

  return (
    <div className="App">
      <Sidebar onAgentSelected={handleAgentSelected} />
      <div className="main">
        <FoundAddressesSection agentUUID={selectedAgentUUID} />
        <ScanSection agentUUID={selectedAgentUUID} />
        <EditableAddressesSection agentUUID={selectedAgentUUID} />
        <ProcessesDebugSection agentUUID={selectedAgentUUID} />
      </div>
    </div>
  );
}

export default App;
