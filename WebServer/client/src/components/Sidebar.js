// src/Sidebar.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktopAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Backend from '../utility/backend';
import './Sidebar.css';

const Sidebar = ({ onAgentSelected }) => {
  const [agents, setAgents] = useState([]);
  const [editingAgent, setEditingAgent] = useState(null);
  const [newNames, setNewNames] = useState({});

  const handleButtonClick = (agent) => {
    alert("Agent button clicked: " + agent.uuid);
    onAgentSelected(agent.uuid);
  };

  const handleEditClick = (event, agent) => {
    event.stopPropagation();
    setEditingAgent(agent.uuid);
    setNewNames({ ...newNames, [agent.uuid]: agent.name });
  };

  const handleNameChange = (event, agentId) => {
    setNewNames({ ...newNames, [agentId]: event.target.value });
  };

  const handleNameSubmit = async (agent, inputValue) => {
    console.log("Changing agent name for agent: " + agent + " to: " + inputValue);
    await Backend.updateAgentName(agent.uuid, inputValue);
    setEditingAgent(null);
  };

  useEffect(() => {
    const fetchAgents = async () => {
      const response = await Backend.getAgentList();
      setAgents(response.filter((agent) => agent.active));
    };

    const intervalId = setInterval(fetchAgents, 5000); // Fetch agents every 5 seconds

    fetchAgents(); // Fetch agents immediately on mount

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  return (
    <div className="sidebar" id="sidebar">
      {agents.map((agent) => (
        <div key={agent.uuid} className="agent-container">
          {editingAgent === agent.uuid ? (
            <>
              <input value={newNames[agent.uuid]} onChange={(event) => handleNameChange(event, agent.uuid)} />
              <button onClick={() => handleNameSubmit(agent, newNames[agent.uuid])}>Save</button>
            </>
          ) : (
            <button className="agent-button" onClick={() => handleButtonClick(agent)}>
              <FontAwesomeIcon icon={faDesktopAlt} />
              {`\u00A0\u00A0${agent.name.length > 0 ? agent.name : agent.ip}`}
            </button>
          )}
          <button className="edit-icon" onClick={(event) => handleEditClick(event, agent)}>
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>

        </div>
      ))}
    </div>
  );
};

export default Sidebar;
