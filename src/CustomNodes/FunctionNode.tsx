// export {};
import React, { memo } from 'react';
// import * as R from "ramda";
import { Handle, Position } from 'react-flow-renderer';
import Node, { contentStyle as style } from './Node';

const isValidInput = (connection, type) => {
  return true; // R.last(R.split('__', connection.source)) === type;
};
const isValidOutput = (connection, type) => {
  return true; // R.last(R.split('__', connection.target)) === type;
};

function FunctionNode(all) {
  console.log(all.data, all);
  return (
    <Node
      type="graph"
      label={all.data.name}
      selected={all.selected}
      color="#ced3ee"
      image={all.data.icon}
      comment={all.data.comment}
      content={
        <>
          <div style={style.contentHeader}>Inputs</div>
          {all.data.inputs.map((input) => (
            <div
              key={`i-${input.label}`}
              style={{ ...style.io, ...style.textLeft } as React.CSSProperties}
            >
              {input.label}
              <Handle
                type="target"
                position={Position.Left}
                id={`i-${input.label}__${input.type}`}
                style={{ ...style.handle, ...style.left }}
                isValidConnection={(connection) =>
                  isValidInput(connection, input.type)
                }
              />
            </div>
          ))}
          <div style={style.contentHeader}>Outputs</div>
          {all.data.outputs.map((output) => (
            <div
              key={`o-${output.label}`}
              style={{ ...style.io, ...style.textRight } as React.CSSProperties}
            >
              {output.label}
              <Handle
                type="source"
                position={Position.Right}
                id={`o-${output.label}__${output.type}`}
                style={{ ...style.handle, ...style.right }}
                isValidConnection={(connection) =>
                  isValidOutput(connection, output.type)
                }
              />
            </div>
          ))}
        </>
      }
    />
  );
}

export default memo(FunctionNode);
