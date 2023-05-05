import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../AppContext';
import Table from './Table';
import Backend from '../utility/backend';
import './FoundAddressesSection.css';

const FoundAddressesSection = () => {
  const { selectedAgentUUID, selectedPID } = useContext(AppContext);
  const [addresses, setAddresses] = useState([]);
  const [addressesSet, setAddressesSet] = useState(false);

  const getAddresses = useCallback(async () => {
    if (selectedAgentUUID && selectedPID && !addressesSet) {
      const agent = await Backend.getAgentByUUID(selectedAgentUUID);
      if (agent && agent.command_results && agent.command_results.scan) {
        const foundAddresses = agent.command_results.scan.found_addresses;
        const value = agent.command_results.scan.value;
        // Combine addresses and values into a single array
        const combinedAddresses = foundAddresses.map((address, index) => [address, value]);
        return combinedAddresses;
      }
    }
    return [];
  }, [selectedAgentUUID, selectedPID, addressesSet]);

  useEffect(() => {
    if (selectedAgentUUID && selectedPID && !addressesSet) {
      setAddresses([]);
      const pollAddresses = async () => {
        const fetchedAddresses = await getAddresses();
        if (fetchedAddresses.length > 0) {
          setAddresses(fetchedAddresses);
          setAddressesSet(true);
        }
      };
      pollAddresses();
      const intervalRef = setInterval(pollAddresses, 1000);

      return () => {
        clearInterval(intervalRef);
      };
    }
  }, [selectedAgentUUID, selectedPID, getAddresses, addressesSet]);

  useEffect(() => {
    // Clear addresses when either agent UUID or PID is not selected
    setAddresses([]);
  }, [selectedAgentUUID, selectedPID]);

  const headers = ['Address', 'Value'];
  //const rows = addresses; // Assuming the addresses data is in the desired format

  return (
    <div className="table-section found-addresses">
      <div className="table-wrapper">
        <div className="table-container">
          <Table headers={headers} rows={addresses} />
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
