import React from "react";

 const StyleDropdown = ({ editorRef, onStyleApply, onContentUpdate }) => {
  const [visible, setVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = React.useState("");

  React.useEffect(() => {
    const handleSelectionChange = () => {
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value.substring(start, end);

      if (text) {
        setSelectedText(text);
        setVisible(true);

        // Calculate position for dropdown (approximate, adjust as needed)
        const rect = textarea.getBoundingClientRect();
        setPosition({
          top: rect.top - 40, // Position above the textarea
          left: rect.left + (start * 8), // Approximate position based on character width
        });
      } else {
        setVisible(false);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [editorRef]);

  const handleStyleApply = (style, value) => {
    if (style === "content") {
      onContentUpdate(value); // Replace selected text with new content
    } else {
      onStyleApply(style, value); // Apply style (e.g., bold, size)
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "5px",
        zIndex: 1000,
      }}
    >
      <select
        onChange={(e) => {
          const [style, value] = e.target.value.split(":");
          handleStyleApply(style, value);
        }}
      >
        <option value="">Select Style</option>
        <option value="bold:">Bold</option>
        <option value="italic:">Italic</option>
        <option value="size:16">Size 16</option>
        <option value="size:18">Size 18</option>
        <option value="content:Updated Text">Replace with "Updated Text"</option>
      </select>
    </div>
  );
};


export default StyleDropdown;