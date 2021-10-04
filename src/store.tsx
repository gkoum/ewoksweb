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
  toRFEwoksLinks,
  toRFEwoksNodes,
  positionNodes,
  ewoksNetwork,
  findGraphWithName,
} from './utils';

const nodes: EwoksRFNode[] = []; //toRFEwoksNodes('graph');
const edges: EwoksRFLink[] = []; // toRFEwoksLinks('graph');
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

  selectedElement: {
    id: '',
    type: '',
    data: { label: '' },
    position: { x: 0, y: 0 },
    default_inputs: [],
  } as EwoksRFNode,

  // sets graphRF as well? should it?
  setSelectedElement: (element: EwoksNode | EwoksLink) => {
    console.log(element);
    let tempNods = [];
    if ('position' in element) {
      const nodes = [...get().graphRF.nodes];
      tempNods = [...nodes.filter((nod) => nod.id !== element.id), element];
      console.log(nodes, tempNods);
    }
    set((state) => ({
      ...state,
      graphRF: {
        graph: get().graphRF.graph,
        nodes: 'position' in element ? tempNods : get().graphRF.nodes,
        links: get().graphRF.links,
      },
      selectedElement: element,
    }));
  },

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
        nodes: toRFEwoksNodes(graphRF.graph.id),
        links: toRFEwoksLinks(graphRF.graph.id),
      },
    }));
  },
}));
export default useStore;
