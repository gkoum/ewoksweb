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
import { getEdges, getNodes, positionNodes, ewoksNetwork } from './utils';
import Sidebar from './sidebar';
import Flow from './Flow';
import Popover from './Components/Popover';

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
  const { fitView } = useZoomPanHelper();
  const [rfInstance, setRfInstance] = useState(null);
  const [elementClicked, setElementClicked] = useState({ id: 'none' });
  const [ewoksD, setEwoksD] = useState(ewoksNetwork);
  const [elements, setElements] = useState([...positionedNodes, ...edges]);
  const reactFlowWrapper = useRef(null);

  const onElementClick = (event: MouseEvent, element: Node | Edge) => {
    console.log('click', element);
    setElementClicked(element);
  };

  const onLoad = (reactFlowInstance) => setRfInstance(reactFlowInstance);
  const logToObject = () => console.log(rfInstance.toObject());
  // const logToObject = () => console.log([...positionedNodes, ...edges]);
  const toEwoksObject = (elements) => {
    // console.log(rfInstance.getElements());
    // const elements: [] = rfInstance.getElements();
    const nodes = elements
      .filter((el: Node) => el.data)
      .map(({ id, data }) => ({
        id,
        clas: data,
        inputs: 'ok',
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

  return (
    <div className="dndflow">
      <Flow />
      <hr />
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          style={{ height: '800px', width: '500px' }}
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
      <Sidebar element={elementClicked} />
      <ReactJson
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
      />
    </div>
  );
}

export default App;
