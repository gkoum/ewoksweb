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
import Upload from './Components/Upload';
import AddIcon from '@material-ui/icons/Add';

import type {
  Graph,
  EwoksLink,
  EwoksNode,
  EwoksRFNode,
  EwoksRFLink,
  Inputs,
  DataMapping,
  GraphDetails,
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

  const graphOrSubgraph = useStore<Boolean>((state) => state.graphOrSubgraph);
  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);

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
  const [element, setElement] = React.useState<
    EwoksRFNode | EwoksRFLink | GraphDetails
  >({});
  const [onError, setOnError] = React.useState<boolean>(false);
  const [graphInputs, setGraphInputs] = React.useState<Inputs[]>([]);
  const [graphOutputs, setGraphOutputs] = React.useState<Inputs[]>([]);
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);

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
    } else {
      console.log(graphRF.graph.input_nodes, graphRF.graph.output_nodes);
      setLabel(graphRF.graph.name);
      setComment(graphRF.graph.comment);
      setGraphInputs(
        graphRF.graph.input_nodes ? graphRF.graph.input_nodes : []
      );
      setGraphOutputs(
        graphRF.graph.output_nodes ? graphRF.graph.output_nodes : []
      );
    }
  }, [
    selectedElement.id,
    selectedElement,
    graphRF.graph.input_nodes,
    graphRF.graph.output_nodes,
    graphRF.graph.name,
    graphRF.graph.comment,
  ]);

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
    const dmap = table.map((row) => {
      return {
        source_output: row.name,
        target_input: row.value,
      };
    });
    setElement({
      ...element,
      data: {
        ...element.data,
        data_mapping: dmap,
        label: dmap
          .map((el) => `${el.source_output}->${el.target_input}`)
          .join(', ') as EwoksRFLink,
      },
    });
    console.log(element);
    // setLabel(
    //   element.data.data_mapping
    //     .map((el) => `${el.source_output}->${el.target_input}`)
    //     .join(', ')
    // );
    // setSelectedElement(element);
  };

  const graphInputsChanged = (table) => {
    console.log(table, element);
    // input_nodes: [{ name: 'in1', id: 'task1' }],
    // output_nodes: [
    //   { name: 'out1', id: 'subsubgraph', sub_node: 'out1' },
    //   { name: 'out2', id: 'subsubgraph', sub_node: 'out2' },

    setElement({
      ...element,
      input_nodes: [
        ...table.map((input) => {
          return { ...input, id: input.name };
        }),
      ],
    });
    // setGraphRF({
    //   nodes: graphRF.nodes,
    //   links: graphRF.links,
    //   graph: {
    //     ...graphRF.graph,
    //     input_nodes: [
    //       ...table.map((input) => {
    //         return { ...input, id: input.name };
    //       }),
    //     ],
    //   },
    // });
  };

  const graphOutputsChanged = (table) => {
    // input_nodes: [{ name: 'in1', id: 'task1' }],
    // output_nodes: [
    //   { name: 'out1', id: 'subsubgraph', sub_node: 'out1' },
    //   { name: 'out2', id: 'subsubgraph', sub_node: 'out2' },

    setElement({
      ...element,
      output_nodes: [
        ...table.map((output) => {
          return { ...output, id: output.name };
        }),
      ],
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

  const addGraphInput = () => {
    console.log(graphInputs);
    setGraphRF({
      nodes: graphRF.nodes,
      links: graphRF.links,
      graph: {
        ...graphRF.graph,
        input_nodes: [
          ...(graphRF.graph.input_nodes ? graphRF.graph.input_nodes : []),
          { id: '-', name: '-', value: '-' },
        ],
      },
    });
  };

  const addGraphOutput = () => {
    console.log(selectedElement);
    setGraphRF({
      nodes: graphRF.nodes,
      links: graphRF.links,
      graph: {
        ...graphRF.graph,
        output_nodes: [
          ...(graphRF.graph.output_nodes ? graphRF.graph.output_nodes : []),
          { id: '-', name: '-', value: '-' },
        ],
      },
    });
  };

  const insertGraph = (val) => {
    console.log(val, selectedElement);
    setGraphOrSubgraph(false);
  };

  return (
    <aside className="dndflow">
      <Accordion>
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Add Nodes</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ flexWrap: 'wrap' }}>
          {/* [{
            'optional_input_names': ['ppfport', 'ppfdict'],
            'output_names': ['ppfdict'],
            'required_input_names': [],
            'task_identifier': 'ewokscore.ppftasks.PpfPortTask',
            'task_type': 'class'
            }]
          */}

          {[
            {
              task_identifier: 'ewokscore.methodtask.MethodExecutorTask',
              task_type: 'method',
              icon: 'orange1',
            },
            {
              task_identifier: 'ewokscore.scripttask.ScriptExecutorTask',
              task_type: 'method',
              icon: 'orange2',
            },
            {
              task_identifier: 'ewokscore.ppftasks.PpfMethodExecutorTask',
              task_type: 'method',
              icon: 'orange3',
            },
            {
              task_identifier: '4',
              task_type: 'method',
              icon: 'AggregateColumns',
            },
            {
              task_identifier: 'ewokscore.ppftasks.PpfPortTask',
              task_type: 'method',
              icon: 'Continuize',
            },
            {
              task_identifier: 'ewokscore.tests.examples.tasks.sumtask.SumTask',
              task_type: 'method',
              icon: 'Correlations',
            },
            {
              task_identifier: 'ewokscore.tests.examples.tasks.sumtask.SumTask',
              task_type: 'method',
              icon: 'CreateClass',
            },
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
          <Upload>
            <span onClick={insertGraph}>
              <AddIcon />G
            </span>
          </Upload>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Edit{' '}
            {'position' in selectedElement
              ? 'Node'
              : 'source' in selectedElement
              ? 'Link'
              : 'Graph'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form className={classes.root} noValidate autoComplete="off">
            {'id' in selectedElement ? (
              <div>
                <b>Id:</b> {props.element.id}
              </div>
            ) : (
              <React.Fragment>
                <div>
                  <b>Name:</b> {graphRF.graph.name}
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
                    label="Comment"
                    variant="outlined"
                    value={comment || ''}
                    onChange={commentChanged}
                  />
                </div>
                <div>
                  <b>Inputs </b>
                  <IconButton
                    style={{ padding: '1px' }}
                    aria-label="delete"
                    onClick={() => addGraphInput()}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                  {graphInputs.length > 0 && (
                    <EditableTable
                      headers={['Name', 'Node_Id']}
                      defaultValues={graphInputs}
                      valuesChanged={graphInputsChanged}
                      typeOfValues={[
                        { type: 'input' },
                        {
                          type: 'select',
                          values: graphRF.nodes.map((nod) => nod.id),
                        },
                      ]}
                    />
                  )}
                </div>
                <div>
                  <b>Outputs </b>
                  <IconButton
                    style={{ padding: '1px' }}
                    aria-label="delete"
                    onClick={() => addGraphOutput()}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                  {graphOutputs.length > 0 && (
                    <EditableTable
                      headers={['Name', 'Node_Id']}
                      defaultValues={graphOutputs}
                      valuesChanged={graphOutputsChanged}
                      typeOfValues={[
                        { type: 'input' },
                        {
                          type: 'select',
                          values: graphRF.nodes.map((nod) => nod.id),
                        },
                      ]}
                    />
                  )}
                </div>
              </React.Fragment>
            )}
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
                        typeOfValues={[
                          {
                            type: 'select',
                            values: props.element.data.links_input_names || [],
                          },
                          {
                            type: 'select',
                            values:
                              [
                                ...props.element.data
                                  .links_required_output_names,
                                ...props.element.data
                                  .links_optional_output_names,
                              ] || [],
                          },
                        ]}
                        // all optional and required inputs + outputs of tasks are being used here
                        // do we need to have these info in the graph? can he describe a task not in the
                        // task list but still able to execute?
                      />
                    )}
                  </div>
                )}
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
                        typeOfValues={[
                          {
                            type: 'select',
                            values: props.element.data.links_input_names || [],
                          },
                          { type: 'input' },
                        ]}
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
                <div>
                  <b>Task generator:</b> {props.element.task_generator}
                </div>
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
                      typeOfValues={[{ type: 'input' }, { type: 'input' }]}
                    />
                  )}
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
                      {[
                        'input',
                        'output',
                        'internal',
                        'input_output',
                        undefined,
                      ].map((tex, index) => (
                        <MenuItem key={index} value={tex}>
                          {tex}
                        </MenuItem>
                      ))}
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
