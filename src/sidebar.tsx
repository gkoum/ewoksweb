/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useStore from './store';
import type { Edge, Node } from 'react-flow-renderer';

const onDragStart = (event, nodeType) => {
  console.log(event, nodeType);
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  })
);

export default function Sidebar(props) {
  const classes = useStyles();

  console.log('rendered sidebar');

  const elementClickedStore = useStore<Node | Edge>(
    (state) => state.selectedElement
  );
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  console.log(elementClickedStore);

  const ewoksElements = useStore((state) => {
    console.log(state);
    return state.ewoksElements;
  });
  const setEwoksElements = useStore((state) => state.setEwoksElements);

  const [element, setElement] = React.useState({} as Node);

  const [id, setId] = React.useState('');
  const [type, setType] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [positionX, setPositionX] = React.useState(Number);
  const [positionY, setPositionY] = React.useState(Number);

  useEffect(() => {
    setId(elementClickedStore.id);
    setType(elementClickedStore.type);
    setLabel(elementClickedStore.data.label);
    setPositionX(elementClickedStore.position.x);
    setPositionY(elementClickedStore.position.y);
  }, [
    elementClickedStore.id,
    elementClickedStore.type,
    elementClickedStore.data.label,
    elementClickedStore.position.x,
    elementClickedStore.position.y,
  ]);

  const elementClickedStoreChanged = (event) => {
    console.log(event);
    // setName(event.target.value);
    // setSelectedElement(element);
  };

  const labelChanged = (event) => {
    console.log(ewoksElements);
    setId(event.target.value);
    const el: Node | Edge = elementClickedStore;
    el.data.label = event.target.value;
    const temp = ewoksElements.filter((elem) => {
      console.log(elem.id, id);
      return elem.id !== id;
    });
    temp.push(el);
    setEwoksElements(temp);

    setSelectedElement(el);
  };

  const typeChanged = (event) => {
    setType(event.target.value);
    // elementClickedStore.type = event.target.value;
    setSelectedElement(elementClickedStore);
  };

  const positionXChanged = (event) => {
    setPositionX(event.target.value);
  };

  const positionYChanged = (event) => {
    setPositionY(event.target.value);
  };

  return (
    <aside className="dndflow">
      {/* <div className="description">
        You can drag these nodes to the pane on the right.
      </div> */}
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'input')}
        draggable
      >
        Input Node
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        Default Node
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, 'output')}
        draggable
      >
        Output Node
      </div>
      <form className={classes.root} noValidate autoComplete="off">
        <div>Id: {props.element.id}</div>
        <div>
          <TextField
            id="outlined-basic"
            label="type"
            variant="outlined"
            value={type || ''}
            onChange={typeChanged}
          />
        </div>
        <div>
          <TextField
            id="outlined-basic"
            label="Label"
            variant="outlined"
            value={label || ''}
            onChange={labelChanged}
          />
        </div>
        <div>
          <TextField
            id="outlined-basic"
            label="positionX"
            variant="outlined"
            value={positionX || ''}
            onChange={positionXChanged}
          />
        </div>
        <div>
          <TextField
            id="outlined-basic"
            label="positionY"
            variant="outlined"
            value={positionY || ''}
            onChange={positionYChanged}
          />
        </div>
      </form>
    </aside>
  );
}
