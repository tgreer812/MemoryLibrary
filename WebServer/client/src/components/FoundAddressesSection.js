import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../AppContext';
import Table from './Table';
import './FoundAddressesSection.css';

const FoundAddressesSection = () => {
  const { selectedAgentUUID, selectedPID, newScanLaunched, setNewScanLaunched } = useContext(AppContext);
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    if (selectedAgentUUID && selectedPID && newScanLaunched) {
      // Replace this with the actual call to fetch addresses from the database
      const fetchedAddresses = []; // Dummy data for now
      return fetchedAddresses;
    }
    return [];
  };

  useEffect(() => {
    const loadAddresses = async () => {
      const newAddresses = await fetchAddresses();
      setAddresses(newAddresses);
      setNewScanLaunched(false);
    };

    if (newScanLaunched) {
      loadAddresses();
    }
  }, [newScanLaunched, setNewScanLaunched]);

  useEffect(() => {
    // Clear addresses when either agent UUID or PID is not selected
    setAddresses([]); 
  }, [selectedAgentUUID, selectedPID]);

  const headers = ['Address', 'Value', 'Previous'];
  const rows = addresses; // Assuming the addresses data is in the desired format

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
