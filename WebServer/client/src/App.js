import './App.css';
import React, { useCallback, useContext, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FoundAddressesSection from './components/FoundAddressesSection';
import ScanSection from './components/ScanSection';
import EditableAddressesSection from './components/EditableAddressesSection';
import ProcessesDebugSection from './components/ProcessesDebugSection';
import { AppContext } from './AppContext';

function App() {
  const { selectedAgentUUID, setSelectedAgentUUID, selectedPID, setSelectedPID } = useContext(AppContext);

  const handleAgentSelected = (uuid) => {
    console.log("Agent selected: " + uuid);
    setSelectedAgentUUID(uuid);
  };

  const handlePidSelected = (pid) => {
    alert("PID selected: " + pid + " in app.js");
    setSelectedPID(pid);
  };

  const onPIDUpdate = useCallback(async () => {
    alert("PID updated in app.js to: " + selectedPID);
  }, [selectedPID]);

  useEffect(() => {
    onPIDUpdate();
  }, [onPIDUpdate]);

  return (
    <div className="App">
      <Sidebar onAgentSelected={handleAgentSelected} />
      <div className="main">
        <FoundAddressesSection />
        <ScanSection />
        <EditableAddressesSection />
        <ProcessesDebugSection />
      </div>
    </div>
  );
}

export default App;
