import axios from 'axios';

/**
 * IMPORTANT: This base URL points to the proxy defined in next.config.ts
 * This bypasses CORS by routing requests through your local dev server.
 */
// const AUTH_API = 'https://projectsapi.lpu.in/';
const AUTH_API = 'https://localhost:7125/';

class AuthService {
    private apiClient;

    constructor() {
        this.apiClient = axios.create({
            baseURL: AUTH_API,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            // This ensures cookies are handled correctly if the API uses them
            withCredentials: false 
        });
    }

    /**
     * Primary Login for Internal Users
     * Maps to: security/createtoken
     */
    async loginInternalUser(userId: string, key: string) {
        try {
            const response = await this.apiClient.post('security/createtoken', {
                userName: userId,
                password: key
            });
            return response.data;
        } catch (error: any) {
            this.handleError("loginInternalUser", error);
            throw error;
        }
    }

    /**
     * Common Token Creation
     * Maps to: security/createcommonToken
     */
    async loginTemp(username: string, menuName: string = '') {
        try {
            const response = await this.apiClient.post('security/createcommonToken', {
                UserName: username,
                MenuName: menuName
            });
            return response.data;
        } catch (error: any) {
            this.handleError("loginTemp", error);
            throw error;
        }
    }

    /**
     * Journal Access Portal Token
     * Maps to: security/createCifPortalToken
     */
    async LoginJournalAccessTemp(username: string) {
        try {
            const response = await this.apiClient.post('security/createCifPortalToken', {
                username: username
            });
            return response.data;
        } catch (error: any) {
            this.handleError("LoginJournalAccessTemp", error);
            throw error;
        }
    }

    /**
     * UMS Common Token
     * Maps to: security/createumscommonToken
     */
    async loginUMSTemp(username: string) {
        try {
            const response = await this.apiClient.post('security/createumscommonToken', {
                username: username
            });
            return response.data;
        } catch (error: any) {
            this.handleError("loginUMSTemp", error);
            throw error;
        }
    }

    /**
     * Centralized error logging
     */
    private handleError(methodName: string, error: any) {
        if (error.response) {
            // The server responded with a status code outside the 2xx range
            console.error(`AuthService [${methodName}] Server Error:`, error.response.status, error.response.data);
        } else if (error.request) {
            // The request was made but no response was received (CORS or Network issue)
            console.error(`AuthService [${methodName}] Network Error: No response received. Check if your Next.js proxy is running.`);
        } else {
            console.error(`AuthService [${methodName}] Setup Error:`, error.message);
        }
    }
}

// Export as a singleton instance
export const authService = new AuthService();