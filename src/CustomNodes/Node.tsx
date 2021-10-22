/* eslint-disable react/function-component-definition */
/*jshint sub:true*/
import React, { memo } from 'react';
import orange1 from '../images/orange1.png';
import orange2 from '../images/orange2.png';
import orange3 from '../images/orange3.png';
import AggregateColumns from '../images/AggregateColumns.svg';
import Continuize from '../images/Continuize.svg';
import Correlations from '../images/Correlations.svg';
import CreateClass from '../images/CreateClass.svg';
import CSVFile from '../images/CSVFile.svg';

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
  image?: string;
  comment?: string;
}

const iconsObj = {
  orange1: orange1,
  Continuize: Continuize,
  orange2: orange2,
  orange3: orange3,
  AggregateColumns: AggregateColumns,
  Correlations: Correlations,
  CreateClass: CreateClass,
};
const randomProperty = function (obj) {
  const keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

const onDragStart = (e) => {
  e.preventDefault();
};

const Node: React.FC<NodeProps> = ({
  type,
  label,
  selected,
  color,
  content,
  image,
  comment,
}: NodeProps) => {
  console.log(type);
  // calculate the border if input/output/graph
  let border = '';
  if (type === 'graph') {
    border = '4px solid rgb(150, 165, 249)';
  } else if (type === 'input') {
    border = '4px solid rgb(62, 80, 180)';
  } else if (type === 'output') {
    border = '4px solid rgb(50, 130, 219)';
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
          border: border,
        } as React.CSSProperties
      }
    >
      <span style={{ maxWidth: '120px' }} className="icons">
        <div style={customTitle}>{label}</div>
        <div style={{ wordWrap: 'break-word' }}>{comment}</div>
        {/* eslint-disable-next-line dot-notation */}
        <img
          role="presentation"
          draggable="false"
          onDragStart={(event) => onDragStart(event)}
          src={iconsObj[image]}
          alt="orangeImage"
        />
        <span style={style.contentWrapper}>{content}</span>
      </span>
    </div>
  );
};

export default memo(Node);
