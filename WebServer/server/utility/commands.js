/**
 * 
 * @brief An extension to db.js that contains functions for handling agent task responses
 */

/**
 * @brief Handles the response from an agent task
 * @param taskResponse The response from the agent task
 * @param agent The agent that sent the response
 * @returns {Promise<void>}
 */
let handleAgentTaskResponse = async (taskResponse, agent) => {

    // If the agent task response is null, return
    if (!taskResponse) {
        return;
    }

    // Parse the task response
    let parsedTaskResponse = JSON.parse(taskResponse);
    
};


module.exports = {
    handleAgentTaskResponse
};