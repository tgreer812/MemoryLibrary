import React, { useState, useEffect, useCallback } from 'react';
//import Table from './Table';
import Backend from '../utility/backend';
import ProcessTable from './ProcessTable';
import './ProcessesDebugSection.css';

const ProcessesDebugSection = ({ agentUUID }) => {
    const [processes, setProcesses] = useState([]);

    const fetchProcesses = async () => {
        if (agentUUID) {
            const taskid = await Backend.getAgentTaskId(agentUUID);
            console.log("Retrieved taskid: " + taskid);

            let command = "process_list";
            let command_args = [ "--maxprocesses", "1024" ];

            const processes = await Backend.taskAgentByUUID(agentUUID, command, command_args);
            if (processes) {
                return processes;
            }  
        }
        return [];
    };

    const getProcesses = useCallback(async () => {
        if (agentUUID) {
            const agent = await Backend.getAgentByUUID(agentUUID);
            if (agent) {
                try {
                    const processes = agent.command_results.process_list.process_list.processes;
                    return processes;
                } catch (err) {
                    console.log("Error: " + err);
                }
            }
        }
        return [];
    }, [agentUUID]);

    const handleListProcessesButtonClick = async () => {
        alert("List Processes button clicked!");
        let processes = await fetchProcesses();
        console.log("Processes: " + JSON.stringify(processes));
        setProcesses(processes);
    };

    const handleRowClick = (row, rowIndex) => {
        const pid = row[0]; // Assuming the PID is in the first column
        alert(`Selected PID: ${pid}`);
        // You can pass the PID up to the parent App component here
      };

    useEffect(() => {
        (async () => {
            setProcesses(await getProcesses());
        })();
    }, [agentUUID, getProcesses]);

    const headers = ['PID', 'Name'];
    const rows = processes.map((process) => [process.pid, process.name]);

    return (
        <div className="processes-debug-section">
          <button id="listProcessesButton" onClick={handleListProcessesButtonClick}>
            List Processes
          </button>
          <div className="table-container">
            <ProcessTable headers={headers} rows={rows} onRowClick={handleRowClick} />
          </div>
        </div>
    );
};

export default ProcessesDebugSection;
