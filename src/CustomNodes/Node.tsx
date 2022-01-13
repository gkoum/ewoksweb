/* eslint-disable react/function-component-definition */
/* jshint sub:true*/
import React, { memo } from 'react';
import orange1 from '../images/orange1.png';
import orange2 from '../images/orange2.png';
import orange3 from '../images/orange3.png';
import AggregateColumns from '../images/AggregateColumns.svg';
import Continuize from '../images/Continuize.svg';
import graphInput from '../images/graphInput.svg';
import right from '../images/right.svg';
import left from '../images/left.svg';
import up from '../images/up.svg';
import down from '../images/down.svg';
import graphOutput from '../images/graphOutput.svg';
import Correlations from '../images/Correlations.svg';
import CreateClass from '../images/CreateClass.svg';
import { Handle, Position } from 'react-flow-renderer';
import type { NodeProps } from '../types';
import { contentStyle, style } from './NodeStyle';

const iconsObj = {
  left,
  right,
  up,
  down,
  graphInput,
  graphOutput,
  orange1,
  Continuize,
  orange2,
  orange3,
  AggregateColumns,
  Correlations,
  CreateClass,
};
// const randomProperty = function (obj) {
//   const keys = Object.keys(obj);
//   return obj[keys[Math.trunc(keys.length * Math.random())]];
// };

const onDragStart = (e) => {
  e.preventDefault();
};
const isValidOutput = (connection) => {
  return true;
};

const Node: React.FC<NodeProps> = ({
  moreHandles,
  isGraph,
  type,
  label,
  selected,
  color,
  content,
  image,
  comment,
}: NodeProps) => {
  // console.log(type, isGraph);
  // calculate the border if input/output/graph
  let border = '';
  if (type === 'input') {
    border = '4px solid rgb(62, 80, 180)';
  } else if (type === 'output') {
    border = '4px solid rgb(50, 130, 219)';
  } else if (type === 'input_output') {
    border = '4px solid rgb(200, 130, 219)';
  } else if (isGraph) {
    // type === 'graph'
    border = '4px solid rgb(150, 165, 249)';
  }
  const customTitle = {
    ...style.title,
    wordWrap: 'break-word',
    borderRadius: '0px',
  };
  if (color) {
    customTitle.backgroundColor = color;
    customTitle.borderRadius = '10px';
  }

  return (
    <div
      style={
        {
          ...style.body,
          ...(selected ? style.selected : []),
          border,
        } as React.CSSProperties
      }
    >
      <span style={{ maxWidth: '120px' }} className="icons">
        {!isGraph && type !== 'graphOutput' && (
          <Handle
            type="source"
            position={Position.Right}
            id="sr"
            style={{ ...contentStyle.handle, ...contentStyle.handleSource }}
            isValidConnection={(connection) => isValidOutput(connection)}
            isConnectable
            onConnect={(params) => console.log('handle sr onConnect', params)}
          >
            {/* <img
              role="presentation"
              draggable="false"
              onDragStart={(event) => onDragStart(event)}
              src={iconsObj['right']}
              alt=""
            /> */}
          </Handle>
        )}
        {!isGraph &&
          type !== 'graphOutput' &&
          type !== 'graphInput' &&
          moreHandles && (
            <div
              id="choice"
              onMouseOver={() => console.log(label)}
              onFocus={() => console.log(label)}
              role="button"
              tabIndex={0}
            >
              <Handle
                type="source"
                position={Position.Top}
                id="st"
                style={{
                  right: 20,
                  left: 'auto',
                  ...contentStyle.handleSource,
                  ...contentStyle.handleUpDown,
                }}
                isValidConnection={(connection) => isValidOutput(connection)}
                isConnectable
                onConnect={(params) =>
                  console.log('handle st onConnect', params)
                }
              >
                {/* <img
                role="presentation"
                draggable="false"
                onDragStart={(event) => onDragStart(event)}
                src={iconsObj['up']}
                alt=""
              /> */}
              </Handle>
              <Handle
                type="source"
                position={Position.Bottom}
                id="sb"
                style={{
                  right: 20,
                  left: 'auto',
                  ...contentStyle.handleSource,
                  ...contentStyle.handleUpDown,
                }}
                isValidConnection={(connection) => isValidOutput(connection)}
                isConnectable
                onConnect={(params) =>
                  console.log('handle sb onConnect', params)
                }
              >
                {/* <img src={iconsObj['down']} alt="" /> */}
              </Handle>
            </div>
          )}
        <div style={customTitle as React.CSSProperties}>{label}</div>
        <div style={{ wordWrap: 'break-word' }}>{comment}</div>
        <img
          role="presentation"
          draggable="false"
          onDragStart={(event) => onDragStart(event)}
          src={iconsObj[image] || orange1}
          alt="orangeImage"
        />
        {/* {type !== 'graphOutput' && type !== 'graphInput' && <span style={style.contentWrapper}>{type}</span>} */}
        {!isGraph && type !== 'graphInput' && (
          <Handle
            type="target"
            position={Position.Left}
            id="tl"
            style={{
              ...contentStyle.handle,
              ...contentStyle.handleTarget,
            }}
            isConnectable
            onConnect={(params) => console.log('handle tl onConnect', params)}
          >
            {/* <img src={iconsObj['right']} alt="" /> */}
          </Handle>
        )}
        {!isGraph &&
          type !== 'graphOutput' &&
          type !== 'graphInput' &&
          moreHandles && (
            <>
              <Handle
                type="target"
                position={Position.Bottom}
                id="tb"
                style={{
                  left: 20,
                  ...contentStyle.handleTarget,
                  ...contentStyle.handleUpDown,
                }}
                isValidConnection={(connection) => isValidOutput(connection)}
                isConnectable
                onConnect={(params) =>
                  console.log('handle tb onConnect', params)
                }
              >
                {/* <Tooltip title="Delete">
                  <IconButton>in</IconButton>
                </Tooltip> */}
                {/* <img src={iconsObj['up']} alt="" /> */}
              </Handle>
              <Handle
                type="target"
                position={Position.Top}
                id="tt"
                style={{
                  left: 20,
                  ...contentStyle.handleTarget,
                  ...contentStyle.handleUpDown,
                }}
                isValidConnection={(connection) => isValidOutput(connection)}
                isConnectable
                onConnect={(params) =>
                  console.log('handle tt onConnect', params)
                }
              >
                {/* <img src={iconsObj['down']} alt="" /> */}
              </Handle>
            </>
          )}
        {type !== 'graphOutput' && type !== 'graphInput' && (
          <span style={style.contentWrapper}>{content}</span>
        )}
      </span>
    </div>
  );
};

export default memo(Node);
