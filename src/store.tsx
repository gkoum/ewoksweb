import type { Edge, Node } from 'react-flow-renderer';
import create from 'zustand';
import type {
  State,
  Graph,
  EwoksNode,
  EwoksLink,
  EwoksRFLink,
  EwoksRFNode,
  GraphRF,
} from './types';
import {
  getLinks,
  getNodes,
  positionNodes,
  ewoksNetwork,
  findGraphWithName,
} from './utils';

const nodes: EwoksRFNode[] = []; //getNodes('graph');
const edges: EwoksRFLink[] = []; // getLinks('graph');
console.log(nodes, edges);
// const positionedNodes = positionNodes(nodes, edges);
// console.log(positionedNodes);

const useStore = create<State>((set, get) => ({
  subgraphsStack: [] as GraphRF[],

  setSubgraphsStack: (graphRF: GraphRF) => {
    let stack = [];
    const exists = get().subgraphsStack.find(
      (gr) => gr.graph.id === graphRF.graph.id
    );
    console.log(exists);
    if (exists) {
    } else {
      stack = [...get().subgraphsStack, graphRF];
    }
    set((state) => ({
      ...state,
      subgraphsStack: stack,
    }));
  },

  graphRF: { graph: {}, nodes: [], links: [] } as GraphRF,

  setGraphRF: (graphRF) => {
    console.log(graphRF);
    set((state) => ({
      ...state,
      graphRF,
    }));
  },

  ewoksElements: [...nodes, ...edges],

  setEwoksElements: (ewoksElements) => {
    console.log(ewoksElements);
    set((state) => ({
      ...state,
      ewoksElements,
    }));
  },

  selectedElement: {
    id: '',
    type: '',
    data: { label: '' },
    position: { x: 0, y: 0 },
  } as EwoksRFNode,

  setSelectedElement: (element: EwoksNode | EwoksLink) =>
    set((state) => ({
      ...state,
      selectedElement: element,
    })),

  selectedSubgraph: {
    graph: { id: '', input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  },

  setSelectedSubgraph: (graph: GraphRF) => {
    // get the subgraph from server?
    const graphRF = findGraphWithName(graph.graph.id);
    console.log(graphRF);
    set((state) => ({
      ...state,
      selectedSubgraph: {
        graph: graphRF.graph,
        nodes: getNodes(graphRF.graph.id),
        links: getLinks(graphRF.graph.id),
      },
    }));
  },
}));
export default useStore;
