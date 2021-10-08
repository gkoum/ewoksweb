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
  graphOrSubgraph: true as Boolean,

  setGraphOrSubgraph: (getGraph: Boolean) => {
    set((state) => ({
      ...state,
      graphOrSubgraph: getGraph,
    }));
  },

  subgraphsStack: [] as string[],

  setSubgraphsStack: (name: string) => {
    let stack = [];
    const subStack = get().subgraphsStack;
    const exists = subStack.indexOf(name);
    console.log(exists, name);
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
    // if (get().graphOrSubgraph) {
    set((state) => ({
      ...state,
      graphRF,
    }));
    // } else {
    //   console.log(graphRF);
    // }
  },

  selectedElement: {
    id: '',
    type: '',
    data: { label: '' },
    position: { x: 0, y: 0 },
    default_inputs: [],
  } as EwoksRFNode,

  // sets graphRF as well? should it?
  setSelectedElement: (element: EwoksRFNode | EwoksRFLink) => {
    console.log(element);
    if ('position' in element) {
      set((state) => ({
        ...state,
        graphRF: {
          graph: get().graphRF.graph,
          nodes: [
            ...get().graphRF.nodes.filter((nod) => nod.id !== element.id),
            element,
          ],
          links: get().graphRF.links,
        },
        selectedElement: element,
      }));
    } else if ('source' in element) {
      console.log('saving a link.');
      set((state) => ({
        ...state,
        graphRF: {
          graph: get().graphRF.graph,
          nodes: get().graphRF.nodes,
          links: [
            ...get().graphRF.links.filter((link) => link.id !== element.id),
            element,
          ],
        },
        selectedElement: element,
      }));
    } else {
      set((state) => ({
        ...state,
        selectedElement: element,
      }));
    }
  },

  selectedSubgraph: {
    graph: { name: '', input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  },

  setSelectedSubgraph: (graph: GraphRF) => {
    // get the subgraph from server?
    const graphRF = findGraphWithName(graph.graph.name);
    console.log(graphRF);
    set((state) => ({
      ...state,
      selectedSubgraph: {
        graph: graphRF.graph,
        nodes: toRFEwoksNodes(graphRF.graph.name),
        links: toRFEwoksLinks(graphRF.graph.name),
      },
    }));
  },
}));
export default useStore;
