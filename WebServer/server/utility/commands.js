/**
 * 
 * @brief An extension to db.js that contains functions for handling agent task responses
 */

/**
 * @brief Handles the response from an agent task
 * @param taskResponse The response from the agent task
 * @param agent The agent that sent the response
 * @returns True if the task was handled successfully, false otherwise
 */
let handleAgentTaskResponse = async (taskID, taskResponse, agent) => {
    // convert taskID to an int
    taskID = parseInt(taskID);
    console.log("taskID:", taskID, " type:", typeof taskID);

    console.log("Handling agent task response:", taskResponse);

    if (agent === null) {
        console.log("Agent is null in handleAgentTaskResponse!");
        return false;
    }

    console.log("Agent:", agent);
    // If the agent task response is null, return
    if (!taskResponse) {
        console.log("Agent task response is null in handleAgentTaskResponse!");
        return;
    }

    console.log("agent task queue:", agent.task_queue);
    // Use task ID to get taskQueue from agent
    let taskQueue = agent.task_queue;

    console.log("Task queue:", taskQueue);
    // Get the task from the taskQueue
    let task = taskQueue.find(task => task.taskid === taskID);

    // If the task is not found, return
    if (!task) {
        console.log("Task not found in handleAgentTaskResponse!");
        return;
    }

    console.log("Task:", task);
    // Get the task type
    let taskType = task.command;

    console.log("Task type:", taskType);
    // Call the appropriate handler for the task type
    let handled = await handleProcMapping[taskType](taskResponse, agent);
    if (handled) {
        // If the handler returns true, remove the task from the taskQueue
        taskQueue = taskQueue.filter(task => task.taskid !== taskID);

        console.log("Removing the ")

        // Update the agent's taskQueue
        agent.task_queue = taskQueue;

        // Save the agent
        await agent.save();

        return true;
    }

    return false;
};


/************* Command Handlers *************
    * All command handlers must follow this format
    * They should return a boolean indicating if handling was successful
    * They are responsible for updating the relevant fields in the agent object
    * They do not need to remove the task from the taskQueue as this is handled by handleAgentTaskResponse
    * They do not need to save the agent as this is handled by handleAgentTaskResponse
    * They should return true if the task was handled successfully, false otherwise

    let handleCommand = async (taskResponse, agent) => {
        ... handle command ...
    };

    * tasResponse is a JSON string in the following format:
    let taskResponseExample = {
        "taskid": "1",
        "command": "scan",
        "<command name>": {
            // command specific fields
    }
};

*/


let handleScanTaskResponse = async (taskResponse, agent) => {
};


/**
 * @brief Handles the response from a process_list task
 * @param {*} taskResponse 
 * @param {*} agent 
 * 
 * @returns True if the task was handled successfully, false otherwise
 * 
 * @note Command specific fields:
 * 
 *      {
 *          processes: [
 *              {
 *                  pid: 1234,
 *                  name: "notepad.exe",
 *              },
 *          ]
 *      };
 * 
 */
let handleProcessListTaskResponse = async (taskResponse, agent) => {
    try {
        // Get the process list json
        let processList = taskResponse.process_list;

        // Ensure command_results is defined
        if (!agent.command_results) {
            agent.command_results = {};
        }

        // Update command results
        agent.command_results["process_list"] = processList;

    } catch (err) {
        console.log(err);
        return false;
    }

    return true;
};



let handleProcMapping = {
    "scan": handleScanTaskResponse,
    "process_list": handleProcessListTaskResponse
}

module.exports = {
    handleAgentTaskResponse
};