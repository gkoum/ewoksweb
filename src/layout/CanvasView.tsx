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
import { findGraphWithName } from '../utils';
import type { Theme } from '@mui/material/styles';
// import { createStyles, makeStyles } from '@material-ui/styles';
import useStore from '../store';
import CustomNode from '../CustomNodes/CustomNode';
import FunctionNode from '../CustomNodes/FunctionNode';
import DataNode from '../CustomNodes/DataNode';
import type { Graph, EwoksLink, EwoksNode } from '../types';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import { Checkbox } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Icon from '@mui/material/Icon';
import Flow from '../Flow';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = () => {
  return {};
}; // makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       flexGrow: 1,
//     },
//     paper: {
//       padding: theme.spacing(2),
//       textAlign: 'center',
//       color: theme.palette.text.secondary,
//     },
//     menuButton: {
//       marginRight: theme.spacing(2),
//     },
//     hide: {
//       display: 'none',
//     },
//   })
// );

let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  special: CustomNode,
  graph: FunctionNode,
  method: DataNode,
};

function CanvasView(props) {
  console.log(props);
  const classes = useStyles();

  const { fitView } = useZoomPanHelper();
  const [rfInstance, setRfInstance] = useState(null);
  const [elementClicked, setElementClicked] = useState({ id: 'none' });
  // const [ewoksD, setEwoksD] = useState(ewoksNetwork);
  const [disableDragging, setDisableDragging] = useState(false);
  const [elements, setElements] = useState([]);
  const reactFlowWrapper = useRef(null);

  const ewoksElements = useStore((state) => {
    console.log(state);
    return state.ewoksElements;
  });
  const setEwoksElements = useStore((state) => state.setEwoksElements);

  useEffect(() => {
    console.log(ewoksElements);
    setElements(ewoksElements);
  }, [ewoksElements]);

  const selectedElement = useStore((state) => state.selectedElement);
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const selectedSubgraph = useStore((state) => state.selectedElement);
  const setSelectedSubgraph = useStore((state) => state.setSelectedElement);

  const onElementClick = (event: MouseEvent, element: Node | Edge) => {
    console.log(element);
    const ewoksElement = ewoksElements.find((el) => el.id === element.id);
    setElementClicked(ewoksElement);
    setSelectedElement(ewoksElement);
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

  const CustomNewNode = (id: number, name: string, image: string) => {
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
  };

  const onDrop = (event) => {
    event.preventDefault();
    console.log(event);
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    console.log(type);
    const name = event.dataTransfer.getData('name');
    const image = event.dataTransfer.getData('image');
    const position = rfInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: CustomNewNode(id, name, image) },
    };
    console.log(rfInstance);
    // setElements((es) => [...es, newNode]);
    setEwoksElements([...elements, newNode]);
  };

  const onConnect = (params) => {
    console.log(params);
    setElements((els) => addEdge(params, els));
  };

  const onRightClick = (event) => {
    event.preventDefault();
    console.log(event);
  };

  const onNodeDoubleClick = (event, node) => {
    event.preventDefault();
    console.log(event, node);
    if (node.type === 'graph') {
      const subgraph = findGraphWithName(node.data.task_identifier);
      setSelectedSubgraph(subgraph);
      console.log('THIS IS A GRAPH');
      console.log(subgraph);
    } else {
      console.log('THIS IS A NODE');
    }
  };

  const closeSubgraph = (event) => {
    event.preventDefault();
    console.log(event);
    setSelectedSubgraph({ graph: { id: 0 }, nodes: [], links: [] });
  };

  return (
    <div className={classes.root}>
      <Rnd
        // style={{ backgroundColor: 'cyan', zIndex: 400 }}
        // disableDragging={disableDragging}
        default={{
          x: 50,
          y: -400,
          width: 700,
          height: 400,
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
            <IconButton color="inherit">
              <CloseIcon onClick={closeSubgraph} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Flow subgraph={props.subgraph} />
      </Rnd>
    </div>
  );
}

export default CanvasView;
