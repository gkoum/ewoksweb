/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useStore from './store';
import type { Edge, Node } from 'react-flow-renderer';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@material-ui/core';
import orange1 from './images/orange1.png';
import orange2 from './images/orange2.png';
import orange3 from './images/orange3.png';
import AggregateColumns from './images/AggregateColumns.svg';
import Continuize from './images/Continuize.svg';
import Correlations from './images/Correlations.svg';
import CreateClass from './images/CreateClass.svg';
// import expandMore from './images/expandMore.svg';
import CSVFile from './images/CSVFile.svg';
import Checkbox from '@material-ui/core/Checkbox';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import EditableTable from './Components/EditableTable';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import type {
  Graph,
  EwoksLink,
  EwoksNode,
  EwoksRFNode,
  EwoksRFLink,
  Inputs,
} from './types';

const onDragStart = (event, { task_identifier, task_type, icon }) => {
  console.log(event, icon);
  event.dataTransfer.setData('task_identifier', task_identifier);
  event.dataTransfer.setData('task_type', task_type);
  event.dataTransfer.setData('icon', icon);
  event.dataTransfer.effectAllowed = 'move';
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1, 0),
        // width: '25ch',
      },
    },

    iconBut: {
      padding: '2px',
    },

    formInfo: {
      width: '200px',
      wordWrap: 'break-word',
      wordBreak: 'break-all',
    },
  })
);

const iconsObj = {
  orange1: orange1,
  Continuize: Continuize,
  orange2: orange2,
  orange3: orange3,
  AggregateColumns: AggregateColumns,
  Correlations: Correlations,
  CreateClass: CreateClass,
};

export default function Sidebar(props) {
  const classes = useStyles();

  const selectedElement = useStore<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  // default_inputs: [{ name: 'a', value: 1 }],
  const [id, setId] = React.useState('');
  const [taskIdentifier, setTaskIdentifier] = React.useState('');
  const [taskType, setTaskType] = React.useState('');
  const [taskGenerator, setTaskGenerator] = React.useState('');
  const [defaultInputs, setDefaultInputs] = React.useState<Inputs[]>([]);
  const [dataMapping, setDataMapping] = React.useState<Inputs[]>([]);
  const [conditions, setConditions] = React.useState<Inputs[]>([]);
  const [inputsComplete, setInputsComplete] = React.useState<boolean>(false);
  const [mapAllData, setMapAllData] = React.useState<boolean>(false);
  const [nodeType, setNodeType] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [element, setElement] = React.useState<EwoksRFNode | EwoksRFLink>({});
  const [onError, setOnError] = React.useState<boolean>(false);

  useEffect(() => {
    console.log(selectedElement);
    setElement(selectedElement);
    setId(selectedElement.id);
    if (selectedElement.id) {
      if ('position' in selectedElement) {
        setNodeType(selectedElement.data.type);
        setLabel(selectedElement.data.label);
        setComment(selectedElement.data.comment);
        setTaskIdentifier(selectedElement.task_identifier);
        setTaskType(selectedElement.task_type);
        setTaskGenerator(selectedElement.task_generator);
        setInputsComplete(!!selectedElement.inputs_complete);
        console.log(selectedElement.default_inputs);
        setDefaultInputs(
          selectedElement.default_inputs ? selectedElement.default_inputs : []
        );
        console.log(selectedElement);
      } else {
        setLabel(selectedElement.label);
        if (selectedElement.data && selectedElement.data.data_mapping)
          setDataMapping(selectedElement.data.data_mapping);
        if (selectedElement.data && selectedElement.data.map_all_data)
          setMapAllData(!!selectedElement.data.map_all_data);
        if (selectedElement.data && selectedElement.data.on_error)
          setOnError(selectedElement.data.on_error);
        if (selectedElement.data && selectedElement.data.conditions)
          setConditions(selectedElement.data.conditions);
        console.log(selectedElement);
      }
    }
  }, [selectedElement.id, selectedElement]);

  const labelChanged = (event) => {
    setLabel(event.target.value);
    // const tmpElement = { ...element, data: { ...element.data } };
    if ('position' in element) {
      setElement({
        ...element,
        data: { ...element.data, label: event.target.value },
      });
    } else {
      setElement({
        ...element,
        label: event.target.value,
      });
    }
  };

  const commentChanged = (event) => {
    setComment(event.target.value);
    setElement({
      ...element,
      data: { ...element.data, comment: event.target.value },
    });
  };

  const nodeTypeChanged = (event) => {
    setNodeType(event.target.value);
    setElement({
      ...element,
      data: { ...element.data, type: event.target.value },
    });
    // selectedElement.type = event.target.value;
    // setSelectedElement(selectedElement);
  };

  const defaultInputsChanged = (table) => {
    // setDefaultInputs(table);
    console.log(table);
    setElement({
      ...element,
      default_inputs: table,
    });
  };

  const conditionsValuesChanged = (table) => {
    // setDefaultInputs(table);
    console.log(table);
    setElement({
      ...element,
      data: { ...element.data, conditions: table },
    });
  };

  const dataMappingValuesChanged = (table) => {
    // setDefaultInputs(table);
    console.log(table);
    setElement({
      ...element,
      data: { ...element.data, data_mapping: table },
    });
  };

  // const taskIdentifierChanged = (event) => {
  //   setTaskIdentifier(event.target.value);
  // };

  // const taskTypeChanged = (event) => {
  //   setTaskType(event.target.value);
  // };

  const taskGeneratorChanged = (event) => {
    setTaskGenerator(event.target.value);
  };

  const inputsCompleteChanged = (event) => {
    console.log(inputsComplete, event.target.checked);
    setInputsComplete(event.target.checked);
    setElement({
      ...element,
      inputs_complete: event.target.checked,
    });
  };

  const onErrorChanged = (event) => {
    console.log(event.target.checked);
    setOnError(event.target.checked);
    // setElement({
    //   ...element,
    //   inputs_complete: event.target.checked,
    // });
  };

  const mapAllDataChanged = (event) => {
    console.log(mapAllData, event.target.checked);
    setMapAllData(event.target.checked);
    setElement({
      ...element,
      data: { ...element.data, map_all_data: event.target.checked },
    });
    console.log(element);
  };

  const saveElement = () => {
    console.log(element, selectedElement);
    setSelectedElement(element);
  };

  const addConditions = () => {
    console.log(selectedElement);
    if (element.data.conditions && element.data.conditions.length > 0) {
      console.log(element);
      setSelectedElement({
        ...element,
        data: {
          ...element.data,
          conditions: [
            ...element.data.conditions,
            { id: '-', name: '-', value: '-' },
          ],
        },
      });
    } else {
      console.log(element.data);
      setSelectedElement({
        ...element,
        data: {
          ...element.data,
          conditions: [{ id: '-', name: '-', value: '-' }],
        },
      });
    }
  };

  const addDataMapping = () => {
    console.log(selectedElement);
    if (element.data.data_mapping) {
      console.log(element);
      setSelectedElement({
        ...element,
        data: {
          ...element.data,
          data_mapping: [
            ...element.data.data_mapping,
            { id: '-', name: '-', value: '-' },
          ],
        },
      });
    } else {
      console.log(element.data);
      setSelectedElement({
        ...element,
        data: {
          ...element.data,
          data_mapping: [{ id: '-', name: '-', value: '-' }],
        },
      });
    }
  };

  const addDefaultInputs = () => {
    console.log(selectedElement);
    if (element.default_inputs) {
      console.log(element.default_inputs);
      setSelectedElement({
        ...element,
        default_inputs: [
          ...element.default_inputs,
          { id: '-', name: '-', value: '-' },
        ],
      });
    } else {
      setSelectedElement({
        ...element,
        default_inputs: [{ id: '-', name: '-', value: '-' }],
      });
    }
  };

  const insertGraph = (val) => {
    console.log(val, selectedElement);
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
      <Accordion>
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Add New Nodes</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ flexWrap: 'wrap' }}>
          {[
            { task_identifier: '1', task_type: 'method', icon: 'orange1' },
            { task_identifier: '2', task_type: 'method', icon: 'orange2' },
            { task_identifier: '3', task_type: 'method', icon: 'orange3' },
            {
              task_identifier: '4',
              task_type: 'method',
              icon: 'AggregateColumns',
            },
            { task_identifier: '5', task_type: 'method', icon: 'Continuize' },
            { task_identifier: '6', task_type: 'method', icon: 'Correlations' },
            { task_identifier: '7', task_type: 'method', icon: 'CreateClass' },
          ].map((elem, index) => (
            <span
              key={index}
              className="dndnode"
              onDragStart={(event) =>
                onDragStart(event, {
                  task_identifier: elem.task_identifier,
                  task_type: elem.task_type,
                  icon: elem.icon,
                })
              }
              draggable
            >
              <img src={iconsObj[elem.icon]} alt="orangeImage" />
            </span>
          ))}
          <span
            className="dndnode graph"
            onDragStart={(event) =>
              onDragStart(event, {
                task_identifier: 'graph',
                task_type: 'graph',
                icon: 'AggregateColumns',
              })
            }
            draggable
          >
            graph
          </span>
          <Button variant="contained" color="primary" onClick={insertGraph}>
            Insert Graph
          </Button>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Edit Graph Elements</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <b>Id:</b> {props.element.id}
            </div>
            {'source' in selectedElement && (
              <React.Fragment>
                <div className={classes.root}>
                  <b>Source:</b> {props.element.source}
                </div>
                <div className={classes.root}>
                  <b>Target:</b> {props.element.target}
                </div>
                {props.element.sub_target && (
                  <div className={classes.root}>
                    <b>Sub_target:</b> {props.element.data.sub_target}
                  </div>
                )}
                {props.element.sub_target_attributes && (
                  <div className={classes.root}>
                    <b>Sub_target_attributes:</b>
                    {props.element.data.sub_target_attributes}
                  </div>
                )}
                <div>
                  <b>Map all Data</b>
                  <Checkbox
                    checked={mapAllData}
                    onChange={mapAllDataChanged}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
                {!mapAllData && (
                  <div>
                    <b>Data Mapping </b>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="delete"
                      onClick={() => addDataMapping()}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                    {dataMapping.length > 0 && (
                      <EditableTable
                        headers={['Source', 'Target']}
                        defaultValues={dataMapping}
                        valuesChanged={dataMappingValuesChanged}
                      />
                    )}
                  </div>
                )}
                {/* <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="position"
                    name="position"
                    defaultValue="top"
                    value={conditionsOrError}
                    onChange={conditionsOrErrorChange}
                  >
                    <FormControlLabel
                      style={{ padding: '3px' }}
                      value="conditions"
                      control={<Radio size="small" />}
                      label="conditions"
                      labelPlacement="top"
                    />
                    <FormControlLabel
                      style={{ padding: '3px' }}
                      value="on_error"
                      control={<Radio size="small" />}
                      label="on_error"
                      labelPlacement="top"
                    />
                  </RadioGroup>
                </FormControl> */}
                <div>
                  <b>on_error</b>
                  <Checkbox
                    checked={onError}
                    onChange={onErrorChanged}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
                {!onError && (
                  <div>
                    <b>Conditions </b>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="delete"
                      onClick={() => addConditions()}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                    {conditions && conditions.length > 0 && (
                      <EditableTable
                        headers={['Name', 'Value']}
                        defaultValues={conditions}
                        valuesChanged={conditionsValuesChanged}
                      />
                    )}
                  </div>
                )}
                <div></div>
                <hr />
              </React.Fragment>
            )}
            {'position' in selectedElement && (
              <React.Fragment>
                <div className={classes.root}>
                  <b>Task Identifier:</b> {props.element.task_identifier}
                </div>
                <div className={classes.root}>
                  <b>Task type:</b> {props.element.task_type}
                </div>
                {/* <div>
                  <TextField
                    id="outlined-basic"
                    label="Task identifier"
                    variant="outlined"
                    value={taskIdentifier || ''}
                    onChange={taskIdentifierChanged}
                  />
                </div> */}
                {/* <div>
                  <FormControl variant="filled" fullWidth>
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
                      {['method', 'function', 'graph', 'class', undefined].map(
                        (text, index) => (
                          <MenuItem key={index} value={text}>
                            {text}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </div> */}
                <div>
                  <b>Task generator:</b> {props.element.task_generator}
                </div>
                {/* <div>
                  <TextField
                    id="outlined-basic"
                    label="Task generator"
                    variant="outlined"
                    value={taskGenerator}
                    onChange={taskGeneratorChanged}
                  />
                </div> */}
                <div>
                  <b>Default Values </b>
                  <IconButton
                    style={{ padding: '1px' }}
                    aria-label="delete"
                    onClick={() => addDefaultInputs()}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                  {defaultInputs.length > 0 && (
                    <EditableTable
                      headers={['Name', 'Value']}
                      defaultValues={defaultInputs}
                      valuesChanged={defaultInputsChanged}
                    />
                  )}
                  {/* <TextField
                    id="outlined-basic"
                    label="Default Inputs"
                    variant="outlined"
                    value={
                      defaultInputs && defaultInputs.length > 0
                        ? JSON.stringify(defaultInputs)
                        : ''
                      // .map((input) => input.name + '-->' + input.value)
                      //   .reduce((res, item) => {
                      //     return res + ', ' + item;
                      //   })
                    }
                    onChange={defaultInputsChanged}
                  /> */}
                </div>
                <div>
                  <b>Inputs-complete</b>
                  <Checkbox
                    checked={inputsComplete}
                    onChange={inputsCompleteChanged}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
                <hr></hr>
                <div>
                  <FormControl variant="filled" fullWidth>
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
                      {['input', 'output', 'graph', 'default', undefined].map(
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
            {'id' in selectedElement && (
              <React.Fragment>
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
                    label="Comment"
                    variant="outlined"
                    value={comment || ''}
                    onChange={commentChanged}
                  />
                </div>
              </React.Fragment>
            )}
            <Button variant="contained" color="primary" onClick={saveElement}>
              Save
            </Button>
            {/* <Button variant="contained" color="primary">
              Subgraph
            </Button> */}
          </form>
        </AccordionDetails>
      </Accordion>
    </aside>
  );
}
