
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

    async taskAgentByUUID(uuid, command, command_args) {
        console.log("taskAgent called");

        let task = {
            command: command,
            arguments: command_args
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
    }

}

export default Backend;