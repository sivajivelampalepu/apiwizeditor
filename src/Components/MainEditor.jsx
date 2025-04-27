import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateContent } from "../Store/actions";
import CustomToolBar from "./CustomToolBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { convertHtmlToInternalFormat, formatText } from "./ExtraCode";

const MainEditor = () => {
    const editorRef = useRef(null);
    const displayRef = useRef(null);
    const dispatch = useDispatch();
    const content = useSelector((state) => state.content);
    const [widgets, setWidgets] = useState([]);
  
    useEffect(() => {
      if (displayRef.current) {
        displayRef.current.innerHTML = formatText(content, widgets);
      }
      if (editorRef.current) {
        editorRef.current.value = content;
      }
    }, [content, widgets]);
  
   
  
    const handleInput = (e) => {
      const newText = e.target.value;
      dispatch(updateContent(newText));
    };
  
    const handleKeyDown = (e) => {
      if (e.metaKey && e.shiftKey && e.key === "8") {
        e.preventDefault();
        dispatch(updateContent(content + "\n> "));
      }
      if (e.metaKey && e.key === "7") {
        e.preventDefault();
        dispatch(updateContent(content + "\n1. "));
      }
    };
  
    const handlePaste = (e) => {
      e.preventDefault();
      const clipboardData = e.clipboardData;
      const html = clipboardData.getData("text/html");
      const plainText = clipboardData.getData("text/plain");
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
  
      let pastedContent = "";
      if (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        pastedContent = convertHtmlToInternalFormat(doc.body);
      } else if (plainText) {
        pastedContent = convertPlainTextToInternalFormat(plainText);
      }
  
      const textBefore = content.substring(0, start);
      const lastNewline = textBefore.lastIndexOf("\n") + 1;
      const lineStart = lastNewline === 0 ? 0 : lastNewline;
      const lineText = content.substring(lineStart, end);
      const isInWidget = widgets.some((widget, index) => {
        const widgetMatch = `{widget:${widget.content}}`;
        return content.indexOf(widgetMatch, lineStart) !== -1;
      });
      const isInAlignedBlock = lineText.match(/\{align:.*?\}(.*?)\{\/align\}/);
  
      let newContent = content;
      if (isInWidget) {
        console.log("Pasting into widget is disabled.");
      } else if (isInAlignedBlock) {
        const alignType = isInAlignedBlock[1];
        newContent =
          content.substring(0, lineStart) +
          `{align:${alignType}}${pastedContent}{/align}` +
          content.substring(end);
      } else {
        newContent =
          content.substring(0, start) +
          pastedContent +
          content.substring(end);
      }
  
      dispatch(updateContent(newContent));
    };
  
   
    const convertPlainTextToInternalFormat = (text) => {
      return text;
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      const widgetIndex = e.dataTransfer.getData("text/plain");
      const rect = displayRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newWidgets = [...widgets];
      newWidgets[widgetIndex].x = x;
      setWidgets(newWidgets);
    };
  
    const insertWidget = (content) => {
      const newWidgets = [...widgets, { content, x: 0 }];
      setWidgets(newWidgets);
      dispatch(updateContent(content + "{widget:" + content + "}"));
    };
  
    const saveAsPDF = async () => {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
  
      const canvas = await html2canvas(displayRef.current, {
        scale: 2, 
        useCORS: true
      });
  
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; 
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      doc.save('document.pdf');
    };
  
    const saveAsDocument = () => {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.txt";
      a.click();
      URL.revokeObjectURL(url);
    };
  
    const handleScroll = () => {
      if (editorRef.current && displayRef.current) {
        displayRef.current.scrollTop = editorRef.current.scrollTop;
      }
    };
  return (
    <div className="container mt-4">
    
      <CustomToolBar
        editorRef={editorRef}
        insertWidget={insertWidget}
        saveAsPDF={saveAsPDF}
        saveAsDocument={saveAsDocument}
      />
    <div className="editor-wrapper">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onScroll={handleScroll}
          className="editor-input"
          style={{ minHeight: "400px", textAlign: "left", direction: "ltr" }}
          dir="ltr"
          lang="en"
          aria-label="Text editor input"
        />
        <div
          ref={displayRef}
          className="editor-display border p-3"
          style={{ minHeight: "400px", textAlign: "left", direction: "ltr" }}
          dir="ltr"
          lang="en"
          aria-label="Formatted text display"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      </div>
      </div>
  );
};

export default MainEditor;