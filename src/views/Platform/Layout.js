import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";
import React from "react";

const FieldLayout = function ({caption, size, children}) {
  return (
    <FormRow>
      <FormPropertyColumn md={4}>
        <BoldLabel>{caption}</BoldLabel>
      </FormPropertyColumn>
      <FormValueColumn md={size || 5}>{children}</FormValueColumn>
    </FormRow>
  );
};

export {FieldLayout}
