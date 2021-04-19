import { useEffect } from 'react';
import ReactFlow, { Controls, useZoomPanHelper } from 'react-flow-renderer';
import { getEdges, getNodes, positionNodes } from './utils';

const nodes = getNodes();
const edges = getEdges();
const positionedNodes = positionNodes(nodes, edges);

function App() {
  const { fitView } = useZoomPanHelper();

  useEffect(() => {
    fitView();
  }, [fitView]);

  return (
    <ReactFlow snapToGrid elements={[...positionedNodes, ...edges]}>
      <Controls />
    </ReactFlow>
  );
}

export default App;
