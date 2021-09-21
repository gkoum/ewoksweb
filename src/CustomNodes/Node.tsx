/* eslint-disable react/function-component-definition */
import React, { memo } from 'react';
import orange1 from '../images/orange1.png';

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
    widht: '10px', // Does not work
    height: '10px',
    margin: 'auto',
    background: '#ddd',
    borderRadius: '15px',
    border: '2px solid #ddd',
    boxShadow:
      'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px',
  },
};

const style = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgb(217, 223, 255);',
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
  },
  contentWrapper: {
    padding: '8px 0px',
  },
};

interface NodeProps {
  type: string;
  label: string;
  selected: boolean;
  color?: string;
  content: React.ReactNode;
}
const Node: React.FC<NodeProps> = ({
  type,
  label,
  selected,
  color,
  content,
}: NodeProps) => {
  // calculate the border if input/output/graph
  let border = '';
  if (type === 'graph') {
    border = '4px solid rgb(150, 165, 249)';
  } else if (type === 'input') {
    border = '4px solid rgb(62, 80, 180)';
  } else if (type === 'output') {
    border = '4px solid rgb(62, 80, 100)';
  }
  const customTitle = { ...style.title };
  if (color) {
    customTitle.backgroundColor = color;
    customTitle.borderRadius = '10px';
  }

  // Collapse contentWrapper on icon click
  return (
    <div
      style={
        {
          ...style.body,
          ...(selected ? style.selected : []),
          border: border,
        } as React.CSSProperties
      }
    >
      <span className="icons">
        <div style={customTitle}>{label}</div>
        <img src={orange1} alt="orangeImage" />
        <span style={style.contentWrapper}>{content}</span>
      </span>
    </div>
  );
};

export default memo(Node);
