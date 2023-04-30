import React, { useState, useEffect } from 'react';
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

            const response = await Backend.taskAgentByUUID(agentUUID, command, command_args);
            if (response) {
                setProcesses(response);
            }
            else {
                console.log("Error: response is null");
                setProcesses([]);
            }
        } else {
            setProcesses([]);
        }
    };

    const handleListProcessesButtonClick = async () => {
        // Handle "List Processes" button click here.
        alert("List Processes button clicked!");
        await fetchProcesses();
    };

    useEffect(() => {
    
        //fetchProcesses();
    }, [agentUUID]);

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
