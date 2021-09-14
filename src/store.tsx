import type { Edge, Node } from 'react-flow-renderer';
import create from 'zustand';
import { getEdges, getNodes, positionNodes, ewoksNetwork } from './utils';

// type State = {
//   clickedElement: string;
//   setClickedElement: (element: string) => void;
// };

interface GraphNodes {
  name: string;
  id: string;
  sub_node: string;
}

interface GraphDetails {
  input_nodes: Array<GraphNodes>;
  output_nodes: Array<GraphNodes>;
}

interface Graph {
  graph: GraphDetails;
  nodes: Array<EwoksNode>;
  edges: Array<EwoksLink>;
}

interface State {
  ewoksElements: Array<EwoksNode | EwoksLink>;
  setEwoksElements: (elements: Array<EwoksNode | EwoksLink>) => void;
  selectedElement: EwoksNode | EwoksLink;
  setSelectedElement: (element: EwoksNode | EwoksLink) => void;
  selectedSubgraph: Graph;
  setSelectedSubgraph: (graph: Graph) => void;
}

interface Inputs {
  key: string;
  value: string;
}

interface UiProps {
  key: string;
  value: string;
}

export interface EwoksLink {
  source: string;
  target: string;
  data_mapping?: string;
  conditions?: string;
  on_error?: Inputs;
  sub_graph_nodes?: { subtarget?: string; subsource?: string };
  uiProps?: UiProps;
}

export interface EwoksNode {
  id: string;
  task_type: string;
  task_identifier: string;
  inputs?: Inputs;
  inputs_complete?: boolean;
  task_generator?: string;
  uiProps?: UiProps;
}

const nodes = getNodes();
const edges = getEdges();
console.log(nodes, edges);
// const positionedNodes = positionNodes(nodes, edges);
// console.log(positionedNodes);

const useStore = create<State>((set) => ({
  ewoksElements: [...nodes, ...edges],

  setEwoksElements: (ewoksElements) =>
    set((state) => ({
      ...state,
      ewoksElements,
    })),

  selectedElement: {
    id: '',
    type: '',
    data: { label: '' },
    position: { x: 0, y: 0 },
  } as EwoksNode, // set initial values here

  setSelectedElement: (element: EwoksNode | EwoksLink) =>
    set((state) => ({
      ...state,
      selectedElement: element,
    })),
}));
export default useStore;
