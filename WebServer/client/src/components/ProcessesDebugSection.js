import React, { useState, useEffect, useCallback, useContext } from 'react';
import Backend from '../utility/backend';
import ProcessTable from './ProcessTable';
import { AppContext } from '../AppContext';
import './ProcessesDebugSection.css';

const ProcessesDebugSection = () => {
    const { selectedAgentUUID, setSelectedPID } = useContext(AppContext);
    const [processes, setProcesses] = useState([]);
    const [processesSet, setProcessesSet] = useState(false);

    const fetchProcesses = async () => {
        if (selectedAgentUUID) {
            const taskid = await Backend.getAgentTaskId(selectedAgentUUID);
            console.log("Retrieved taskid: " + taskid);

            let command = "process_list";
            let command_args = [ "--maxprocesses", "1024" ];

            const processes = await Backend.taskAgentByUUID(selectedAgentUUID, command, command_args);
            if (processes) {
                return processes;
            }
        }
        return [];
    };

    const getProcesses = useCallback(async () => {
        if (selectedAgentUUID && !processesSet) {
            const agent = await Backend.getAgentByUUID(selectedAgentUUID);
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
    }, [selectedAgentUUID, processesSet]);

    useEffect(() => {
        if (selectedAgentUUID && !processesSet) {
            setProcesses([]);
            const pollProcesses = async () => {
                const fetchedProcesses = await getProcesses();
                if (fetchedProcesses.length > 0) {
                    setProcesses(fetchedProcesses);
                    setProcessesSet(true);
                }
            };
            pollProcesses();
            const intervalRef = setInterval(pollProcesses, 1000);

            return () => {
                clearInterval(intervalRef);
            };
        }
    }, [selectedAgentUUID, getProcesses, processesSet]);

    const handleListProcessesButtonClick = async () => {
        alert("List Processes button clicked!");
        setProcessesSet(false);
        let processes = await fetchProcesses();
        console.log("Processes: " + JSON.stringify(processes));
        setProcesses(processes);
    };

    const handleRowClick = (row, rowIndex) => {
        const pid = row[0]; // Assuming the PID is in the first column
        console.log(`Selected PID: ${pid}`);
        setSelectedPID(pid);
      };

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
