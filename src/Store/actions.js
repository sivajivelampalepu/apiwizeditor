export const UPDATE_CONTENT = "UPDATE_CONTENT";
export const UNDO = "UNDO";
export const REDO = "REDO";

export const updateContent = (content) => ({
  type: UPDATE_CONTENT,
  payload: content,
});

export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });