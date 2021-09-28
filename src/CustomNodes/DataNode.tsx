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

const DataNode = (args) => {
  // args = some RF-related and a data that has args Ewoks-related
  // data:
  //  comment: "Prepare troubleshouting"
  //  icon: "orange1"
  //  label: "barmboutsalaMethod"
  //  type: "input"
  // id: "node1"
  // isConnectable: true
  // isDragging: false
  // selected: false
  // sourcePosition: "right"
  // targetPosition: "left"
  // type: "method"
  // xPos: 50
  // yPos: 80
  // { data, selected }
  console.log(args);
  return (
    <Node
      type={args.data.type}
      label={args.data.label}
      selected={args.selected}
      color={'#ced3ee'}
      image={args.data.icon}
      comment={args.data.comment}
      content={
        <div style={{ ...style.io } as React.CSSProperties}>
          {args.data.type !== 'input' && (
            // if node is graph-input-node remove input link handle
            <Handle
              type="target"
              position={Position.Left}
              id="i__data"
              style={{ ...style.handle, ...style.left }}
              isValidConnection={isValidInput}
            />
          )}
          {'Data'}
          {args.data.type !== 'output' && (
            // if node is graph-output-node remove output link handle
            <Handle
              type="source"
              position={Position.Right}
              id="o__data"
              style={{ ...style.handle, ...style.right }}
              isValidConnection={isValidOutput}
            />
          )}
        </div>
      }
    />
  );
};

export default memo(DataNode);
