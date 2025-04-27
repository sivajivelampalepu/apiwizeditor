import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const HighlightDropdown = ({ execCommand }) => {
  const handleHighlight = (color) => {
    execCommand("hiliteColor", color);
  };

  return (
    <FormControl variant="outlined" size="small">
      <InputLabel>Highlight</InputLabel>
      <Select
        label="Highlight"
        onChange={(e) => handleHighlight(e.target.value)}
        defaultValue=""
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="red">Red</MenuItem>
      </Select>
    </FormControl>
  );
};

export default HighlightDropdown;