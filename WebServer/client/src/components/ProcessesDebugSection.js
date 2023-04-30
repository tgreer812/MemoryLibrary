import React, { useState, useEffect, useCallback } from 'react';
import Table from './Table';
import Backend from '../utility/backend';
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
                <Table headers={headers} rows={rows} />
            </div>
        </div>
    );
};

export default ProcessesDebugSection;
