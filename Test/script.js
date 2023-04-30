const sidebar = document.getElementById('sidebar');

// Replace this array with data fetched from your server or API.
const agents = [
    { id: 1, name: 'Agent 1' },
    { id: 2, name: 'Agent 2' },
    { id: 3, name: 'Agent 3' },
    { id: 4, name: 'Agent 4' },
    { id: 5, name: 'Agent 5' },
    { id: 6, name: 'Agent 6' },
];

agents.forEach(agent => {
    const button = document.createElement('button');
    const icon = document.createElement('i');
    icon.className = 'fa fa-desktop';
    button.appendChild(icon);
    const textNode = document.createTextNode(' ' + agent.name);
    button.appendChild(textNode);
    button.addEventListener('click', () => {
        // Handle button click here (e.g., open agent chat or profile).
    });
    sidebar.appendChild(button);
});

// Add sample data to Table 1
const table1 = document.getElementById('table1');
const table1Data = [
  ['0x00123456', '123', '100'],
  ['0x00123457', '200', '150'],
  ['0x00123458', '50', '25'],
  ['0x00123456', '123', '100'],
  ['0x00123457', '200', '150'],
  ['0x00123458', '50', '25'],
  ['0x00123456', '123', '100'],
  ['0x00123457', '200', '150'],
  ['0x00123458', '50', '25'],
];

table1Data.forEach(rowData => {
  const row = document.createElement('tr');
  rowData.forEach(cellData => {
    const cell = document.createElement('td');
    cell.textContent = cellData;
    row.appendChild(cell);
  });
  table1.appendChild(row);
});

// Add sample data to Table 2
const table2 = document.getElementById('table2');
const table2Data = [
  ['Yes', 'No Description', '0x00123456', 'Integer', '100'],
  ['No', 'No Description', '0x00123457', 'Integer', '200'],
  ['Yes', 'No Description', '0x00123458', 'Integer', '50'],
];

table2Data.forEach(rowData => {
  const row = document.createElement('tr');
  rowData.forEach(cellData => {
    const cell = document.createElement('td');
    cell.textContent = cellData;
    row.appendChild(cell);
  });
  table2.appendChild(row);
});

// Add sample data to the Processes table (new code)
const processesTable = document.getElementById('processesTable');
const processesTableData = [
  ['1234', 'Process A'],
  ['5678', 'Process B'],
  ['9101', 'Process C'],
  ['1234', 'Process A'],
  ['5678', 'Process B'],
  ['9101', 'Process C'],
  ['1234', 'Process A'],
  ['5678', 'Process B'],
  ['9101', 'Process C'],
  ['1234', 'Process A'],
  ['5678', 'Process B'],
  ['9101', 'Process C'],
  ['1234', 'Process A'],
  ['5678', 'Process B'],
  ['9101', 'Process C'],
];

processesTableData.forEach(rowData => {
  const row = document.createElement('tr');
  rowData.forEach(cellData => {
    const cell = document.createElement('td');
    cell.textContent = cellData;
    row.appendChild(cell);
  });
  processesTable.appendChild(row);
});

