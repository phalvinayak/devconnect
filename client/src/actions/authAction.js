import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import {GET_ERRORS,SET_CURRENT_USER} from './types';

export const registerUser = (userData, history) => async dispatch => {
    try {
        await axios.post('/api/users/register', userData);
        history.push('/login');
    } catch(err) {
        if(err.response.status === 400){
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        }
    }
};

// Login - Get user token
export const loginUser = userData => async dispatch => {
    try {
        const res = await axios.post('/api/users/login', userData);
        // Save the token to the localstorage
        const {token} = res.data;
        // Set token to localstorage
        localStorage.setItem('jwtToken', token);
        // Set the token to Auth header
        setAuthToken(token);
        const user = jwt_decode(token);
        dispatch(setCurrentUser(user));
    } catch(err) {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    }
};


// Set logged in User
export const setCurrentUser = user => {
    return {
        type: SET_CURRENT_USER,
        payload: user
    }
}

// Log User out
export const logoutUser = () => dispatch => {
    // Remove token from localstorage
    localStorage.removeItem('jwtToken');
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticate to false
    dispatch(setCurrentUser({}));
}