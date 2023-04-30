import React from 'react';
import Table from './Table';
import './ProcessTable.css';

const ProcessTable = ({ onRowClick, ...props }) => {
  const renderRow = (row, rowIndex) => (
    <tr
      key={rowIndex}
      className="process-table-row"
      onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
      onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
      onClick={() => onRowClick(row, rowIndex)}
    >
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  );

  return <Table {...props} renderRow={renderRow} />;
};

export default ProcessTable;
