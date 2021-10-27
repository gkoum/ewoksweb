import create from 'zustand';
import type {
  State,
  EwoksRFLink,
  EwoksRFNode,
  GraphRF,
  GraphDetails,
  stackGraph,
} from './types';
import { toRFEwoksLinks, toRFEwoksNodes, getGraph } from './utils';

const nodes: EwoksRFNode[] = [];
const edges: EwoksRFLink[] = [];
console.log(nodes, edges);
// const positionedNodes = positionNodes(nodes, edges);
// console.log(positionedNodes);

const useStore = create<State>((set, get) => ({
  updateNeeded: 0,

  setUpdateNeeded: (num: number) => {
    set((state) => ({
      ...state,
      updateNeeded: get().updateNeeded + num,
    }));
  },

  recentGraphs: [] as GraphRF[],

  setRecentGraphs: (newGraph: GraphRF) => {
    console.log('NEW GRAPH:', get().recentGraphs, newGraph);
    const rec =
      get().recentGraphs.length > 0
        ? get().recentGraphs.filter((gr) => {
            console.log('GRR:', gr, newGraph);
            return gr.graph.id !== newGraph.graph.id;
          })
        : [];
    console.log('REC:', rec);
    set((state) => ({
      ...state,
      recentGraphs: [...rec, newGraph],
    }));
    console.log('RECENT GRAPHS:', get().recentGraphs);
  },

  graphOrSubgraph: true as Boolean,

  setGraphOrSubgraph: (isItGraph: Boolean) => {
    set((state) => ({
      ...state,
      graphOrSubgraph: isItGraph,
    }));
  },

  // stack has to hold label and id of graph
  subgraphsStack: [] as stackGraph[],

  setSubgraphsStack: (stackGraph: stackGraph) => {
    let stack = [];
    const subStack = get().subgraphsStack;
    const exists = subStack.map((gr) => gr.id).indexOf(stackGraph.id);
    console.log(exists, stackGraph, subStack);
    if (stackGraph.id === 'initialiase') {
      stack = [];
    } else if (exists === -1) {
      console.log('not exists');
      stack = [...subStack, stackGraph];
    } else if (exists == subStack.length - 1) {
      // TODO: if user insert the same 'graph' and is the first then stack is not updated
      console.log('exists the last');
      stack = subStack;
    } else {
      // TODO: if the same graph is inserted again lower in the subgraphs this is activated
      // and resets the stack without adding. If it is an addition this stack needs to know it
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

  graphRF: { graph: { id: 0 }, nodes: [], links: [] } as GraphRF,

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
    label: '',
    type: '',
    data: { label: '' },
    position: { x: 0, y: 0 },
    default_inputs: [],
  } as EwoksRFNode,

  // sets graphRF as well? should it?
  setSelectedElement: (element: EwoksRFNode | EwoksRFLink | GraphRF) => {
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
        graphRF: {
          graph: element,
          nodes: get().graphRF.nodes,
          links: get().graphRF.links,
        },
        selectedElement: element,
      }));
    }
  },

  selectedSubgraph: {
    graph: { id: '', label: '', input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  } as GraphRF,

  setSelectedSubgraph: (graph: GraphRF) => {
    // get the subgraph from server?
    const graphRF = getGraph(graph.graph.id, false);
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
