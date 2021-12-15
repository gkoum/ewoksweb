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
      isGraph
      moreHandles={false}
      type={all.data.type}
      label={
        all.label ? all.label : all.data.label
        // ? all.label.slice(0, all.label.indexOf(':'))
        // : all.data.label.slice(0, all.data.label.indexOf(':'))
      }
      selected={all.selected}
      color={all.data.exists ? '#ced3ee' : 'red'}
      image={all.data.icon}
      comment={all.data.comment}
      content={
        <>
          {/* <div style={style.contentHeader}>Inputs</div> */}
          {all.data.inputs.map((input) => (
            <div
              key={`i-${input.label}`}
              style={{ ...style.io, ...style.textLeft } as React.CSSProperties}
            >
              {/* remove the rest of the input {input.label} for now */}
              {input.label.slice(0, input.label.indexOf(':'))}
              <Handle
                key={input.label.slice(0, input.label.indexOf(':'))}
                type="target"
                position={Position.Left}
                id={input.label.slice(0, input.label.indexOf(':'))}
                style={{
                  ...style.handle,
                  ...style.left,
                  ...style.handleTarget,
                }}
                isValidConnection={(connection) =>
                  isValidInput(connection, input.type)
                }
              />
              <Handle
                key={input.label.slice(0, input.label.indexOf(':')) + 'right'}
                type="target"
                position={Position.Right}
                id={input.label.slice(0, input.label.indexOf(':')) + 'right'}
                style={{
                  ...style.handle,
                  ...style.right,
                  ...style.handleTarget,
                }}
                isValidConnection={(connection) =>
                  isValidOutput(connection, input.type)
                }
              />
            </div>
          ))}
          {/* <div style={style.contentHeader}>Outputs</div> */}
          {all.data.outputs.map((output) => (
            <>
              <div
                key={`o-${output.label}`}
                style={
                  { ...style.io, ...style.textRight } as React.CSSProperties
                }
              >
                {/* remove the rest of the output {output.label} for now */}
                {output.label.slice(0, output.label.indexOf(':'))}
                <Handle
                  key={output.label.slice(0, output.label.indexOf(':'))}
                  type="source"
                  position={Position.Right}
                  id={output.label.slice(0, output.label.indexOf(':'))}
                  style={{
                    ...style.handle,
                    ...style.right,
                    ...style.handleSource,
                  }}
                  isValidConnection={(connection) =>
                    isValidOutput(connection, output.type)
                  }
                />
                <Handle
                  key={
                    output.label.slice(0, output.label.indexOf(':')) + 'left'
                  }
                  type="source"
                  position={Position.Left}
                  id={output.label.slice(0, output.label.indexOf(':')) + 'left'}
                  style={{
                    ...style.handle,
                    ...style.left,
                    ...style.handleSource,
                  }}
                  isValidConnection={(connection) =>
                    isValidOutput(connection, output.type)
                  }
                />
              </div>
            </>
          ))}
        </>
      }
    />
  );
}

export default memo(FunctionNode);
