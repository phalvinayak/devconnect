import {GET_ERRORS} from './types';
import axios from 'axios';

export default (userData, history) => async dispatch => {
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
    // dispatch({
    //     type: REGISTER_USER,
    //     payload: userData
    // });
}