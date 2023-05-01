import React, { useState, useEffect, useCallback } from 'react';
import Backend from '../utility/backend';
import ProcessTable from './ProcessTable';
import './ProcessesDebugSection.css';

const ProcessesDebugSection = ({ agentUUID, setPid }) => {
    const [processes, setProcesses] = useState([]);
    const [processesSet, setProcessesSet] = useState(false);

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
        if (agentUUID && !processesSet) {
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
    }, [agentUUID, processesSet]);

    useEffect(() => {
        if (agentUUID && !processesSet) {
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
    }, [agentUUID, getProcesses, processesSet]);

    const handleListProcessesButtonClick = async () => {
        alert("List Processes button clicked!");
        setProcessesSet(false);
        let processes = await fetchProcesses();
        console.log("Processes: " + JSON.stringify(processes));
        setProcesses(processes);
    };

    const handleRowClick = (row, rowIndex) => {
        const pid = row[0]; // Assuming the PID is in the first column
        //alert(`Selected PID: ${pid}`);
        console.log(`Selected PID: ${pid}`);
        setPid(pid);
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
