
/**
 * 
 */

import { routing } from 'shared/routing';
let clienturl = routing.clienturl;
let serverurl = routing.serverurl;

let Backend = {

    async registerUser(data) {
        let path = "/api/register";
        try {
            const response = await fetch(clienturl + path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log('Success', result);
        } catch (error) {
            console.error('Error:', error);
        }
    },

    async loginUser(data) {
        let path = "/api/login";
        try {
            const response = await fetch(clienturl + path, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                //console.log('Success', result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    },
    
    async logoutUser() {
        let path = "/api/logout";
        try {
            const response = await fetch(clienturl + path, {
                method: 'DELETE',
            });
            if (response.status === 204) {
                console.log("Successful logout!");
                return 0;
            }
        } catch (error) {
            console.error('Logout error', error);
        }
    },

    async validateSession() {
        let path = "/api/validateSession";
        try {
            const response = await fetch(clienturl + path, {
                method: 'GET',
            });
            const result = await response.json();
            console.log('Success', result);
            return result;
        } catch (error) {
            console.error('Error:', error);
        }
    },

    async getAgentByUUID(uuid) {
        console.log("getAgentByUUID called");
        let path = "/api/admin/agent/" + uuid;
        try {
            const response = await fetch(clienturl + path, {
                method: 'GET',
            });
            const result = await response.json();
            console.log('Success', result);
            return result;
        } catch (error) {
            console.error('Error:', error);
        }
    },

    async getAgentTaskId(uuid) {
        console.log("getAgentTaskId called");
        let path = "/api/admin/agent/" + uuid + "/taskqueue";
        try {
            const response = await fetch(clienturl + path, {
                method: 'GET',
            });
            const result = await response.json();
            console.log('Success', result);

            // search through the tasks for the one with the highest id
            let maxid = 0;
            for (let i = 0; i < result.tasks.length; i++) {
                if (result.tasks[i].id > maxid) {
                    maxid = result.tasks[i].id;
                }
            }

            return maxid;
        } catch (error) {
            console.error('Error:', error);
        }
    },

    /**
     * Sends a task to the agent with the specified UUID.
     *
     * @param {string} uuid - The UUID of the agent.
     * @param {string} command - The command to be executed by the agent.
     * @param {(Array|string[]|Object)} command_args - The command arguments, either as an array of strings or as a JSON object.
     *                                                 If provided as a JSON object, keys and values are converted to command line arguments.
     * @return {Promise<void>} - A promise that resolves when the task has been sent successfully or rejects with an error.
     */
    async taskAgentByUUID(uuid, command, command_args) {
        console.log("taskAgent called");
    
        let args = [];
    
        if (Array.isArray(command_args)) {
            args = command_args;
        } else if (typeof command_args === 'object') {
            for (const [key, value] of Object.entries(command_args)) {
                args.push(`--${key}`, value.toString());
            }
        } else {
            console.error('Invalid command_args format');
            return;
        }
    
        let task = {
            command: command,
            arguments: args
        };
        let path = "/api/admin/agent/" + uuid + "/taskqueue";
        try {
            const response = await fetch(clienturl + path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });
            const result = await response.json();
            console.log('Success', result);
        } catch (error) {
            console.error('Error:', error);
        }
    },    

    async getAgentList() {
        console.log("getAgentList called");
        let path = "/api/admin/agents/";
        try {
            console.log("fetching agent list from server: " + serverurl + path);
            const response = await fetch(clienturl + path, {
                method: 'GET',
            });
            const result = await response.json();
            console.log('Success', result);
            return result;
        } catch (error) {
            console.error('Error:', error);
        }
    },

    async updateAgentName(uuid, name) {
        console.log("updateAgentName called");
        let path = "/api/admin/agent/" + uuid;
        try {
            const response = await fetch(clienturl + path, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: name})
            });
            const result = await response.json();
            console.log('Success', result);
        } catch (error) {
            console.error('Error:', error);
        }
    },

    async newScan(uuid, value) {

    },
    async nextScan(uuid, value) {},

}

export default Backend;