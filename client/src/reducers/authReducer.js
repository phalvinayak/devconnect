import {TEST_DISPATCH} from '../actions/types';

const initialStore = {
    isAuthenticated: false,
    user: {}
}

export default function(state = initialStore, action){
    switch(action.type){
        case TEST_DISPATCH:
            return {
                ...state,
                user: action.payload
            }
        default :
            return state;
    }
}