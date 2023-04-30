const express = require('express');
const passport = require('../middleware/passport');
const agentRouter = express.Router();
const { database } = require('../utility/db');

agentRouter.use('/', (req, res, next) => {
    console.log(req.session);
    next();
});

//let test_task = {"taskqueue":[{"taskid":"1","command":"scan","arguments":["--pid","1234","--type","integer","--value","1","--start","0","--stop","100","--maxfound","100000"]},{"taskid":"2","command":"process_list","arguments":["--maxprocesses","0"]}]};
//let test_task = {"task_queue":[{"taskid":2,"command":"process_list","arguments":["--maxprocesses","1024"]}]};

agentRouter.get('/:uuid/taskqueue', async (req, res) => {
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



// Use this endpoint to save task results
agentRouter.post('/:uuid/:taskid', async (req, res) => {
    // print out the UUID
    console.log(req.params.uuid);
    console.log(req.params.taskid);
    console.log(req.body);

    // convert taskid to integer
    let taskid = parseInt(req.params.taskid);
    try {
        // try to retrieve agent from database
        let agent = await database.getAgentByUUID(req.params.uuid);

        // If agent is not found, return error
        if (!agent) {
            return res.status(404).send("Agent not found!");
        }

        // If agent is found, update the agent
        console.log("Updating agent task results");
        let updatedAgent = await database.processAgentTaskResultByUUID(req.params.uuid, taskid, req.body);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Error processing agent request!");
    }
});


// export agent router
module.exports = agentRouter;