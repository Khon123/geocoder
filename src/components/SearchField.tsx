import React from "react";
import { TextField, InputAdornment, IconButton, Avatar } from "@mui/material";
import { debounce } from "lodash";
import { getCloseSvgUrl } from "../images";
import { styled } from "@mui/material/styles";

export const SearchField = React.memo(
  ({ input, placeholder, onChange, onActive, onClose, ...resp }: any) => {
    return (
      <TextField
        id="id-search-field"
        placeholder="Search for a location..."
        value={input.value || ""}
        autoComplete="off"
        size="small"
        variant="standard"
        {...resp}
        {...input}
        onChange={(e) => {
          input.onChange(e);
          if (onChange) {
            onChange(e);
          }
        }}
        onFocus={() => {
          if (onActive) {
            onActive(true);
          }
        }}
        onBlur={debounce(() => {
          if (onActive) {
            onActive(false);
          }
        }, 150)}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <>
              {input.value && (
                <InputAdornment position="end">
                  <IconButton sx={{ p: 0 }} size="small" onClick={onClose}>
                    <StyledAvatar src={getCloseSvgUrl}></StyledAvatar>
                  </IconButton>
                </InputAdornment>
              )}
            </>
          ),
        }}
      />
    );
  }
);

const StyledAvatar = styled(Avatar)`
  && {
    padding: 2px;
    width: 29px;
    height: 29px;
    cursor: pointer;
    .MuiAvatar-img {
      object-fit: none;
    }
  }
`;
