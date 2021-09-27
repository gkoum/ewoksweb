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
import type { Graph, EwoksLink, EwoksNode } from '../types';
import CanvasView from './CanvasView';
import {
  getLinks,
  getNodes,
  positionNodes,
  ewoksNetwork,
  findGraphWithName,
} from '../utils';

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
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  special: CustomNode,
  graph: FunctionNode,
  method: DataNode,
};

function Canvas() {
  const classes = useStyles();

  const { fitView } = useZoomPanHelper();
  const [rfInstance, setRfInstance] = useState(null);
  const [elementClicked, setElementClicked] = useState({ id: 'none' });
  // const [ewoksD, setEwoksD] = useState(ewoksNetwork);
  const [disableDragging, setDisableDragging] = useState(false);
  const [elements, setElements] = useState([]);
  const reactFlowWrapper = useRef(null);
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);

  const ewoksElements = useStore((state) => {
    console.log(state);
    return state.ewoksElements;
  });
  const setEwoksElements = useStore((state) => state.setEwoksElements);

  // useEffect(() => {
  //   console.log(ewoksElements);
  //   setElements(ewoksElements);
  // }, [ewoksElements]);

  useEffect(() => {
    console.log(graphRF);
    console.log([...getNodes(graphRF), ...getLinks(graphRF)]);
    setElements([...getNodes(graphRF), ...getLinks(graphRF)]);
  }, [graphRF, graphRF.graph.id]);

  const selectedElement = useStore((state) => state.selectedElement);
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const selectedSubgraph = useStore((state) => state.selectedSubgraph);
  const setSelectedSubgraph = useStore((state) => state.setSelectedSubgraph);

  const onElementClick = (event: MouseEvent, element: Node | Edge) => {
    console.log(element, elements);
    const graphElement = elements.find((el) => el.id === element.id);
    console.log(graphElement);
    setElementClicked(graphElement);
    setSelectedElement(graphElement);
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

  const onDrop = (event) => {
    event.preventDefault();
    console.log(event);
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const name = event.dataTransfer.getData('name');
    const image = event.dataTransfer.getData('image');
    console.log(type, name, image);
    const position = rfInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      task_type: 'special',
      task_identifier: getId(),
      type,
      uiProps: { position },
      data: { label: CustomNewNode(id, name, image) },
    };
    console.log(rfInstance);
    // setElements((es) => [...es, newNode]);
    // setEwoksElements([...elements, newNode]);
    setGraphRF({
      graph: graphRF.graph,
      nodes: [...graphRF.nodes, newNode],
      links: graphRF.links,
    });
  };

  // as ewoks nodes are:
  // data_mapping: Array [ {…} ]
  // ​​​​source: "node1"
  // ​​​​sub_graph_nodes: Object { sub_target: "in1" }
  // ​​​​target: "node2"

  // As given back from the ReactFlow
  // id: "reactflow__edge-node2o-out1: subsubgraph  -> out1__data -node7i__data"
  // ​​​source: "node2"
  // ​​​sourceHandle: "o-out1: subsubgraph  -> out1__data "
  // ​​​target: "node7"
  // ​​​targetHandle: "i__data"
  // no data_mapping

  const onConnect = (params) => {
    console.log(params);
    setElements((els) => addEdge(params, els));
    setGraphRF({
      graph: graphRF.graph,
      nodes: graphRF.nodes,
      links: addEdge(params, graphRF.links),
    });
  };

  const onRightClick = (event) => {
    event.preventDefault();
    console.log(event);
  };

  const onSelectionChange = (elements) => {
    console.log(elements);
  };

  const onNodeDoubleClick = (event, node) => {
    event.preventDefault();
    console.log(event, node);
    if (node.type === 'graph') {
      const subgraph = findGraphWithName(node.data.task_identifier);
      setSelectedSubgraph(subgraph);
      setGraphRF(subgraph);
      setSubgraphsStack(subgraph.graph.id);
      console.log('THIS IS A GRAPH');
      console.log(subgraph);
      console.log(selectedSubgraph);
    } else {
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
            nodeTypes={nodeTypes}
          >
            <Controls />
            <div
              style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}
            >
              {/* <button type="button" onClick={logToObject}>
                  toObject
                </button> */}
              <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(elements)
                )}`}
                download="filename.json"
              >
                Download Json
              </a>
            </div>
            <Background />
          </ReactFlow>
          {/* <Popover
              anchor={elementClicked || null}
              onClose={() => setElementClicked(null)}
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
