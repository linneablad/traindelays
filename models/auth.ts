import config from "../config/config.json";
import storage from "./storage";
import SavedStation from "../interfaces/savedStation.ts"

const auth = {
    loggedIn: async function loggedIn() {
        const token = await storage.readToken();
        const twentyFourHours = 1000 * 60 * 60 * 24;
        const notExpired = (new Date().getTime() - token?.date) < twentyFourHours;

        return token && notExpired;
    },
    login: async function login(email: string, password: string) {
        const data = {
            api_key: config.api_key,
            email: email,
            password: password,
        };
        const response = await fetch(`${config.auth_url}/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
        });
        const result = await response.json();

        if (Object.prototype.hasOwnProperty.call(result, 'errors')) {
            return {
                title: result.errors.title,
                message: result.errors.detail,
                type: "danger",
            };
        }
        await storage.storeToken(result.data.token);

        return {
            title: "Inloggning",
            message: result.data.message,
            type: "success",
        };
    },
    register: async function register(email: string, password: string) {
        const data = {
            api_key: config.api_key,
            email: email,
            password: password,
        };
        const response = await fetch(`${config.auth_url}/register`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
        });

        const result = await response.json();

        if (result?.errors?.detail === "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email, users.apiKey") {
            return {
                title: "Fel",
                message: "Användaren finns redan",
                type: "danger",
            };
        }

        return {
            title: "Registrering",
            message: result.data.message,
            type: "success",
        };
    },
    logout: async function logout() {
        await storage.deleteToken();
    },
    getUserData: async function getUserData() : Array<SavedStation> {
        const token = await storage.readToken();
        const response = await fetch(`${config.auth_url}/data?api_key=${config.api_key}`, {
            headers: {
                'x-access-token': token.token
            },
        });
        const result = await response.json();
        return result.data;
    },
    saveUserData: async function saveUserData(station:string) : Object {
        var data = {
            artefact: `${station}`,
            api_key: config.api_key
        };
        const token = await storage.readToken();
        const response = await fetch(`${config.auth_url}/data`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token.token
            },
        });

        const result = await response.json();

        if (Object.prototype.hasOwnProperty.call(result, 'errors')) {
            return {
                title: result.errors.title,
                message: result.errors.detail,
                type: "danger",
            };
        }

        return {
            title: "Stationen sparades",
            message: result.data.message,
            type: "success",
        };
    },
    deleteUserData: async function deleteUserData(id:number) : Object {
        var data = {
            id: id,
            api_key: config.api_key
        };
        const token = await storage.readToken();
        await fetch(`${config.auth_url}/data`, {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token.token
            },
        });

        return {
            title: "Stationen raderades",
            type: "success",
        };
    }
};

export default auth;
