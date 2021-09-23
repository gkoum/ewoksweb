import React, { memo } from 'react';
// import * as R from "ramda";
import { Handle, Position } from 'react-flow-renderer';
import Node, { contentStyle as style } from './Node';

const isValidInput = (connection) => {
  return true; // R.last(R.split("__", connection.source)) === "data";
};
const isValidOutput = (connection) => {
  return true; // R.last(R.split("__", connection.target)) === "data";
};

const DataNode = ({ data, selected }) => {
  return (
    <Node
      type={data.type}
      label={data.label}
      selected={selected}
      color={'#ced3ee'}
      image={data.icon}
      comment={data.comment}
      content={
        <div style={{ ...style.io } as React.CSSProperties}>
          {!data.uploaded && (
            <Handle
              type="target"
              position={Position.Left}
              id="i__data"
              style={{ ...style.handle, ...style.left }}
              isValidConnection={isValidInput}
            />
          )}
          {'Data'}
          <Handle
            type="source"
            position={Position.Right}
            id="o__data"
            style={{ ...style.handle, ...style.right }}
            isValidConnection={isValidOutput}
          />
        </div>
      }
    />
  );
};

export default memo(DataNode);
