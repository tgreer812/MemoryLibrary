const express = require('express');
const passport = require('../middleware/passport');
const agentRouter = express.Router();
const { database } = require('../utility/db');

agentRouter.use('/', (req, res, next) => {
    console.log(req.session);
    next();
});

//let test_task = {"taskqueue":[{"taskid":"1","command":"scan","arguments":["--pid","1234","--type","integer","--value","1","--start","0","--stop","100","--maxfound","100000"]},{"taskid":"2","command":"process_list","arguments":["--maxprocesses","0"]}]};
let test_task = {"taskqueue":[{"taskid":"2","command":"process_list","arguments":["--maxprocesses","1024"]}]};

agentRouter.get('/:uuid', async (req, res) => {
    // print out the UUID
    console.log(req.params.uuid);

    try {
        // try to retrieve agent from database
        let agent = await database.getAgentByUUID(req.params.uuid);

        // if agent is found, return the agent and tasks
        if (agent) {
            console.log(agent);
            return res.status(200).send(test_task);
        } else {
            // if agent is not found, create it
            const newAgentObj = {
                uuid: req.params.uuid,
                name: "",
                tasks: "",
                lastSeen: new Date(),
                active: true,
                ip: req.socket.remoteAddress
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

agentRouter.post('/:uuid/:taskid', async (req, res) => {
    // print out the UUID
    console.log(req.params.uuid);
    console.log(req.params.taskid);
    console.log(req.body);

    try {
        // try to retrieve agent from database
        let agent = await database.getAgentByUUID(req.params.uuid);

        // If agent is not found, return error
        if (!agent) {
            return res.status(404).send("Agent not found!");
        }

        // If agent is found, update the agent
        let updatedAgent = await database.updateAgentByUUID(req.params.uuid, req.body);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Error processing agent request!");
    }
});


// export agent router
module.exports = agentRouter;