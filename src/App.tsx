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
  addEdge
} from 'react-flow-renderer';
import type {
  ReactFlowProps,
  ReactFlowRefType,
} from 'react-flow-renderer/dist/container/ReactFlow';
import type { ReactFlowAction } from 'react-flow-renderer/dist/store/actions';
import { getEdges, getNodes, positionNodes } from './utils';
import Sidebar from './sidebar';

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

const onElementClick = (event: MouseEvent, element: Node | Edge) =>
  console.log('click', element);

function App() {
  const { fitView } = useZoomPanHelper();
  const [rfInstance, setRfInstance] = useState(null);
  const [elements, setElements] = useState([...positionedNodes, ...edges]);
  const reactFlowWrapper = useRef(null);

  const onLoad = (reactFlowInstance) => setRfInstance(reactFlowInstance);
  const logToObject = () => console.log(rfInstance.toObject());
  // const logToObject = () => console.log([...positionedNodes, ...edges]);
  const logToEwoksObject = () => {
    console.log(rfInstance.getElements());
    const elements: [] = rfInstance.getElements()
    const nodes = elements.filter((el: Node) => el.data).map(({ id, data }) => (
    {
      id,
      clas: data,
      inputs: 'ok'
    }));
    const links = elements.filter((el: Edge) => el.source).map(({ id, source, target }) => (
    {
      id,
      source,
      target,
      inputs: 'ok'
    }));
    console.log(nodes, links)
    // const ewoksNetwork = {
    //   nodes: [
    //     { id: 'name1', clas: 'module.task.SumTask', inputs: { a: 1 } },
    //     { id: 'name2', clas: 'module.task.SumTask' },
    //   ],
    //   links: [{ source: 'name1', target: 'name2', arguments: { a: 'result' } }],
    // };
  }

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
    console.log(params)
    setElements((els) => addEdge(params, els));
  }
  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          style={{ height: '500px', width: '500px' }}
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
              <button type="button" onClick={logToEwoksObject}>
                toEwoksObject
              </button>
            </div>
            <Background />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
