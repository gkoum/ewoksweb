import React, { useState } from 'react';
// import * as R from "ramda";
import ReactFlow, {
  removeElements,
  addEdge,
  isEdge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'react-flow-renderer';

import DataNode from './CustomNodes/DataNode';
import FunctionNode from './CustomNodes/FunctionNode';

const nodeTypes = {
  dataNode: DataNode,
  functionNode: FunctionNode,
};

const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();
const onNodeContextMenu = (event, node) => {
  event.preventDefault();
  console.log('context menu:', node);
};

const onElementClick = (event, element) => console.log('click', element);

const newElements = [
  {
    id: '0',
    type: 'dataNode',
    data: { name: 'OSIPI' },
    position: { x: 0, y: 80 },
  },
  {
    id: '1',
    type: 'dataNode',
    data: { name: 'some_source_data' },
    position: { x: 200, y: 80 },
  },
  {
    id: '2',
    type: 'dataNode',
    data: { name: 'another_source_data' },
    position: { x: 200, y: 180 },
  },
  {
    id: '3',
    type: 'dataNode',
    data: { name: 'uploaded_data', uploaded: true },
    position: { x: 200, y: 280 },
  },
  {
    id: '4',
    type: 'functionNode',
    data: {
      name: 'some_function',
      inputs: [
        { label: 'Dataset', type: 'data' },
        { label: 'Labels', type: 'data' },
      ],
      outputs: [
        { label: 'Model', type: 'data' },
        { label: 'Error', type: 'value' },
      ],
    },
    position: { x: 500, y: 80 },
  },
  {
    id: '5',
    type: 'dataNode',
    data: { name: 'generated_data' },
    position: { x: 700, y: 80 },
  },
  // {
  //   id: '6',
  //   type: 'valueNode',
  //   data: { name: 'generated_value', value: '0.8638' },
  //   position: { x: 700, y: 180 },
  // },
  {
    id: 'e0-1',
    source: '0',
    sourceHandle: 'o__data',
    target: '1',
    targetHandle: '__i__data',
    animated: false,
  },
  { id: 'e0-2', source: '0', target: '2', animated: false },
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    animated: true,
  },
  {
    id: 'e3-4',
    source: '3',
    sourceHandle: 'o__data',
    targetHandle: 'i-Labels__data',
    target: '4',
    animated: false,
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    animated: false,
  },
  // {
  //   id: 'e4-6',
  //   source: '4__o-Error__value',
  //   target: '6__i__value',
  //   animated: false,
  // },
];

function Flow() {
  const [elements, setElements] = useState(newElements);
  const onElementsRemove = (elementsToRemove) =>
    console.log(elementsToRemove, elements);
  // setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => {
    console.log(params, elements);
    // const allEdges = R.filter(isEdge, elements);
    // const matchingEdges = R.filter(
    //   (edge) => edge.target === params.target,
    //   allEdges
    // );
    // setElements((els) => removeElements(matchingEdges, els));
    // setElements((els) => addEdge(params, els));
  };

  return (
    <ReactFlow
      elements={elements}
      elementsSelectable
      selectNodesOnDrag
      nodeTypes={nodeTypes}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      onNodeContextMenu={onNodeContextMenu}
      onElementClick={onElementClick}
    >
      <Background gap={24} size={1} />
      <Controls />
      <MiniMap
        nodeColor={(node) => {
          switch (node.type) {
            case 'valueNode':
              return 'LightGreen';
            case 'dataNode':
              return 'LightBlue';
            case 'functionNode':
              return 'Lavender';
            case 'sourceNode':
              return 'Gold';
            default:
              return '#eee';
          }
        }}
      />
    </ReactFlow>
  );
}

export default Flow;
