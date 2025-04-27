import { UPDATE_CONTENT, UNDO, REDO } from "./actions";

const initialState = {
  content: "",
  history: [],
  historyIndex: -1,
};

const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CONTENT: {
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), action.payload];
      return {
        ...state,
        content: action.payload,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    case UNDO:
      if (state.historyIndex > 0) {
        return {
          ...state,
          content: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;
    case REDO:
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          content: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;
    default:
      return state;
  }
};

export default editorReducer;