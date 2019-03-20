import isEmpty from '../utils/isEmpty';
import {SET_CURRENT_USER} from '../actions/types';

const initialStore = {
    isAuthenticated: false,
    user: {}
}

export default function(state = initialStore, action){
    switch(action.type){
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            }
        default :
            return state;
    }
}