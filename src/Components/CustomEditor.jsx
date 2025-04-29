import React, { useRef } from 'react';
import {
  Box, Button, IconButton, MenuItem, Select, Tooltip, TextField
} from '@mui/material';
import {
  FormatBold, FormatItalic, FormatUnderlined, FormatColorFill, FormatColorText,
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
  FormatListBulleted, FormatListNumbered, Undo, Redo,
  TableChart, InsertEmoticon, Link
} from '@mui/icons-material';

const fonts = ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'];
const sizes = [12, 14, 16, 18, 20, 22, 24,36,48,72];
const emojis = ['😀', '😂', '😍', '👍', '🔥', '🎉'];

export default function CustomEditor() {
  const editorRef = useRef(null);

  const format = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
  };

  const insertTable = () => {
    const rows = parseInt(prompt("Number of rows", 2));
    const cols = parseInt(prompt("Number of columns", 2));
    if (!rows || !cols) return;

    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.margin = '10px 0';

    for (let i = 0; i < rows; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');
        td.style.border = '1px solid black';
        td.style.padding = '5px';
        td.innerHTML = '&nbsp;';
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(table);
  };

  const insertEmoji = (emoji) => {
    format('insertText', emoji);
  };

  const insertLink = () => {
    const url = prompt("Enter the link:");
    if (url) format('createLink', url);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
        <Tooltip title="Bold"><IconButton onClick={() => format('bold')}><FormatBold /></IconButton></Tooltip>
        <Tooltip title="Italic"><IconButton onClick={() => format('italic')}><FormatItalic /></IconButton></Tooltip>
        <Tooltip title="Underline"><IconButton onClick={() => format('underline')}><FormatUnderlined /></IconButton></Tooltip>
        <Tooltip title="Text Color"><IconButton><input type="color" onChange={(e) => format('foreColor', e.target.value)} style={{ opacity: 0, position: 'absolute', width: '24px', height: '24px' }} /><FormatColorText /></IconButton></Tooltip>
        <Tooltip title="Background Color"><IconButton><input type="color" onChange={(e) => format('hiliteColor', e.target.value)} style={{ opacity: 0, position: 'absolute', width: '24px', height: '24px' }} /><FormatColorFill /></IconButton></Tooltip>

        <Tooltip title="Left Align"><IconButton onClick={() => format('justifyLeft')}><FormatAlignLeft /></IconButton></Tooltip>
        <Tooltip title="Center Align"><IconButton onClick={() => format('justifyCenter')}><FormatAlignCenter /></IconButton></Tooltip>
        <Tooltip title="Right Align"><IconButton onClick={() => format('justifyRight')}><FormatAlignRight /></IconButton></Tooltip>

        <Tooltip title="Bullet List"><IconButton onClick={() => format('insertUnorderedList')}><FormatListBulleted /></IconButton></Tooltip>
        <Tooltip title="Numbered List"><IconButton onClick={() => format('insertOrderedList')}><FormatListNumbered /></IconButton></Tooltip>

        <Tooltip title="Undo"><IconButton onClick={() => format('undo')}><Undo /></IconButton></Tooltip>
        <Tooltip title="Redo"><IconButton onClick={() => format('redo')}><Redo /></IconButton></Tooltip>

        <Tooltip title="Insert Table"><IconButton onClick={insertTable}><TableChart /></IconButton></Tooltip>
        <Tooltip title="Insert Link"><IconButton onClick={insertLink}><Link /></IconButton></Tooltip>

       
        {emojis.map((e, i) => (
          <Tooltip title={`Emoji ${e}`} key={i}>
            <IconButton onClick={() => insertEmoji(e)}>
              <InsertEmoticon />
              <span style={{ position: 'absolute', fontSize: 12 }}>{e}</span>
            </IconButton>
          </Tooltip>
        ))}

      
        <Select defaultValue="" displayEmpty onChange={(e) => format('fontName', e.target.value)} size="small">
          <MenuItem value="">Font</MenuItem>
          {fonts.map(font => <MenuItem key={font} value={font}>{font}</MenuItem>)}
        </Select>
        <Select defaultValue="" displayEmpty onChange={(e) => format('fontSize', e.target.value)} size="small">
          <MenuItem value="">Size</MenuItem>
          {sizes.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
        </Select>
      </Box>

      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        sx={{
          border: '1px solid #ccc',
          minHeight: '300px',
          padding: 2,
          borderRadius: 2,
          backgroundColor: 'white',
          overflowY: 'auto',
        }}
      ></Box>
    </Box>
  );
}
