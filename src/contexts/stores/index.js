import {combineReducers, legacy_createStore} from "redux";
import {userReducer} from "../reducers/user";


const rootReducer = combineReducers({
    user: userReducer,
});

const configureStore = () => {
    return legacy_createStore(rootReducer);
}

export default configureStore;
