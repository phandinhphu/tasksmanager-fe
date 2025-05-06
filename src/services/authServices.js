import * as userServices from './userServices';
import * as httpRequest from '../utils/httpRequest';

const authKey = 'AUTH_KEY';

export const saveUser = (user) => {
    localStorage.setItem(authKey, JSON.stringify(user));
}

export const login = async (email, password) => {
    try {
        const response = await httpRequest.post('/auth/login', { email, password });
        if (response.status === 200) {
            const user = response.data;
            saveUser(user);
            return user;
        } else {
            throw new Error('Login failed: ' + response.data.message);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Error logging in: ' + error.message);
    }
}

export const register = async (user) => {
    try {
        const newUser = await userServices.createUser(user);
        saveUser(newUser.data);
        return newUser.data;
    } catch (error) {
        console.error('Error registering:', error);
        throw new Error('Error registering: ' + error.message);
    }
}

export const logout = () => {
    localStorage.removeItem(authKey);
    console.log('User logged out successfully');
}

export const getCurrentUser = () => {
    const user = localStorage.getItem(authKey);
    return user ? JSON.parse(user) : null;
}