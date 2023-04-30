const mongoose = require('mongoose');
const { UserModel, AgentModel } = require('./models');
const { handleAgentTaskResponse } = require('./commands');

const debugURL = 'MemoryAgent';
let dbUrl = debugURL;
let databaseEnabled = false; // Don't change this, use the shouldUseDatabase variable instead

let shouldUseDatabase = true; // Set this to false to disable the database

let dbConnect = async () => {
  if (!shouldUseDatabase) return;
  await mongoose.connect(`mongodb://127.0.0.1:27017/${dbUrl}`,).then( )
  databaseEnabled = true;
};

const printTable = (data) => {
  // Get the headers by getting the keys of the first object in the data array
  const headers = Object.keys(data[0]);
  console.log(headers);
  // Find the longest header text to set the width of all columns
  const longestHeader = headers.reduce((acc, header) => {
    return header.length > acc ? header.length : acc;
  }, 0);

  // Find the longest value for each header to set the width of each column
  const columnWidths = headers.map((header) => {
    return data.reduce((acc, obj) => {
      if (typeof obj[header] === 'boolean') return Math.max('false'.length, acc);
      const val = obj[header] ?? null;
      const len = val?.toString()?.length ?? 0;
      return Math.max(len, acc);
    }, longestHeader);
  });

  // Print the header row
  console.log('+' + headers.map((header, i) => '-'.repeat(columnWidths[i] + 2)).join('+') + '+');
  console.log('| ' + headers.map((header, i) => header.padEnd(columnWidths[i])).join(' | ') + ' |');
  console.log('+' + headers.map((header, i) => '-'.repeat(columnWidths[i] + 2)).join('+') + '+');

  // Print the data rows
  data.forEach((obj) => {
    console.log('| ' + headers.map((header, i) => {
      if (typeof obj[header] === 'boolean') return obj[header].toString().padEnd(columnWidths[i]);
      const val = obj[header] ?? null;
      return val ? val.toString().padEnd(columnWidths[i]) : ' '.repeat(columnWidths[i]);
    }).join(' | ') + ' |');
  });

  // Print the footer row
  console.log('+' + headers.map((header, i) => '-'.repeat(columnWidths[i] + 2)).join('+') + '+');
};
  
const database = {

  async createAgent(agent) {
    try {
      const newAgent = new AgentModel(agent);
      const savedAgent = await newAgent.save();
      return savedAgent;
    } catch(err) {
      console.error("Error in createAgent:", err);
      throw err;
    }
  },

  async getAllAgents() {
    try {
      const agents = await AgentModel.find({});

      if (!agents) {
        return null;
      }

      return agents;
    } catch (err) {
      console.error("Error in getAllAgents:", err);
      throw err;
    }
  },

  /**
   * @brief Gets an agent by its UUID
   * 
   * This may need to be updated to have a param to bool "update" last_seen and active
   * in case you want to retrieve them without updating them.
   * 
   * @param {*} uuid 
   * @returns 
   */
  async getAgentByUUID(uuid) {
    try {
      const foundAgent = await AgentModel.findOne({ uuid });
  
      if (!foundAgent) {
        return null;
      }
  
      foundAgent.last_seen = new Date();
      foundAgent.active = true;
      await foundAgent.save();
      return foundAgent;
    } catch (err) {
      console.error("Error in getAgentByUUID:", err);
      throw err;
    }
  },

  /**
   * @brief Gets an agent by its UUID and updates it with the given data
   * @param {*} uuid 
   * @param {*} data 
   * @returns 
   */
  async updateAgentByUUID(uuid, data) {
    try {
      const foundAgent = await AgentModel.findOne({ uuid });
  
      if (!foundAgent) {
        return null;
      }
  
      // Update the agent with the new data
      Object.keys(data).forEach((key) => {
        foundAgent[key] = data[key];
      });

      await foundAgent.save();
      return foundAgent;
    } catch (err) {
      console.error("Error in updateAgentByUUID:", err);
      throw err;
    }
  },

  async processAgentTaskResultByUUID(uuid, taskid, result) {
    try {
      const agent = await AgentModel.findOne({ uuid });
  
      if (!agent) {
        throw new Error('Agent not found');
      }
  
      // Grab the command from the task_queue
      let command = agent.task_queue.find((task) => task.taskid === taskid).command;
      console.log("Command corresponding to result:", command);

      let command_results = agent.command_results;
      if (!command_results) {
        command_results = {
          [command]: result
        };
      } else {
        command_results[command] = result;
      }

      agent.command_results = command_results;
      //console.log("Agent command results:", agent.command_results);
      // Mark the command_results field as modified
      //agent.markModified('command_results');
  
      // Remove the task from the task_queue
      agent.task_queue = agent.task_queue.filter((task) => task.taskid !== taskid);
  
      // Update the last_seen field
      agent.last_seen = new Date();
  
      // Save the updated agent document
      await agent.save();
  
      return agent;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
      
  async removeAgentTaskByUUID(uuid, taskid) {
    try {
      const foundAgent = await AgentModel.findOne({ uuid });

      if (!foundAgent) {
        return null;
      }

      foundAgent.task_queue = foundAgent.task_queue.filter((task) => task.taskid !== taskid);
      await foundAgent.save();
      return foundAgent;
    } catch (err) {
      console.error("Error in removeAgentTaskByUUID:", err);
      throw err;
    }
  },

  /**
   * 
   * @param {*} uuid 
   * @param {*} command Example: "process_list"
   * @param {*} command_args  Example: { "--maxprocesses", "1024" }
   * @returns 
   */
  async taskAgentByUUID(uuid, command, command_args) {
    try {
      const foundAgent = await AgentModel.findOne({ uuid });
  
      if (!foundAgent) {
        return null;
      }

      // Find the first available taskid
      let taskid = 0;
      while (foundAgent.task_queue.find((task) => task.taskid === taskid)) {
        taskid++;
      }

      // Add the task to the agent's task queue
      const task = {
        taskid : taskid,
        command : command,
        arguments : command_args
      };

      foundAgent.task_queue.push(task);
      await foundAgent.save();
      return foundAgent;
    } catch (err) {
      console.error("Error in taskAgentByUUID:", err);
      throw err;
    }
  }
  

};


const isDatabaseEnabled = () => {
  return databaseEnabled;
};

module.exports = {
  database,
  dbConnect,
  isDatabaseEnabled,
};
