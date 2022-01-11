import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';

const isValidInput = (connection) => {
  return true; // R.last(R.split("__", connection.source)) === "data";
};
const isValidOutput = (connection) => {
  return true; // R.last(R.split("__", connection.target)) === "data";
};

const DataNode = (args) => {
  // args = some RF-related and a data that has args Ewoks-related
  // console.log(args);
  return (
    <Node
      isGraph={false}
      type={args.type}
      label={args.data.label}
      selected={args.selected}
      color={'#ced3ee'}
      image={args.data.icon}
      comment={args.data.comment}
      moreHandles={args.data.moreHandles}
      content={
        <div style={{ ...style.io } as React.CSSProperties}>
          {/* {args.data.type !== 'input' && ( */}
          {/* <Handle
            type="target"
            position={Position.Left}
            id="i__data"
            style={{ ...style.handle, ...style.left }}
            isValidConnection={isValidInput}
          /> */}
          {/* <Handle
            type="target"
            position={Position.Bottom}
            id="i__data"
            style={{ ...style.handle }}
            isValidConnection={isValidInput}
          /> */}
          {/* )} */}
          {/* {'Data'} */}
          {/* {args.data.type !== 'output' && ( */}
          {/* <Handle
            type="source"
            position={Position.Right}
            id="o__data"
            style={{ ...style.handle, ...style.right }}
            isValidConnection={isValidOutput}
          /> */}
          {/* <Handle
            type="source"
            position={Position.Top}
            id="o__data"
            style={{ ...style.handle }}
            isValidConnection={isValidOutput}
          /> */}
          {/* )} */}
        </div>
      }
    />
  );
};

export default memo(DataNode);
