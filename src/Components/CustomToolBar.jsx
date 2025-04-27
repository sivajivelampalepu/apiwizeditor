import React, { useState } from "react";
import { Button, ButtonGroup, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import {
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { redo, undo, updateContent } from "../Store/actions";

const CustomToolBar = ({ editorRef, insertWidget, saveAsPDF, saveAsDocument }) => {
  const dispatch = useDispatch();
  const [activeAlign, setActiveAlign] = useState("");

  const wrapText = (prefix, suffix) => {
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText =
      textarea.value.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      textarea.value.substring(end);
    dispatch(updateContent(newText));
  };

  const applyHeading = (level) => {
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
   

    const textBefore = textarea.value.substring(0, start);
    const lastNewline = textBefore.lastIndexOf("\n") + 1;
    const lineStart = lastNewline === 0 ? 0 : lastNewline;
    const lineText = textarea.value.substring(lineStart, end);

    const cleanLine = lineText.replace(/^#+ /, "");
    const prefix = "#".repeat(level) + " ";
    const newLineText = prefix + cleanLine;
    const newText =
      textarea.value.substring(0, lineStart) +
      newLineText +
      textarea.value.substring(end);

    dispatch(updateContent(newText));
  };

  const applyHighlight = (color) => {
    wrapText(`{highlight:${color}}`, "{/highlight}");
  };

  const applyColor = (color) => {
    wrapText(`{color:${color}}`, "{/color}");
  };

  const applyBackgroundColor = (color) => {
    wrapText(`{bgcolor:${color}}`, "{/bgcolor}");
  };

  const applyFont = (font) => {
    wrapText(`{font:${font}}`, "{/font}");
  };

  const applyAlignment = (align) => {
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textBefore = textarea.value.substring(0, start);
    const lastNewline = textBefore.lastIndexOf("\n") + 1;
    const lineStart = lastNewline === 0 ? 0 : lastNewline;
    const lineText = textarea.value.substring(lineStart, end);

    const cleanLine = lineText.replace(/\{align:.*?\}(.*?)\{\/align\}/, "$1");
    const newLineText = `{align:${align}}${cleanLine}{/align}`;
    const newText =
      textarea.value.substring(0, lineStart) +
      newLineText +
      textarea.value.substring(end);

    dispatch(updateContent(newText));
    setActiveAlign(align);
  };

  const insertBullet = () => {
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, start);
    const lastNewline = textBefore.lastIndexOf("\n") + 1;
    const lineStart = lastNewline === 0 ? 0 : lastNewline;
    const lineText = textarea.value.substring(lineStart, start);
    const isBulletLine = lineText.startsWith("- ");

    let newText;
    if (isBulletLine) {
      newText =
        textarea.value.substring(0, lineStart) +
        textarea.value.substring(start);
    } else {
      newText =
        textarea.value.substring(0, start) +
        "- " +
        textarea.value.substring(start);
    }
    dispatch(updateContent(newText));
  };

  const insertIcon = (icon) => {
    wrapText(`{icon:${icon}}`, "");
  };

  return (
    <div className="mb-3 d-flex align-items-center">
      <ButtonGroup variant="contained" className="me-2">
        <Button onClick={() => dispatch(undo())}>Undo</Button>
        <Button onClick={() => dispatch(redo())}>Redo</Button>
      </ButtonGroup>

      <ButtonGroup variant="contained" className="me-2">
        <Button onClick={() => wrapText("**", "**")}>B</Button>
        <Button onClick={() => wrapText("_", "_")}>I</Button>
        <Button onClick={() => wrapText("~~", "~~")}>U</Button>
        <Button onClick={() => wrapText("~", "~")}>S</Button>
      </ButtonGroup>

      <ButtonGroup variant="contained" className="me-2">
        <Button onClick={() => wrapText("^", "^")}>x²</Button>
        <Button onClick={() => wrapText("~", "~")}>x₂</Button>
      </ButtonGroup>

      <ButtonGroup variant="contained" className="me-2">
    
        <Button onClick={() => dispatch(updateContent(editorRef.current.value + "\n1. "))}>
          List
        </Button>
        <Button onClick={insertBullet}>Bullet</Button>
      </ButtonGroup>

      <ButtonGroup variant="contained" className="me-2">
        <Button
          onClick={() => applyAlignment("left")}
          className={activeAlign === "left" ? "active-align" : ""}
        >
          <FormatAlignLeft fontSize="small" />
        </Button>
        <Button
          onClick={() => applyAlignment("center")}
          className={activeAlign === "center" ? "active-align" : ""}
        >
          <FormatAlignCenter fontSize="small" />
        </Button>
        <Button
          onClick={() => applyAlignment("right")}
          className={activeAlign === "right" ? "active-align" : ""}
        >
          <FormatAlignRight fontSize="small" />
        </Button>
        <Button
          onClick={() => applyAlignment("justify")}
          className={activeAlign === "justify" ? "active-align" : ""}
        >
          <FormatAlignJustify fontSize="small" />
        </Button>
      </ButtonGroup>

      <FormControl variant="outlined" size="small" className="me-2">
        <InputLabel>Font</InputLabel>
        <Select
          label="Font"
          onChange={(e) => applyFont(e.target.value)}
          defaultValue=""
        >
          <MenuItem value="">Default</MenuItem>
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Times New Roman">Times New Roman</MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Georgia">Georgia</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" className="me-2">
        <InputLabel>Heading</InputLabel>
        <Select
          label="Heading"
          onChange={(e) => applyHeading(e.target.value)}
          defaultValue=""
        >
          <MenuItem value="">Normal</MenuItem>
          <MenuItem value={1}>H1</MenuItem>
          <MenuItem value={2}>H2</MenuItem>
          <MenuItem value={3}>H3</MenuItem>
          <MenuItem value={4}>H4</MenuItem>
          <MenuItem value={5}>H5</MenuItem>
          <MenuItem value={6}>H6</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" className="me-2">
        <InputLabel>Highlight</InputLabel>
        <Select
          label="Highlight"
          onChange={(e) => applyHighlight(e.target.value)}
          defaultValue=""
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="red">Red</MenuItem>
          <MenuItem value="yellow">Yellow</MenuItem>
          <MenuItem value="green">Green</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" className="me-2">
        <InputLabel>Text Color</InputLabel>
        <Select
          label="Text Color"
          onChange={(e) => applyColor(e.target.value)}
          defaultValue=""
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="red">Red</MenuItem>
          <MenuItem value="blue">Blue</MenuItem>
          <MenuItem value="green">Green</MenuItem>
          <MenuItem value="yellow">yellow</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" className="me-2">
        <InputLabel>Background Color</InputLabel>
        <Select
          label="Background Color"
          onChange={(e) => applyBackgroundColor(e.target.value)}
          defaultValue=""
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="red">Red</MenuItem>
          <MenuItem value="blue">Blue</MenuItem>
          <MenuItem value="green">Green</MenuItem>
          <MenuItem value="yellow">Yellow</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" className="me-2">
        <InputLabel>Insert Icon</InputLabel>
        <Select
          label="Insert Icon"
          onChange={(e) => insertIcon(e.target.value)}
          defaultValue=""
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="star">★ Star</MenuItem>
          <MenuItem value="heart">♥ Heart</MenuItem>
          <MenuItem value="check">✔ Check</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={() => insertWidget(prompt("Enter widget text", "Click me"))}
        className="me-2"
      >
        Insert Widget
      </Button>

      <ButtonGroup variant="contained" className="me-2">
        <Button onClick={saveAsPDF}>Save as PDF</Button>
        <Button onClick={saveAsDocument}>Save as TXT</Button>
      </ButtonGroup>
    </div>
  );
};

export default CustomToolBar;