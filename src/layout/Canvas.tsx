/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable unicorn/consistent-function-scoping */
import { useEffect, useState, MouseEvent, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  useZoomPanHelper,
  Node,
  Edge,
  ReactFlowState,
  Background,
  MiniMap,
  removeElements,
  addEdge,
} from 'react-flow-renderer';
import type {
  ReactFlowProps,
  ReactFlowRefType,
} from 'react-flow-renderer/dist/container/ReactFlow';
import type { ReactFlowAction } from 'react-flow-renderer/dist/store/actions';
import ReactJson from 'react-json-view';
import { Rnd } from 'react-rnd';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useStore from '../store';
import CustomNode from '../CustomNodes/CustomNode';
import FunctionNode from '../CustomNodes/FunctionNode';
import DataNode from '../CustomNodes/DataNode';
import type {
  Graph,
  EwoksLink,
  EwoksNode,
  GraphRF,
  EwoksRFNode,
} from '../types';
import CanvasView from './CanvasView';
import {
  toRFEwoksLinks,
  toRFEwoksNodes,
  positionNodes,
  ewoksNetwork,
  getGraph,
  getSubgraphs,
  // RFtoRFEwoksNode,
} from '../utils';
import useNodeInputsOutputs from '../hooks/useNodeInputsOutputs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
  })
);

let id = 0;
const getId = () => `new_node_${id++}`;
const getLinkId = () => `new_link_${id++}`;

const nodeTypes = {
  special: CustomNode,
  graph: FunctionNode,
  method: DataNode,
  ppfmethod: DataNode,
};

function Canvas() {
  const classes = useStyles();

  const { fitView } = useZoomPanHelper();
  const [rfInstance, setRfInstance] = useState(null);
  const [disableDragging, setDisableDragging] = useState(false);
  const [elements, setElements] = useState([]);

  const reactFlowWrapper = useRef(null);
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const selectedElement = useStore((state) => state.selectedElement);
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const updateNeeded = useStore((state) => state.updateNeeded);

  const selectedSubgraph = useStore((state) => state.selectedSubgraph);
  const setSelectedSubgraph = useStore((state) => state.setSelectedSubgraph);
  const recentGraphs = useStore((state) => state.recentGraphs);

  useEffect(() => {
    console.log('rerender Canvas', graphRF, recentGraphs.length, updateNeeded);
    setElements([...graphRF.nodes, ...graphRF.links]);
  }, [graphRF, graphRF.graph.id, recentGraphs.length, updateNeeded]);

  const onElementClick = (event: MouseEvent, element: Node | Edge) => {
    console.log(element, elements, graphRF.nodes);
    // if ('position' in element) {
    const graphElement = elements.find((el) => el.id === element.id);
    console.log(graphElement);
    setSelectedElement(graphElement);
    // } else {

    // }
  };

  const onLoad = (reactFlowInstance) => setRfInstance(reactFlowInstance);

  const handlDisableDragging = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisableDragging(event.target.checked);
  };

  useEffect(() => {
    fitView();
  }, [fitView]);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  function CustomNewNode(id: number, name: string, image: string) {
    return (
      <CustomNode
        id={id}
        name={name}
        image={image}
        onElementClick={onElementClick}
        // removeNode={removeNode}
        // openContactDetails={openContactDetails}
      />
    );
  }

  function dataNewNode({ type, label, image }) {
    console.log(type, label, image);
    return (
      <DataNode
        type
        label
        image
        onElementClick={onElementClick}
        // removeNode={removeNode}
        // openContactDetails={openContactDetails}
      />
    );
  }

  const onDrop = (event) => {
    event.preventDefault();
    console.log(event, event.dataTransfer);
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const task_identifier = event.dataTransfer.getData('task_identifier');
    const task_type = event.dataTransfer.getData('task_type');
    const icon = event.dataTransfer.getData('icon');
    console.log(task_identifier, task_type, icon);
    const position = rfInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    console.log(position);

    const newNode = {
      id: getId(),
      task_type,
      task_identifier,
      type: task_type,
      task_generator: '',
      position,
      default_inputs: [],
      inputs_complete: false,
      required_input_names: [],
      optional_input_names: [],
      output_names: [],
      data: { label: `${task_identifier} node`, type: 'internal', icon: icon },
      // data: { label: CustomNewNode(id, name, image) },
    };
    console.log(newNode, graphRF);
    // setElements((es) => [...es, newNode]);
    const newGraph = {
      graph: graphRF.graph,
      nodes: [...graphRF.nodes, newNode],
      links: graphRF.links,
    };
    // setElements((els) => addEdge(params, els));
    setGraphRF(newGraph as GraphRF);
    // need to also save it in recentGraphs if we leave and come back to the graph?
    setRecentGraphs(newGraph as GraphRF);
  };

  const onConnect = (params) => {
    console.log(params);
    // IF is a link between pre-existing nodes:
    // add links_required_output_names and links_optional_output_names from target
    // links_input_names from source node

    // ELSE IF there is a new node we need to find input and outputs

    const sourceTask = graphRF.nodes.find((nod) => nod.id === params.source);
    const targetTask = graphRF.nodes.find((nod) => nod.id === params.target);
    console.log(sourceTask, targetTask);
    const link = {
      data: {
        // node optional_input_names are link's optional_output_names
        links_optional_output_names: targetTask.optional_input_names,
        // node required_input_names are link's required_output_names
        links_required_output_names: targetTask.required_input_names,
        // node output_names are link's input_names
        links_input_names: sourceTask.output_names,
        conditions: '',
        data_mapping: [],
        map_all_data: false,
        sub_source: '',
        sub_target: '',
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      },
      id: getLinkId(),
      label: getLinkId(),
      source: params.source,
      target: params.target,
    };

    const newGraph = {
      graph: graphRF.graph,
      nodes: graphRF.nodes,
      links: [...graphRF.links, link], // addEdge(params, graphRF.links),
    };
    // setElements((els) => addEdge(params, els));
    setGraphRF(newGraph as GraphRF);
    // need to also save it in recentGraphs if we leave and come back to the graph?
    setRecentGraphs(newGraph as GraphRF);
  };

  const onRightClick = (event) => {
    event.preventDefault();
    console.log(event);
  };

  const onSelectionChange = (elements) => {
    console.log(elements);
    if (!elements) setSelectedElement(graphRF.graph);
    console.log(selectedElement);
  };

  const onNodeDoubleClick = (event, node) => {
    event.preventDefault();
    const nodeTmp = graphRF.nodes.find((el) => el.id === node.id);
    console.log(event, node, nodeTmp, recentGraphs);
    if (nodeTmp.task_type === 'graph') {
      // if type==graph get the subgraph from the recentGraphs (and if not from server?)
      // TODO: clear the relation of task_identifier and the id of a subgraph...
      // The same subgraph inserted twice in a superGraph must have its own id
      // create a unique id for this graph

      const subgraph = recentGraphs.find(
        (gr) => gr.graph.id === nodeTmp.task_identifier
      );
      console.log(subgraph);
      if (subgraph && subgraph.graph.id) {
        getSubgraphs(subgraph, recentGraphs);
        // TODO: if the subgraph does not exist on recent? Re-ask server and failsafe
        // const subgraph = getGraph(nodeTmp.task_identifier).then(save-to-recent).catch(failSafe)
        // setSelectedSubgraph(subgraph);
        setGraphRF(subgraph);
        setSubgraphsStack({
          id: subgraph.graph.id,
          label: subgraph.graph.label,
        });
        console.log(subgraph, recentGraphs);
      }
    } else {
      // TODO: need doubleClick on simple nodes?
      console.log('THIS IS A NODE');
    }
  };

  // const onNodeMouseMove = (event, node) => {
  //   event.preventDefault();
  //   console.log(event, node);
  // };

  const onSelectionDragStop = (event, node) => {
    event.preventDefault();
    console.log(event, node);
  };

  const onSelectionDrag = (event, node) => {
    event.preventDefault();
    console.log(event, node);
  };

  // const onNodeDrag = (event, node) => {
  //   event.preventDefault();
  //   console.log(event, node);
  // };

  const onNodeDragStop = (event, node) => {
    event.preventDefault();
    console.log(event, node, toRFEwoksNodes[node]);
    // find RFEwoksNode and update its position and save grapRF
    const RFEwoksNode: EwoksRFNode = {
      ...graphRF.nodes.find((nod) => nod.id === node.id),
    };
    RFEwoksNode.position = node.position;
    console.log(RFEwoksNode, graphRF);
    const newGraph = {
      graph: graphRF.graph,
      nodes: [
        ...graphRF.nodes.filter((nod) => nod.id !== node.id),
        RFEwoksNode,
      ],
      links: graphRF.links,
    };

    setGraphRF(newGraph as GraphRF);
    // need to also save it in recentGraphs if we leave and come back to the graph?
    setRecentGraphs(newGraph);
  };

  return (
    <div className={classes.root}>
      {/* <CanvasView /> */}
      {/* <Rnd
        // style={{ backgroundColor: 'cyan', zIndex: 400 }}
        disableDragging={disableDragging}
        default={{
          x: 100,
          y: 100,
          width: 1000,
          height: 800,
        }}
      > */}
      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Graphs Name
          </Typography>
          <Checkbox
            checked={disableDragging}
            onChange={handlDisableDragging}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </Toolbar>
      </AppBar> */}
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#e9ebf7',
          }}
          ref={reactFlowWrapper}
        >
          <ReactFlow
            snapToGrid
            elements={elements}
            onElementClick={onElementClick}
            onLoad={onLoad}
            onDrop={onDrop}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onPaneContextMenu={onRightClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onSelectionChange={onSelectionChange}
            // onNodeMouseMove={onNodeMouseMove}
            onSelectionDragStop={onSelectionDragStop}
            // onSelectionDrag={onSelectionDrag}
            // onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
          >
            <Controls />
            {/* <div
              style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}
            >
              <button type="button" onClick={logToObject}>
                toObject
              </button>
              <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(elements)
                )}`}
                download="filename.json"
              >
                Download Json
              </a>
            </div> */}
            <Background />
          </ReactFlow>
          {/* <Popover
              anchor={elementClicked || null}
              onClose={() => (null)}
              nodeData={elementClicked || null}
              onBottom={true}
            /> */}
        </div>
      </ReactFlowProvider>
      {/* </Rnd> */}
    </div>
  );
}

export default Canvas;
