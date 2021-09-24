/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useStore from './store';
import type { Edge, Node } from 'react-flow-renderer';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import orangeFile from './images/orangeFile.png';
import orange1 from './images/orange1.png';
import orange2 from './images/orange2.png';
import orange3 from './images/orange3.png';
import AggregateColumns from './images/AggregateColumns.svg';
import Continuize from './images/Continuize.svg';
import Correlations from './images/Correlations.svg';
import CreateClass from './images/CreateClass.svg';
import CSVFile from './images/CSVFile.svg';
import Checkbox from '@material-ui/core/Checkbox';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/core/ExpandMoreIcon';

import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import IconButton from '@material-ui/core/IconButton';
import type { Graph, EwoksLink, EwoksNode } from './types';

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
        // width: '25ch',
      },
    },

    iconBut: {
      padding: '2px',
    },
  })
);

export default function Sidebar(props) {
  const classes = useStyles();

  const elementClickedStore = useStore<EwoksNode | EwoksLink>(
    (state) => state.selectedElement
  );
  console.log(typeof elementClickedStore);

  const setSelectedElement = useStore((state) => state.setSelectedElement);
  console.log(elementClickedStore);

  const ewoksElements = useStore((state) => {
    console.log(state);
    return state.ewoksElements;
  });
  const setEwoksElements = useStore((state) => state.setEwoksElements);

  const [element, setElement] = React.useState({} as Node);

  const [id, setId] = React.useState('');
  const [taskIdentifier, setTaskIdentifier] = React.useState('');
  const [taskType, setTaskType] = React.useState('');
  const [taskGenerator, setTaskGenerator] = React.useState('');
  const [defaultInputs, setDefaultInputs] = React.useState('');
  const [inputsComplete, setInputsComplete] = React.useState('');
  const [nodeType, setNodeType] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [positionX, setPositionX] = React.useState(Number);
  const [positionY, setPositionY] = React.useState(Number);

  useEffect(() => {
    console.log(elementClickedStore);
    setId(elementClickedStore.id);
    setNodeType(elementClickedStore.type);
    if ('position' in elementClickedStore) {
      setLabel(elementClickedStore.data.label);
      setTaskIdentifier(elementClickedStore.task_identifier);
      setTaskType(elementClickedStore.task_type);
      // setPositionX(elementClickedStore.position.x);
      // setPositionY(elementClickedStore.position.y);
    } else {
      setLabel(elementClickedStore.label);
      setPositionX(0);
      setPositionY(0);
    }
  }, [elementClickedStore]);

  const elementClickedStoreChanged = (event) => {
    console.log(event);
    // setName(event.target.value);
    // setSelectedElement(element);
  };

  const labelChanged = (event) => {
    setLabel(event.target.value);
    const el: Node | Edge = elementClickedStore;
    if ('position' in elementClickedStore) {
      el.data.label = event.target.value;
    } else {
      el.label = event.target.value;
    }
    const temp = ewoksElements.filter((elem) => {
      return elem.id !== id;
    });
    temp.push(el);
    setEwoksElements(temp);
    setSelectedElement(el);
  };

  const nodeTypeChanged = (event) => {
    setNodeType(event.target.value);
    // elementClickedStore.type = event.target.value;
    setSelectedElement(elementClickedStore);
  };

  const taskIdentifierChanged = (event) => {
    setTaskIdentifier(event.target.value);
  };

  const taskTypeChanged = (event) => {
    setTaskType(event.target.value);
  };

  const taskGeneratorChanged = (event) => {
    setTaskGenerator(event.target.value);
  };

  const defaultInputsChanged = (event) => {
    setDefaultInputs(event.target.value);
  };

  const inputsCompleteChanged = (event) => {
    setInputsComplete(event.target.value);
  };

  const positionXChanged = (event) => {
    setPositionX(event.target.value);
  };

  const positionYChanged = (event) => {
    setPositionY(event.target.value);
  };

  return (
    <aside className="dndflow">
      {/* <span
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        <img src={orangeFile} alt="orangeImage" />
      </span> */}
      {[
        { type: 'default', img: orange1 },
        { type: 'default', img: orange2 },
        { type: 'default', img: orange3 },
        { type: 'default', img: AggregateColumns },
        { type: 'default', img: Continuize },
        { type: 'default', img: Correlations },
        { type: 'default', img: CreateClass },
        { type: 'default', img: CSVFile },
        // { type: 'input', img: CSVFile },
      ].map((elem, index) => (
        <span
          className="dndnode"
          onDragStart={(event) => onDragStart(event, elem.type)}
          draggable
        >
          <img src={elem.img} alt="orangeImage" />
        </span>
      ))}
      <span
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'input')}
        draggable
      >
        Input
        {/* <img src={orangeFile} alt="orangeImage" /> */}
      </span>
      <span
        className="dndnode default"
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        Default
      </span>
      <span
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, 'output')}
        draggable
      >
        Output
      </span>
      <span
        className="dndnode graph"
        onDragStart={(event) => onDragStart(event, 'graph')}
        draggable
      >
        Subgraph
      </span>
      <Accordion>
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Edit Graph Elements</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form className={classes.root} noValidate autoComplete="off">
            <div>Id: {props.element.id}</div>
            {'position' in elementClickedStore && (
              <React.Fragment>
                <div>
                  <TextField
                    id="outlined-basic"
                    label="Task identifier"
                    variant="outlined"
                    value={taskIdentifier || ''}
                    onChange={taskIdentifierChanged}
                  />
                </div>
                <div>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Task type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={taskType}
                      label="Task type"
                      onChange={taskTypeChanged}
                    >
                      {['method', 'function', 'graph', 'class'].map(
                        (text, index) => (
                          <MenuItem key={index} value={text}>
                            {text}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <TextField
                    id="outlined-basic"
                    label="Task generator"
                    variant="outlined"
                    value={taskGenerator}
                    onChange={taskGeneratorChanged}
                  />
                </div>

                <div>
                  <TextField
                    id="outlined-basic"
                    label="Default Inputs"
                    variant="outlined"
                    value={defaultInputs}
                    onChange={defaultInputsChanged}
                  />
                </div>
                <div>
                  Inputs-complete
                  <Checkbox
                    value={inputsComplete}
                    onChange={inputsCompleteChanged}
                  />
                </div>
                <div>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Node type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={nodeType}
                      label="Task type"
                      onChange={nodeTypeChanged}
                    >
                      {['input', 'output', 'graph', 'default'].map(
                        (tex, index) => (
                          <MenuItem key={index} value={tex}>
                            {tex}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </div>
              </React.Fragment>
            )}
            <div>
              <TextField
                id="outlined-basic"
                label="Label"
                variant="outlined"
                value={label || ''}
                onChange={labelChanged}
              />
            </div>
            {/* <div>
          <TextField
            id="outlined-basic"
            label="positionY"
            variant="outlined"
            value={positionY || ''}
            onChange={positionYChanged}
          />
        </div> */}
            <Button variant="contained" color="primary">
              Save
            </Button>
            <Button variant="contained" color="primary">
              Subgraph
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
    </aside>
  );
}
