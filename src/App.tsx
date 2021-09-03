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
import { getEdges, getNodes, positionNodes, ewoksNetwork } from './utils';
import Sidebar from './sidebar';
import Flow from './Flow';
import Popover from './Components/Popover';
import PrimarySearchAppBar from './layout/Navbar';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { Checkbox } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MyCard from './layout/MyCard';
import SideMenu from './layout/SideMenu';
import { cyan } from '@material-ui/core/colors';
import MinimizeIcon from '@material-ui/icons/Minimize';
import Icon from '@material-ui/core/Icon';
import useStore from './store';

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

const nodes = getNodes();
const edges = getEdges();
const positionedNodes = positionNodes(nodes, edges);
console.log(positionedNodes);

let id = 0;
const getId = () => `dndnode_${id++}`;

// positionedNodes.push({
//   id: 'Network Details',
//   data: 'sdvsfdv',
//   // sourcePosition: Position.Right,
//   // targetPosition: Position.Left,
//   position: { x: 0, y: 0 },
// });

function App() {
  const classes = useStyles();
  const { fitView } = useZoomPanHelper();
  const [rfInstance, setRfInstance] = useState(null);
  const [elementClicked, setElementClicked] = useState({ id: 'none' });
  const [ewoksD, setEwoksD] = useState(ewoksNetwork);
  const [disableDragging, setDisableDragging] = useState(false);
  const [elements, setElements] = useState([...positionedNodes, ...edges]);
  const reactFlowWrapper = useRef(null);

  const selectedElement = useStore((state) => state.selectedElement);
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const onElementClick = (event: MouseEvent, element: Node) => {
    console.log('click', element);
    setElementClicked(element);
    setSelectedElement(element);
  };

  const onLoad = (reactFlowInstance) => setRfInstance(reactFlowInstance);
  const logToObject = () => console.log(rfInstance.toObject());
  // const logToObject = () => console.log([...positionedNodes, ...edges]);
  const toEwoksObject = (elements) => {
    // console.log(rfInstance.getElements());
    // const elements: [] = rfInstance.getElements();
    const nodes = elements
      .filter((el: Node) => el.data)
      .map(({ id, data, type }) => ({
        id,
        clas: data,
        inputs: 'ok',
        type,
      }));
    const links = elements
      .filter((el: Edge) => el.source)
      .map(({ id, source, target }) => ({
        id,
        source,
        target,
        inputs: 'ok',
      }));
    console.log({ nodes, links });
    return { nodes, links };
    // return { nodes: nodes, links: links };
  };

  useEffect(() => {
    fitView();
  }, [fitView]);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = rfInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: `${type} node` },
    };
    console.log(rfInstance.getElements());
    setElements((es) => [...es, newNode]);
    // positionedNodes.push(newNode);
    // console.log(positionedNodes);
  };

  const onConnect = (params) => {
    console.log(params);
    setElements((els) => addEdge(params, els));
  };

  const onAddRJson = (event) => {
    console.log(event);
    setElements((es) => event.updated_src);
    setEwoksD((es) => toEwoksObject(event.updated_src));
  };

  const onAddRJsonEwoks = (event) => {
    console.log(event);
    setEwoksD((es) => event.updated_src);
  };

  const onEditRJson = (event) => {
    console.log(event);
    setElements((es) => event.updated_src);
    setEwoksD(() => toEwoksObject(event.updated_src));
  };

  const onEditRJsonEwoks = (event) => {
    console.log(event);
    setEwoksD((es) => event.updated_src);
  };

  const handlDisableDragging = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisableDragging(event.target.checked);
  };

  return (
    <div className={classes.root}>
      <SideMenu></SideMenu>
      <Rnd
        // style={{ backgroundColor: 'cyan', zIndex: 400 }}
        disableDragging={disableDragging}
        default={{
          x: 500,
          y: 500,
          width: 800,
          height: 300,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            // onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Persistent drawer
          </Typography>
          <Icon className="fa fa-plus-circle" style={{ fontSize: 30 }} />
        </Toolbar>
        <Flow />
      </Rnd>
      <Rnd
        // style={{ backgroundColor: 'cyan', zIndex: 400 }}
        disableDragging={disableDragging}
        default={{
          x: 100,
          y: 100,
          width: 800,
          height: 365,
        }}
      >
        <AppBar position="static">
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
        </AppBar>
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
            >
              <Controls />
              <div
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
      </Rnd>
      <Rnd
        // style={{ backgroundColor: 'cyan', zIndex: 400 }}
        disableDragging={disableDragging}
        default={{
          x: 10,
          y: 70,
          width: 300,
          height: 300,
        }}
      >
        <MyCard />
      </Rnd>
      {/* <ReactJson
        src={elements}
        collapseStringsAfterLength={15}
        onAdd={(e) => {
          onAddRJson(e);
        }}
        onEdit={(e) => {
          onEditRJson(e);
        }}
      />
      <ReactJson
        src={ewoksD}
        collapseStringsAfterLength={15}
        onAdd={(e) => {
          onAddRJsonEwoks(e);
        }}
        onEdit={(e) => {
          onEditRJsonEwoks(e);
        }}
      /> */}
    </div>
  );
}

export default App;
