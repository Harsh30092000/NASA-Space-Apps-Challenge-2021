import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./root-reducer";

const middlewares = [];

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ ?
        compose(
            applyMiddleware(...middlewares),
            window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, name: "Sample" })
        ) :
        applyMiddleware(...middlewares)
);

export default store;