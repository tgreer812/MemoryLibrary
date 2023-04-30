// src/EditableAddressesSection.js
import React from 'react';
import Table from './Table';
import './EditableAddressesSection.css';

const EditableAddressesSection = () => {
  // Replace this with actual editable addresses data.
  const editableAddresses = [
    {
      active: true,
      description: 'Description 1',
      address: '0x1234',
      type: 'Type 1',
      value: 'Value 1',
    },
    {
      active: false,
      description: 'Description 2',
      address: '0x5678',
      type: 'Type 2',
      value: 'Value 2',
    },
    {
      active: true,
      description: 'Description 3',
      address: '0x9abc',
      type: 'Type 3',
      value: 'Value 3',
    },
  ];

  const headers = ['Active', 'Description', 'Address', 'Type', 'Value'];
  const rows = editableAddresses.map((address) => [
    address.active ? '✓' : '',
    address.description,
    address.address,
    address.type,
    address.value,
  ]);

  return (
    <div className="table-section editable-addresses">
      <div className="table-container">
        <Table headers={headers} rows={rows} />
      </div>
    </div>
  );
};

export default EditableAddressesSection;
