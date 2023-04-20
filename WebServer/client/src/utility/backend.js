
/**
 * 
 */

import { routing } from '../shared/routing';
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

}

export default Backend;