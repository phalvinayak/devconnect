import {TEST_DISPATCH} from './types';

export default userData => {
    return {
        type: TEST_DISPATCH,
        payload: userData
    };
}