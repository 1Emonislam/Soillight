import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import { categoriesReducer } from './reducers/AllCetegoryReducer';
import { userLoginReducer, userRegisterReducer } from './reducers/UserReducers';

const reducer = combineReducers({
    //this will contain our reducers
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    category: categoriesReducer,
})
const userFromStorage = window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : null;
const inisialState = {
    userLogin: { user: userFromStorage }
};

const middlware = [thunk];

const store = createStore(
    reducer,
    inisialState,
    composeWithDevTools(applyMiddleware(...middlware))
);
export default store;