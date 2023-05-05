import "./ScanSection.css";
import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import Backend from '../utility/backend';

const ScanSection = () => {
  const { selectedAgentUUID, selectedPID, setNewScanLaunched } = useContext(AppContext);
  const [value, setValue] = useState('');
  const [isHex, setIsHex] = useState(false);

  const handleNewScan = async () => {
    const inputValue = isHex ? parseInt(value, 16) : value;
    //await Backend.newScan(selectedAgentUUID, inputValue);
    await Backend.taskAgentByUUID(selectedAgentUUID, "scan", {
      pid: selectedPID, // Replace with actual PID
      type: "int", // Replace with actual type ('int', 'float', or 'string')
      value: value, // Replace with actual value as a string
      start: 0x10000, // Replace with actual start address
      stop: 0x7FFFFFFFFFFF, // Replace with actual stop address
      maxfound: 50000, // Replace with actual maximum number of found addresses
      alignment: 4, // Replace with actual alignment value (optional, default is 1)
  });
  
    setNewScanLaunched(true);
  };

  const handleNextScan = async () => {
    const inputValue = isHex ? parseInt(value, 16) : value;
    await Backend.nextScan(selectedAgentUUID, inputValue);
    setNewScanLaunched(true);
  };

  const renderScanControls = () => {
    if (!selectedAgentUUID && !selectedPID) {
      return <p>Please select an agent and a PID first.</p>;
    } else if (!selectedAgentUUID) {
      return <p>Please select an agent first.</p>;
    } else if (!selectedPID) {
      return <p>Please select a PID first.</p>;
    } else {
      return (
        <>
          <div className="button-container">
            <button className="new-scan" onClick={handleNewScan}>
              New Scan
            </button>
            <button className="next-scan" onClick={handleNextScan}>
              Next Scan
            </button>
            <button className="undo-scan">Undo Scan</button>
          </div>
          <label htmlFor="valueInput" className="value-label">
            Value:
          </label>
          <div className="input-group">
            <input
              type="text"
              id="valueInput"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="hexCheckbox">
              <input
                type="checkbox"
                id="hexCheckbox"
                checked={isHex}
                onChange={(e) => setIsHex(e.target.checked)}
              />{" "}
              Hex
            </label>
          </div>
        </>
      );
    }
  };

  return <div className="scan-section">{renderScanControls()}</div>;
};

export default ScanSection;
