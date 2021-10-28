import type {
  Graph,
  EwoksNode,
  EwoksRFNode,
  EwoksLink,
  EwoksRFLink,
  GraphEwoks,
  RFNode,
  nodeInputsOutputs,
  GraphRF,
} from '../types';
import {
  toRFEwoksLinks,
  toRFEwoksNodes,
  positionNodes,
  ewoksNetwork,
  getGraph,
} from '../utils';
import {
  graph,
  subgraph,
  subsubgraph,
  subsubsubgraph,
  tasks,
} from '../assets/graphTests';

import useStore from '../store';

function useGetGraphs(graph: GraphEwoks): GraphRF {
  // locate the task and add required+optional-inputs + outputs
  const graphRF = useStore((state) => state.graphRF);
  console.log(graph, graphRF);
  return graphRF;
}

export default useGetGraphs;
