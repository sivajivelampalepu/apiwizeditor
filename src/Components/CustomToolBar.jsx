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
  
    if (!selectedText) {
      const placeholder = "Text";
      const newText =
        textarea.value.substring(0, start) +
        prefix +
        placeholder +
        suffix +
        textarea.value.substring(end);
      dispatch(updateContent(newText));
      const newStart = start + prefix.length;
      textarea.selectionStart = newStart;
      textarea.selectionEnd = newStart + placeholder.length;
      textarea.focus();
      return;
    }

    let expandedStart = start;
    let expandedEnd = end;
    const fullText = textarea.value;
  
    while (expandedStart > 0 && fullText[expandedStart - 1] !== "{") {
      expandedStart--;
      if (fullText.substring(expandedStart).match(/^\{[^{}]+?\}/)) {
        break;
      }
    }
  

    while (expandedEnd < fullText.length && fullText[expandedEnd] !== "}") {
      expandedEnd++;
      if (fullText.substring(expandedStart, expandedEnd + 1).match(/\{[^{}]+?\}[^{]*?\{\/[^{}]+?\}/)) {
        break;
      }
    }

    const textWithTags = fullText.substring(expandedStart, expandedEnd + 1);
    const selectedTextWithoutTags = selectedText;
    if (prefix.startsWith("{size:") && textWithTags.match(/\{size:\d+\}/)) {
      const newText =
        fullText.substring(0, expandedStart) +
        prefix +
        selectedTextWithoutTags +
        suffix +
        fullText.substring(expandedEnd + 1);
  
      dispatch(updateContent(newText));
      const newStart = expandedStart + prefix.length + selectedTextWithoutTags.length;
      textarea.selectionStart = newStart;
      textarea.selectionEnd = newStart;
      textarea.focus();
      return;
    }
  
    const tagMatch = textWithTags.match(/(\{[^{}]+?\})(.*?)\{\/[^{}]+?\}/);
    if (tagMatch) {
      const outerPrefix = tagMatch[1]; 
      const innerContent = tagMatch[2]; 
      const outerSuffix = textWithTags.match(/\{\/[^{}]+?\}$/)[0]; 
  
    
      const newInnerContent = prefix + innerContent + suffix;
      const newText =
        fullText.substring(0, expandedStart) +
        outerPrefix +
        newInnerContent +
        outerSuffix +
        fullText.substring(expandedEnd + 1);
  
      dispatch(updateContent(newText));
      const newStart = expandedStart + outerPrefix.length + prefix.length + selectedTextWithoutTags.length;
      textarea.selectionStart = newStart;
      textarea.selectionEnd = newStart;
      textarea.focus();
    } else {
   
      const newText =
        fullText.substring(0, start) +
        prefix +
        selectedTextWithoutTags +
        suffix +
        fullText.substring(end);
  
      dispatch(updateContent(newText));
      const newStart = start + prefix.length + selectedTextWithoutTags.length;
      textarea.selectionStart = newStart;
      textarea.selectionEnd = newStart;
      textarea.focus();
    }
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

    const headingMatch = lineText.match(/^#+ /);
    const headingPrefix = headingMatch ? headingMatch[0] : "";
    const cleanLine = headingPrefix ? lineText.replace(/^#+ /, "") : lineText;

    const cleanLineWithoutAlign = cleanLine.replace(/\{align:.*?\}(.*?)\{\/align\}/, "$1");
    const newLineText = headingPrefix + `{align:${align}}${cleanLineWithoutAlign}{/align}`;
    const newText =
      textarea.value.substring(0, lineStart) +
      newLineText +
      textarea.value.substring(end);

    dispatch(updateContent(newText));
    setActiveAlign(align);

    const lineEnd = lineStart + newLineText.length;
    if (align === "center") {
      const textLength = cleanLineWithoutAlign.length;
      const centerPosition = lineStart + headingPrefix.length + `{align:${align}}`.length + Math.floor(textLength / 2);
      textarea.selectionStart = centerPosition;
      textarea.selectionEnd = centerPosition;
    } else if (align === "justify" || align === "right") {
      textarea.selectionStart = lineEnd;
      textarea.selectionEnd = lineEnd;
    } else if (align === "left") {
      const startPosition = lineStart + headingPrefix.length + `{align:${align}}`.length;
      textarea.selectionStart = startPosition;
      textarea.selectionEnd = startPosition;
    }
    textarea.focus();
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
    <MenuItem value="star">⭐ Star</MenuItem>
    <MenuItem value="check">✔️ Check</MenuItem>
    <MenuItem value="heart">❤️ Heart</MenuItem>
  
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