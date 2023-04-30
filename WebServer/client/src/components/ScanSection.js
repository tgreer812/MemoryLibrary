import "./ScanSection.css";
import React from 'react';

const ScanSection = () => {
    return (
      <div className="scan-section">
        <div className="button-container">
          <button className="new-scan">New Scan</button>
          <button className="next-scan">Next Scan</button>
          <button className="undo-scan">Undo Scan</button>
        </div>
        <label htmlFor="valueInput" className="value-label">Value:</label>
        <div className="input-group">
          <input type="text" id="valueInput" />
          <label htmlFor="hexCheckbox">
            <input type="checkbox" id="hexCheckbox" /> Hex
          </label>
        </div>
      </div>
    );
  };
  
  export default ScanSection;