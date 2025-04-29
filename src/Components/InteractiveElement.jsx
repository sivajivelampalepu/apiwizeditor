import React from "react";

const InteractiveElement = ({ id, type, properties, onUpdate, onDragStart, onDrop }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [props, setProps] = React.useState(properties);

  const handleEdit = (e) => {
    setProps({ ...props, text: e.target.value });
    onUpdate(id, { ...props, text: e.target.value });
  };

  return (
    <span
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, id)}
      style={{ display: "inline-block", margin: "0 5px" }}
    >
      {isEditing ? (
        <input
          value={props.text}
          onChange={handleEdit}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "2px 5px",
            cursor: "pointer",
          }}
        >
          {props.text}
        </button>
      )}
    </span>
  );
};


export default InteractiveElement