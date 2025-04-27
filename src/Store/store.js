import { createStore } from "redux";
import editorReducer from "./reducers";

const store = createStore(editorReducer);
export default store;