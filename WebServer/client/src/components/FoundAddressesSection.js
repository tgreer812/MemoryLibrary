import React from 'react';
import Table from './Table';
import './FoundAddressesSection.css';

const FoundAddressesSection = () => {
  const headers = ['Address', '	Value', 'Previous'];
  const rows = [
  ];

  return (
    <div className="table-section found-addresses">
      <div className="table-wrapper">
        <div className="table-container">
          <Table headers={headers} rows={rows} />
        </div>
      </div>
      <div className="down-arrow-container">
        <button id="downArrowButton">
          {/* Replace this with an actual down arrow icon if desired */}
          &darr;
        </button>
      </div>
    </div>
  );
};

export default FoundAddressesSection;
