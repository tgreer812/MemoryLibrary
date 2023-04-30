import React from 'react';
import Table from './Table';
import './ProcessTable.css';

const ProcessTable = ({ headers, rows, onRowClick }) => {
  const wrappedRows = rows.map((row, rowIndex) => {
    const wrappedRow = (
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
    return wrappedRow;
  });

  return <Table headers={headers}>{wrappedRows}</Table>;
};

export default ProcessTable;
