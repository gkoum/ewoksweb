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
import CSVFile from '../images/CSVFile.svg';
import { Handle, Position } from 'react-flow-renderer';
import { IconButton, Tooltip } from '@material-ui/core';

export const contentStyle = {
  contentHeader: {
    padding: '8px 0px',
    flexGrow: 1,
    backgroundColor: '#eee',
  },
  io: {
    position: 'relative',
    padding: '8px 16px',
    flexGrow: 1,
  },
  left: { left: '-8px' },
  textLeft: { textAlign: 'left' },
  right: { right: '-8px' },
  textRight: { textAlign: 'right' },
  handle: {
    zIndex: '1000',
    widht: '20px', // Does not work
    height: '20px',
    margin: 'auto',
    background: '#ddd',
    borderRadius: '15px',
    border: '2px solid rgb(118, 133, 221)',
    boxShadow:
      'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px',
  },
  handleSource: {
    width: '10px',
    border: '2px solid rgb(118, 133, 221)',
  },
  handleTarget: {
    width: '10px',
    border: '2px solid rgb(230, 190, 118)',
  },
  handleUpDown: {
    // height: '18px',
    // background: 'rgb(221, 221, 221)',
    // width: '11px',
  },
};

const style = {
  icons: {
    maxWidth: '120px',
  },

  body: {
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: 'rgb(217, 223, 255)',
    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    border: '2px solid #bbb',
    borderRadius: '15px',
    fontSize: '10pt',
  },
  selected: {
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
  title: {
    position: 'relative',
    padding: '8px 3px',
    flexGrow: 1,
    backgroundColor: '#ee1',
    zIndex: '-2',
  },
  contentWrapper: {
    padding: '8px 0px',
  },
};

interface NodeProps {
  moreHandles: boolean;
  isGraph: boolean;
  type: string;
  label: string;
  selected: boolean;
  color?: string;
  content: React.ReactNode;
  image?: string;
  comment?: string;
}

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
const randomProperty = function (obj) {
  const keys = Object.keys(obj);
  return obj[keys[Math.trunc(keys.length * Math.random())]];
};

const onDragStart = (e) => {
  e.preventDefault();
};
const isValidOutput = (connection) => {
  return true; // R.last(R.split('__', connection.target)) === type;
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
  const customTitle = { ...style.title, wordWrap: 'break-word' };
  if (color) {
    customTitle.backgroundColor = color;
    customTitle.borderRadius = '10px';
  }

  /* eslint-disable-next-line dot-notation */
  // console.log(type, label, image, iconsObj[image]);
  // Collapse contentWrapper on icon click
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
            <>
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
            </>
          )}
        <div style={customTitle}>{label}</div>
        <div style={{ wordWrap: 'break-word' }}>{comment}</div>
        {/* eslint-disable-next-line dot-notation */}
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
