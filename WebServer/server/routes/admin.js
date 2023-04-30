const express = require('express');
const adminRouter = express.Router();
const { database } = require("../utility/db.js");

adminRouter.post('/:agent_uuid/taskqueue', async (req, res) => {
    console.log("tasking agent endpoint hit");
    const uuid = req.params.agent_uuid;

    const task = req.body;

    try {
        let updatedAgent = await database.taskAgentByUUID(uuid, task.command, task.arguments);
        return res.status(200).send(updatedAgent);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error processing agent request!");
    }
});

adminRouter.get('/agents', async (req, res) => {
    console.log("get agents endpoint hit");
    try {
        let agents = await database.getAllAgents();
        return res.status(200).send(agents);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error processing agent request!");
    }
});

adminRouter.put('/agent/:agent_uuid', async (req, res) => {
    console.log("update agent endpoint hit");
    // get uuid
    const uuid = req.params.agent_uuid;

    // get name from request body
    const data = req.body;

    // update agent name
    try {
        let updatedAgent = await database.updateAgentByUUID(uuid, data);
        return res.status(200).send(updatedAgent);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error processing agent request!");
    }
});

adminRouter.get('/:uuid/taskqueue', async (req, res) => {
    // print out the UUID
    console.log(req.params.uuid);

    try {
        // try to retrieve agent from database
        let agent = await database.getAgentByUUID(req.params.uuid);

        // if agent is found, return the agent and tasks
        if (agent) {
            console.log(agent);
            return res.status(200).send(agent.task_queue);
        } else {
            // if agent is not found, create it
            const newAgentObj = {
                uuid: req.params.uuid,
                name: "",
                ip: req.socket.remoteAddress,
                task_queue: [],
                last_seen: new Date(),
                active: true,
                command_results: {},
                saved_addresses: {},
            };

            let newAgent = await database.createAgent(newAgentObj);

            console.log(newAgent);
            return res.status(201).send(newAgent);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error processing agent request!");
    }
});


module.exports = adminRouter;