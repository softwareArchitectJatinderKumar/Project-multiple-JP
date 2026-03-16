const USER_KEY = 'auth-user';

export const storageService = {
    /**
     * Clears all session storage
     */
    clean: (): void => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.clear();
            window.localStorage.removeItem(USER_KEY);
        }
    },

    /**
     * Saves user data to session storage
     */
    saveUser: (user: any): void => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
            // Optional: If you use localStorage for "Remember Me"
            window.localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },

    /**
     * Retrieves user data
     */
    getUser: (): any => {
        if (typeof window !== 'undefined') {
            const user = window.sessionStorage.getItem(USER_KEY);
            if (user) {
                try {
                    return JSON.parse(user);
                } catch (e) {
                    console.error("Error parsing user data", e);
                    return {};
                }
            }
        }
        return {};
    },

    /**
     * Checks if a user is logged in
     */
    isLoggedIn: (): boolean => {
        if (typeof window !== 'undefined') {
            const loginId = window.localStorage.getItem(USER_KEY);
            const sessionUser = window.sessionStorage.getItem(USER_KEY);
            
            return !!(loginId || sessionUser);
        }
        return false;
    }
};