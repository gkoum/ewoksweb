/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useStore from './store';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import orange1 from './images/orange1.png';
import orange2 from './images/orange2.png';
import orange3 from './images/orange3.png';
import AggregateColumns from './images/AggregateColumns.svg';
import Continuize from './images/Continuize.svg';
import graphInput from './images/graphInput.svg';
import graphOutput from './images/graphOutput.svg';
import Correlations from './images/Correlations.svg';
import CreateClass from './images/CreateClass.svg';
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
import ReactJson from 'react-json-view';
import DraggableDialog from './Components/DraggableDialog';
import DenseTable from './Components/DenseTable';
import EditIcon from '@material-ui/icons/EditOutlined';
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';
import IconMenu from './Components/IconMenu';
import Drawer from './Components/Drawer';
import axios from 'axios';

import type {
  EwoksRFNode,
  EwoksRFLink,
  Inputs,
  GraphDetails,
  GraphEwoks,
  Task,
} from './types';
import { rfToEwoks } from './utils';

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
        wordBreak: 'break-word',
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
  graphInput: graphInput,
  graphOutput: graphOutput,
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
  const [taskIcon, setTaskIcon] = React.useState('');
  const [defaultInputs, setDefaultInputs] = React.useState<Inputs[]>([]);
  const [dataMapping, setDataMapping] = React.useState<Inputs[]>([]);
  const [conditions, setConditions] = React.useState<Inputs[]>([]);
  const [inputsComplete, setInputsComplete] = React.useState<boolean>(false);
  const [moreHandles, setMoreHandles] = React.useState<boolean>(true);
  const [mapAllData, setMapAllData] = React.useState<boolean>(false);
  const [nodeType, setNodeType] = React.useState('');
  const [linkType, setLinkType] = React.useState('');
  const [arrowType, setArrowType] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [element, setElement] = React.useState<
    EwoksRFNode | EwoksRFLink | GraphDetails
  >({});
  const [onError, setOnError] = React.useState<boolean>(false);
  const [animated, setAnimated] = React.useState<boolean>(false);
  const [graphInputs, setGraphInputs] = React.useState<Inputs[]>([]);
  const [graphOutputs, setGraphOutputs] = React.useState<Inputs[]>([]);
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const tasks = useStore((state) => state.tasks);
  const setTasks = useStore((state) => state.setTasks);
  const [editIdentifier, setEditIdentifier] = React.useState(false);
  const [editType, setEditType] = React.useState(false);
  const [editGenerator, setEditGenerator] = React.useState(false);
  const [editIcon, setEditIcon] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [dialogContent, setDialogContent] = React.useState<GraphEwoks>({});
  const recentGraphs = useStore((state) => state.recentGraphs);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const initializedGraph = useStore((state) => state.initializedGraph);

  useEffect(() => {
    console.log(selectedElement);
    setElement(selectedElement);
    setId(selectedElement.id);

    if ('position' in selectedElement) {
      console.log('SHOW NODE DETAILS');
      setNodeType(selectedElement.data.type);
      setLabel(
        selectedElement.label
          ? selectedElement.label
          : selectedElement.data.label // Remove when graphs ok
      );
      setComment(selectedElement.data.comment);
      setTaskIdentifier(selectedElement.task_identifier);
      setTaskType(selectedElement.task_type);
      setTaskGenerator(selectedElement.task_generator);
      setTaskIcon(selectedElement.data.icon);
      setInputsComplete(!!selectedElement.inputs_complete);
      setMoreHandles(!!selectedElement.data.moreHandles);
      console.log(selectedElement.default_inputs);
      setDefaultInputs(
        selectedElement.default_inputs ? selectedElement.default_inputs : []
      );
    } else if ('source' in selectedElement) {
      console.log('SHOW LINK DETAILS');
      setLinkType(selectedElement.type);
      setArrowType(selectedElement.arrowHeadType);
      setAnimated(selectedElement.animated);
      setLabel(selectedElement.label);
      setComment(selectedElement.data && selectedElement.data.comment);
      if (selectedElement.data && selectedElement.data.data_mapping)
        setDataMapping(selectedElement.data.data_mapping);
      // if (selectedElement.data && selectedElement.data.map_all_data)
      setMapAllData(!!selectedElement.data.map_all_data || false);
      // if (selectedElement.data && selectedElement.data.on_error)
      setOnError(!!selectedElement.data.on_error || false);
      if (selectedElement.data && selectedElement.data.conditions)
        setConditions(selectedElement.data.conditions);
      console.log(selectedElement);
    } else {
      console.log('SHOW GRAPH DETAILS');
      console.log(selectedElement.input_nodes, selectedElement.output_nodes);
      setLabel(selectedElement.label);
      setComment(selectedElement.uiProps && selectedElement.uiProps.comment);
      setGraphInputs(
        selectedElement.input_nodes ? selectedElement.input_nodes : []
      );
      setGraphOutputs(
        selectedElement.output_nodes ? selectedElement.output_nodes : []
      );
    }
  }, [
    selectedElement.id,
    selectedElement,
    graphRF.graph.input_nodes,
    graphRF.graph.output_nodes,
    graphRF.graph.label,
    graphRF.graph.uiProps,
  ]);

  const taskIdentifierChanged = (event) => {
    setTaskIdentifier(event.target.value);

    setElement({
      ...element,
      task_identifier: event.target.value,
    });
  };

  const taskTypeChanged = (event) => {
    setTaskType(event.target.value);

    setElement({
      ...element,
      task_type: event.target.value,
    });
  };

  const taskGeneratorChanged = (event) => {
    setTaskGenerator(event.target.value);

    setElement({
      ...element,
      task_generator: event.target.value,
    });
  };

  const taskIconChanged = (event) => {
    setTaskIcon(event.target.value);

    setElement({
      ...element,
      task_generator: event.target.value,
    });
  };

  const labelChanged = (event) => {
    setLabel(event.target.value);
    if ('position' in element) {
      setElement({
        ...element,
        label: event.target.value,
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

  const graphCommentChanged = (event) => {
    setComment(event.target.value);
    setElement({
      ...element,
      uiProps: { ...element.uiProps, comment: event.target.value },
    });
  };

  const nodeTypeChanged = (event) => {
    console.log(event.target.value, element.data.type);
    setNodeType(event.target.value);
    setElement({
      ...element,
      data: { ...element.data, type: event.target.value },
    });
  };

  const linkTypeChanged = (event) => {
    console.log(event.target.value, element);
    setLinkType(event.target.value);
    setElement({
      ...element,
      type: event.target.value,
    });
  };

  const arrowTypeChanged = (event) => {
    console.log(event.target.value, element);
    setArrowType(event.target.value);
    setElement({
      ...element,
      arrowHeadType: event.target.value,
    });
  };

  const defaultInputsChanged = (table) => {
    // setDefaultInputs(table);
    console.log(table);
    setElement({
      ...element,
      default_inputs: table.map((dval) => {
        return {
          id: dval.name,
          name: dval.name,
          value: dval.value,
        };
      }),
    });
  };

  const conditionsValuesChanged = (table) => {
    console.log(table, element);
    setElement({
      ...element,
      data: {
        ...element.data,
        conditions: table.map((con) => {
          return {
            source_output: con.name,
            value: con.value,
          };
        }),
      },
    });
  };

  const dataMappingValuesChanged = (table) => {
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
  };

  const graphInputsChanged = (table) => {
    console.log(table, element);
    setElement({
      ...element,
      input_nodes: [
        ...table.map((input) => {
          return { ...input, id: input.name };
        }),
      ],
    });
  };

  const graphOutputsChanged = (table) => {
    setElement({
      ...element,
      output_nodes: [
        ...table.map((output) => {
          return { ...output, id: output.name };
        }),
      ],
    });
  };

  const moreHandlesChanged = (event) => {
    console.log(moreHandles, event.target.checked);
    setMoreHandles(event.target.checked);
    setElement({
      ...element,
      data: { ...element.data, moreHandles: event.target.checked },
    });
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
    setElement({
      ...element,
      data: { ...element.data, on_error: event.target.checked },
    });
  };

  const animatedChanged = (event) => {
    console.log(event.target.checked);
    setAnimated(event.target.checked);
    setElement({
      ...element,
      animated: event.target.checked,
    });
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
    // TODO: if in save some links dont have active source-target should be deleted?
    console.log(element, selectedElement);
    // calculate effects on saving an element on the rest of the graph
    setSelectedElement(element);
  };

  const deleteElement = async () => {
    // TODO: if node deleted all associated links should be deleted with warning?
    console.log(element, selectedElement, graphRF);
    let newGraph = {};
    if (element.position) {
      // find associated links to delete
      const nodesLinks = graphRF.links.filter(
        (link) => !(link.source === element.id || link.target === element.id)
      );
      console.log(nodesLinks);
      newGraph = {
        ...graphRF,
        nodes: graphRF.nodes.filter((nod) => nod.id !== element.id),
        links: nodesLinks,
      };
    } else if (element.source) {
      newGraph = {
        ...graphRF,
        links: graphRF.links.filter((link) => link.id !== element.id),
      };
    }

    if (element.input_nodes) {
      await axios
        .delete(`http://localhost:5000/workflow/${element.id}`)
        .then((res) => {
          setOpenSnackbar({
            open: true,
            text: `Workflow ${element.id} succesfully deleted!`,
            severity: 'success',
          });
        })
        .catch((error) => {
          setOpenSnackbar({
            open: true,
            text: error.message,
            severity: 'error',
          });
          console.log(error);
        });
      setGraphRF(initializedGraph);
      setSelectedElement({});
      setSubgraphsStack({ id: 'initialiase', label: '' });
      setRecentGraphs({}, true);
    } else {
      if (workingGraph.graph.id === graphRF.graph.id) {
        setGraphRF(newGraph);
      } else {
        setOpenSnackbar({
          open: true,
          text: 'Not allowed to delete any element in a sub-graph!',
          severity: 'success',
        });
      }
    }
  };

  const addConditions = () => {
    console.log(selectedElement);
    const elCon = element.data.conditions;
    if (elCon && elCon[elCon.length - 1] && elCon[elCon.length - 1].id === '') {
      console.log('should not ADD condition');
    } else {
      console.log(element);
      setSelectedElement({
        ...element,
        data: {
          ...element.data,
          conditions: [...elCon, { id: '', name: '', value: '' }],
        },
      });
    }
  };

  const addDataMapping = () => {
    console.log(selectedElement);
    const elMap = element.data.data_mapping;
    if (elMap && elMap[elMap.length - 1] && elMap[elMap.length - 1].id === '') {
      console.log('should not ADD mapping');
    } else {
      console.log(element);
      setSelectedElement({
        ...element,
        data: {
          ...element.data,
          data_mapping: [...elMap, { id: '', name: '', value: '' }],
        },
      });
    }
  };

  const addDefaultInputs = () => {
    console.log(selectedElement);
    const elIn = element.default_inputs;
    if (elIn && elIn[elIn.length - 1] && elIn[elIn.length - 1].id === '') {
      console.log('should not ADD default');
    } else {
      console.log(element.default_inputs);
      setSelectedElement({
        ...element,
        default_inputs: [...elIn, { id: '', name: '', value: '' }],
      });
    }
  };

  // const addGraphInput = () => {
  //   console.log(graphInputs);
  //   setGraphRF({
  //     nodes: graphRF.nodes,
  //     links: graphRF.links,
  //     graph: {
  //       ...graphRF.graph,
  //       input_nodes: [
  //         ...(graphRF.graph.input_nodes ? graphRF.graph.input_nodes : []),
  //         { id: 'id', name: '', value: '' },
  //       ],
  //     },
  //   });
  // };

  // const addGraphOutput = () => {
  //   console.log(selectedElement);
  //   setGraphRF({
  //     nodes: graphRF.nodes,
  //     links: graphRF.links,
  //     graph: {
  //       ...graphRF.graph,
  //       output_nodes: [
  //         ...(graphRF.graph.output_nodes ? graphRF.graph.output_nodes : []),
  //         { id: '-', name: '-', value: '-' },
  //       ],
  //     },
  //   });
  // };

  const insertGraph = (val) => {
    console.log(val, selectedElement);
    setGraphOrSubgraph(false);
  };

  const onEditIdentifier = () => {
    console.log(selectedElement);
    setEditIdentifier(!editIdentifier);
  };

  const onEditType = () => {
    console.log(selectedElement);
    setEditType(!editType);
  };

  const onEditGenerator = () => {
    console.log(selectedElement);
    setEditGenerator(!editGenerator);
  };

  const onEditIcon = () => {
    console.log(selectedElement);
    setEditIcon(!editIcon);
  };

  const toggleDraggableDialog = () => {
    console.log(graphRF);
    // setOpenDraggableDialog({
    //   open: true,
    //   content: { title: 'GraphRF', graph: graphRF },
    // });
  };

  const showEwoksGraph = () => {
    setOpenDialog(true);
    setDialogContent({
      title: 'Ewoks Graph',
      object: rfToEwoks(graphRF, recentGraphs),
      openFrom: 'sidebar',
    });
  };

  const getTasks = async (event) => {
    console.log(event, selectedElement);
    const tasks: Task[] = await axios.get('http://localhost:5000/tasks');
    console.log(tasks);
    setTasks(tasks.data);
  };

  return (
    <aside className="dndflow">
      <Accordion
        onChange={(e, expanded) => {
          if (expanded) {
            getTasks(e);
          }
        }}
      >
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Add Nodes</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ flexWrap: 'wrap' }}>
          {tasks.map((elem, index) => (
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
            {/* {'id' in selectedElement ? ( */}
            {'input_nodes' in selectedElement ? (
              <React.Fragment>
                <div>
                  <b>Id:</b> {graphRF.graph.id}
                </div>
                <div>
                  <b>Label:</b> {graphRF.graph.label}
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
                    onChange={graphCommentChanged}
                  />
                </div>
                <div>
                  <b>Inputs </b>
                  {/* TODO: simple table without edit is probably needed
                  TODO: when input exists without position we cannot erase it from sidebar*/}
                  {/* <IconButton
                    style={{ padding: '1px' }}
                    aria-label="delete"
                    onClick={() => addGraphInput()}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton> */}
                  {graphInputs.length > 0 && (
                    <>
                      <DenseTable data={graphInputs} />
                      {/* <EditableTable
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
                      /> */}
                    </>
                  )}
                </div>
                <div>
                  <b>Outputs </b>
                  {/* TODO: simple table without edit is probably needed */}
                  {/* <IconButton
                    style={{ padding: '1px' }}
                    aria-label="delete"
                    onClick={() => addGraphOutput()}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton> */}
                  {graphOutputs.length > 0 && (
                    <>
                      <DenseTable data={graphOutputs} />
                      {/* <EditableTable
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
                    /> */}
                    </>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <div>
                <b>Id:</b> {props.element.id}
              </div>
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
                {!mapAllData && element.source && (
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
                            type: element.source
                              ? ['class'].includes(
                                  graphRF &&
                                    graphRF.nodes[0] &&
                                    graphRF.nodes.find((nod) => {
                                      console.log(nod, element);
                                      return nod.id === element.source;
                                    }).task_type
                                )
                                ? 'select'
                                : 'input'
                              : 'input',
                            values: props.element.data.links_input_names || [],
                          },
                          {
                            type: element.target
                              ? ['class'].includes(
                                  graphRF &&
                                    graphRF.nodes[0] &&
                                    graphRF.nodes.find((nod) => {
                                      console.log(nod, element);
                                      return nod.id === element.target;
                                    }).task_type
                                )
                                ? 'select'
                                : 'input'
                              : 'input',
                            values:
                              [
                                ...props.element.data
                                  .links_required_output_names,
                                ...props.element.data
                                  .links_optional_output_names,
                              ] || [],
                          },
                        ]}
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
                {!onError && element.source && (
                  <div>
                    <b>Conditions </b>
                    {/* TODO: any kind of type is allowed: objects, arrays that need to be editable */}
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="delete"
                      onClick={() => addConditions()}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                    {conditions && conditions.length > 0 && (
                      <EditableTable
                        headers={['Source_output', 'Value']}
                        defaultValues={conditions}
                        valuesChanged={conditionsValuesChanged}
                        typeOfValues={[
                          {
                            type: element.source
                              ? ['class'].includes(
                                  graphRF &&
                                    graphRF.nodes[0] &&
                                    graphRF.nodes.find((nod) => {
                                      console.log(nod, element);
                                      return nod.id === element.source;
                                    }).task_type
                                )
                                ? 'select'
                                : 'input'
                              : 'input',
                            values: props.element.data.links_input_names || [],
                          },
                          {
                            type: 'input',
                          },
                        ]}
                      />
                    )}
                  </div>
                )}

                <hr />
              </React.Fragment>
            )}
            {'position' in selectedElement && (
              <React.Fragment>
                <Box>
                  <div className={classes.root}>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="edit"
                      onClick={() => onEditIdentifier()}
                    >
                      <EditIcon />
                    </IconButton>
                    <b>Identifier:</b> {props.element.task_identifier}
                  </div>
                  {editIdentifier && (
                    <TextField
                      id="Task Identifier"
                      label="Task Identifier"
                      variant="outlined"
                      value={taskIdentifier || ''}
                      onChange={taskIdentifierChanged}
                    />
                  )}
                  <div className={classes.root}>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="edit"
                      onClick={() => onEditType()}
                    >
                      <EditIcon />
                    </IconButton>
                    <b>Type:</b> {props.element.task_type}
                  </div>
                  {editType && (
                    <TextField
                      id="Task Type"
                      label="Task Type"
                      variant="outlined"
                      value={taskType || ''}
                      onChange={taskTypeChanged}
                    />
                  )}
                  <div>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="edit"
                      onClick={() => onEditGenerator()}
                    >
                      <EditIcon />
                    </IconButton>
                    <b>Generator:</b> {props.element.task_generator}
                  </div>
                  {editGenerator && (
                    <TextField
                      id="Task Generator"
                      label="Task Generator"
                      variant="outlined"
                      value={taskGenerator || ''}
                      onChange={taskGeneratorChanged}
                    />
                  )}
                  <div>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="edit"
                      onClick={() => onEditIcon()}
                    >
                      <EditIcon />
                    </IconButton>
                    <b>Icon:</b> {props.element.icon}
                  </div>
                  {editIcon && (
                    <TextField
                      id="Task Icon"
                      label="Task Icon"
                      variant="outlined"
                      value={taskIcon || ''}
                      onChange={taskIconChanged}
                    />
                  )}
                  <div>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="edit"
                      onClick={() => onEditIcon()}
                    >
                      <EditIcon />
                    </IconButton>
                    <b>Category:</b> {props.element.icon}
                  </div>
                  {editIcon && (
                    <TextField
                      id="outlined-basic"
                      label="Task Generator"
                      variant="outlined"
                      value={taskIcon || ''}
                      onChange={taskIconChanged}
                    />
                  )}
                  <div>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="edit"
                      onClick={() => onEditIcon()}
                    >
                      <EditIcon />
                    </IconButton>
                    <b>Optional Input Names:</b> {props.element.icon}
                  </div>
                  {editIcon && (
                    <TextField
                      id="outlined-basic"
                      label="Task Generator"
                      variant="outlined"
                      value={taskIcon || ''}
                      onChange={taskIconChanged}
                    />
                  )}
                  <div>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="edit"
                      onClick={() => onEditIcon()}
                    >
                      <EditIcon />
                    </IconButton>
                    <b>Required Input Names:</b> {props.element.icon}
                  </div>
                  {editIcon && (
                    <TextField
                      id="outlined-basic"
                      label="Task Generator"
                      variant="outlined"
                      value={taskIcon || ''}
                      onChange={taskIconChanged}
                    />
                  )}
                  <div>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="edit"
                      onClick={() => onEditIcon()}
                    >
                      <EditIcon />
                    </IconButton>
                    <b>Output Names:</b> {props.element.icon}
                  </div>
                  {editIcon && (
                    <TextField
                      id="outlined-basic"
                      label="Task Generator"
                      variant="outlined"
                      value={taskIcon || ''}
                      onChange={taskIconChanged}
                    />
                  )}
                  <div>
                    <hr></hr>
                    <b>Default Values </b>
                    {/* TODO: any kind of type is allowed: objects, arrays that need to be editable */}
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
                  <hr></hr>
                  <div>
                    <b>Inputs-complete</b>
                    <Checkbox
                      checked={inputsComplete}
                      onChange={inputsCompleteChanged}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </div>
                  <div>
                    <div>
                      <b>More handles</b>
                      <Checkbox
                        checked={moreHandles}
                        onChange={moreHandlesChanged}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </div>
                  </div>
                </Box>
              </React.Fragment>
            )}
            {(Object.keys(selectedElement).includes('position') ||
              Object.keys(selectedElement).includes('source')) && (
              <React.Fragment>
                <div>
                  <Box>
                    {/* if text size big use a text area
                    <TextareaAutosize
                      aria-label="empty textarea"
                      placeholder="Empty"
                      style={{ width: 200 }}
                      value={label || ''}
                      onChange={labelChanged}
                    /> */}
                    <TextField
                      id="outlined-basic"
                      label="Label"
                      variant="outlined"
                      value={label || ''}
                      onChange={labelChanged}
                    />
                  </Box>
                </div>
                <div>
                  <Box>
                    <TextField
                      id="outlined-basic"
                      label="Comment"
                      variant="outlined"
                      value={comment || ''}
                      onChange={commentChanged}
                    />
                  </Box>
                </div>
              </React.Fragment>
            )}
          </form>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Styling{' '}
            {'position' in selectedElement
              ? 'Node'
              : 'source' in selectedElement
              ? 'Link'
              : 'Graph'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form className={classes.root} noValidate autoComplete="off">
            {'position' in selectedElement && (
              <FormControl variant="filled" fullWidth>
                <InputLabel>Node type</InputLabel>
                <Select
                  id="demo-simple-select"
                  value={nodeType ? nodeType : 'internal'}
                  label="Node type"
                  onChange={nodeTypeChanged}
                >
                  {['input', 'output', 'internal', 'input_output'].map(
                    (tex, index) => (
                      <MenuItem key={index} value={tex}>
                        {tex}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            )}
            {'source' in selectedElement && (
              <>
                <FormControl variant="filled" fullWidth>
                  <InputLabel id="linkTypeLabel">Link type</InputLabel>
                  <Select
                    labelId="linkTypeLabel"
                    value={linkType ? linkType : 'internal'}
                    label="Link type"
                    onChange={linkTypeChanged}
                  >
                    {['straight', 'smoothstep', 'step', 'default'].map(
                      (text, index) => (
                        <MenuItem key={index} value={text}>
                          {text}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
                <FormControl variant="filled" fullWidth>
                  <InputLabel id="ArrowHeadType">Arrow Head Type</InputLabel>
                  <Select
                    value={arrowType ? arrowType : 'internal'}
                    label="Arrow head"
                    onChange={arrowTypeChanged}
                  >
                    {['arrow', 'arrowclosed', 'none'].map((tex) => (
                      <MenuItem value={tex}>{tex}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            <div>
              <b>animated</b>
              <Checkbox
                checked={animated ? animated : false}
                onChange={animatedChanged}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
            labelStyle
          </form>
        </AccordionDetails>
      </Accordion>
      <Button
        style={{ margin: '8px' }}
        variant="contained"
        color="primary"
        onClick={saveElement}
        size="small"
      >
        <SaveIcon />
      </Button>
      {/* {!('input_nodes' in selectedElement) && ( */}
      <Button
        style={{ margin: '8px' }}
        variant="outlined"
        color="secondary"
        onClick={deleteElement}
        size="small"
      >
        Delete
      </Button>
      {/* )} */}
      {!('source' in selectedElement) && (
        <IconMenu handleShowEwoksGraph={showEwoksGraph} />
      )}
      <DraggableDialog
        open={openDialog}
        content={dialogContent}
        setValue={defaultInputsChanged}
      />
      <Drawer />
    </aside>
  );
}
