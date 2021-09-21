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
  subgraphsStack: [] as string[],

  setSubgraphsStack: (name: string) => {
    let stack = [];
    const subStack = get().subgraphsStack;
    const exists = subStack.indexOf(name);
    console.log(exists);
    if (name === 'initialiase') {
      stack = [];
    } else if (exists === -1) {
      console.log('not exists');
      stack = [...subStack, name];
    } else if (exists == subStack.length - 1) {
      console.log('exists the last');
      stack = subStack;
    } else {
      console.log('exists');
      // subStack.length = exists + 1;
      stack = subStack.slice(0, exists + 1);
      // stack = ['graph'];
    }
    console.log(stack);
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
