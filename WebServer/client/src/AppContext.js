import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [selectedAgentUUID, setSelectedAgentUUID] = useState(null);
  const [selectedPID, setSelectedPID] = useState(null);
  const [newScanLaunched, setNewScanLaunched] = useState(false);

  const value = {
    selectedAgentUUID,
    setSelectedAgentUUID,
    selectedPID,
    setSelectedPID,
    newScanLaunched,
    setNewScanLaunched,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
