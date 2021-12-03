import create from 'zustand';
import type {
  State,
  EwoksRFLink,
  EwoksRFNode,
  GraphRF,
  GraphDetails,
  stackGraph,
  GraphEwoks,
  Graph,
} from './types';
import {
  toRFEwoksLinks,
  toRFEwoksNodes,
  createGraph,
  getGraph,
  getSubgraphs,
} from './utils';
import { validateEwoksGraph } from './utils/EwoksValidator';
import { findAllSubgraphs } from './utils/FindAllSubgraphs';

const nodes: EwoksRFNode[] = [];
const edges: EwoksRFLink[] = [];
console.log(nodes, edges);

const initializedGraph = {
  graph: {
    id: '0',
    label: 'New-Graph',
    input_nodes: [],
    output_nodes: [],
    uiProps: {},
  },
  nodes: [],
  links: [],
} as GraphRF;

const useStore = create<State>((set, get) => ({
  openDraggableDialog: { open: false, content: {} },

  setOpenDraggableDialog: ({ open, content }) => {
    set((state) => ({
      ...state,
      openDraggableDialog: { open, content },
    }));
  },

  openSnackbar: { open: false, text: '', severity: 'success' },

  setOpenSnackbar: (setOpen) => {
    set((state) => ({
      ...state,
      openSnackbar: setOpen,
    }));
  },

  // updateNeeded: 0,

  // setUpdateNeeded: (num: number) => {
  //   set((state) => ({
  //     ...state,
  //     updateNeeded: get().updateNeeded + num,
  //   }));
  // },
  allWorkflows: [] as GraphEwoks[],

  setAllWorkflows: (workflows: GraphEwoks[]) => {
    set((state) => ({
      ...state,
      allWorkflows: workflows,
    }));
  },

  recentGraphs: [] as GraphRF[],

  setRecentGraphs: (newGraph: GraphRF, reset = false) => {
    console.log('NEW GRAPH:', get().recentGraphs, newGraph, reset);
    let rec = [];
    if (!reset) {
      rec =
        get().recentGraphs.length > 0
          ? get().recentGraphs.filter((gr) => {
              console.log('GRR:', gr, newGraph);
              return gr.graph.id !== newGraph.graph.id;
            })
          : [];
    }
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

  workingGraph: initializedGraph,

  setWorkingGraph: async (workingGraph: GraphEwoks): Promise<GraphRF> => {
    // 1. if it is a new graph opening initialize
    // TODO: remove initialise or id: 0. Send clear messages
    get().setSelectedElement({} as EwoksRFNode | EwoksRFLink);
    get().setSubgraphsStack({ id: 'initialiase', label: '' });
    get().setGraphRF(initializedGraph);
    // Is the following needed as to not get existing graphs? Better an empty array?
    get().setRecentGraphs({ graph: { id: '' } } as GraphRF, true);

    console.log(workingGraph);
    const newNodeSubgraphs = await findAllSubgraphs(
      workingGraph,
      get().recentGraphs
    );
    // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
    newNodeSubgraphs.forEach((gr) => {
      // calculate the rfNodes using the fetched subgraphs
      const rfNodes = toRFEwoksNodes(gr, newNodeSubgraphs);
      console.log('rfNodes', rfNodes, toRFEwoksLinks(gr, newNodeSubgraphs));
      get().setRecentGraphs({
        graph: gr.graph,
        nodes: rfNodes,
        links: toRFEwoksLinks(gr, newNodeSubgraphs),
      });
    });
    // 4. Calculate the new graph given the subgraphs
    console.log(workingGraph, newNodeSubgraphs);
    const grfNodes = toRFEwoksNodes(workingGraph, newNodeSubgraphs);
    const graph = {
      graph: workingGraph.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(workingGraph, newNodeSubgraphs),
    };
    console.log(grfNodes, graph, get().graphOrSubgraph, get().recentGraphs);

    console.log('ADD a new graph1');
    get().setRecentGraphs(graph as GraphRF);
    console.log('RECENT GRAPHS', get().recentGraphs);

    // set the new graph as the working graph
    get().setGraphRF(graph as GraphRF);
    get().setSelectedElement(graph.graph);
    // add the new graph to the recent graphs if not already there
    console.log('ADD the new supergraph to recent');
    get().setRecentGraphs({
      graph: workingGraph.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(workingGraph, newNodeSubgraphs),
    });
    get().setSubgraphsStack({
      id: workingGraph.graph.id,
      label: workingGraph.graph.label,
    });
    set((state) => ({
      ...state,
      workingGraph: graph,
    }));
    return graph;
  },

  graphRF: initializedGraph,

  setGraphRF: (graphRF) => {
    console.log(graphRF);
    // If missing uiProps or other fill it here
    if (!graphRF.graph.uiProps) {
      graphRF.graph.uiProps = {};
    }
    set((state) => ({
      ...state,
      graphRF,
    }));
  },

  selectedElement: {
    // id: '',
    // label: '',
    // type: '',
    // data: { label: '' },
    // position: { x: 0, y: 0 },
    // default_inputs: [],
  } as EwoksRFNode | EwoksRFLink | GraphDetails,

  // sets graphRF as well? should it?
  setSelectedElement: (element: EwoksRFNode | EwoksRFLink | GraphDetails) => {
    console.log(element, get().selectedElement);
    const wg = get().workingGraph.graph.id;
    console.log(get().graphRF, wg);
    if (wg === '0' || wg === get().graphRF.graph.id) {
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
    } else {
      get().setOpenSnackbar({
        open: true,
        text: 'Not allowed to modify sub-graphs!',
        severity: 'success',
      });
      set((state) => ({
        ...state,
        selectedElement: element,
      }));
    }
  },

  subGraph: {
    graph: { id: '', label: '', input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  } as GraphRF,

  setSubGraph: async (subGraph: GraphEwoks) => {
    // 1. input the graphEwoks from server or file-system
    console.log(subGraph);
    // 2. search for all subgraphs in it (async)
    console.log('getSubgraphs:', subGraph, get().recentGraphs);
    const newNodeSubgraphs = await findAllSubgraphs(
      subGraph,
      get().recentGraphs
    );
    // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
    newNodeSubgraphs.forEach((gr) => {
      console.log('putting in recent', gr);
      // calculate the rfNodes using the fetched subgraphs
      const rfNodes = toRFEwoksNodes(gr, newNodeSubgraphs);
      console.log('rfNodes', rfNodes, toRFEwoksLinks(gr, newNodeSubgraphs));

      get().setRecentGraphs({
        graph: gr.graph,
        nodes: rfNodes,
        links: toRFEwoksLinks(gr, newNodeSubgraphs),
      });
    });
    // 4. Calculate the new graph given the subgraphs
    const grfNodes = toRFEwoksNodes(subGraph, newNodeSubgraphs);
    const graph = {
      graph: subGraph.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(subGraph, newNodeSubgraphs),
    };
    // Adding a subgraph to an existing workingGraph:
    // save the workingGraph in the recent graphs and add a new graph node to it
    console.log('adding a subgraph:', graph, get().recentGraphs);

    let subToAdd = graph as GraphRF;

    if (get().recentGraphs.length === 0) {
      // if there is no initial graph to drop-in the subgraph -> create one? TODO?
      subToAdd = createGraph();
      get().setSubgraphsStack({
        id: subToAdd.graph.id,
        label: subToAdd.graph.label,
      });
      get().setRecentGraphs(subToAdd);
    } else {
      // TODO: if not in the recentGraphs?
      console.log(get().recentGraphs, get().graphRF);
      // subToAdd = get().recentGraphs.find(
      //   (gr) => gr.graph.id === get().graphRF.graph.id
      // );
    }
    console.log(subToAdd);
    let newNode = {} as EwoksRFNode;
    if (subToAdd) {
      const inputsSub = subToAdd.graph.input_nodes.map((input) => {
        return {
          label: `${input.id}: ${input.node} ${
            input.sub_node ? `  -> ${input.sub_node}` : ''
          }`,
          type: 'data ',
        };
      });
      const outputsSub = subToAdd.graph.output_nodes.map((input) => {
        return {
          label: `${input.id}: ${input.node} ${
            input.sub_node ? ` -> ${input.sub_node}` : ''
          }`,
          type: 'data ',
        };
      });
      let id = 0;
      let graphId = subToAdd.graph.label;
      while (get().graphRF.nodes.find((nod) => nod.id === graphId)) {
        graphId += id++;
      }
      newNode = {
        sourcePosition: 'right',
        targetPosition: 'left',
        task_generator: '',
        // TODO: ids should be unique to this graph only as a node for this subgraph
        // human readable but automatically generated?
        id: graphId,
        // TODO: can we upload a task too like a subgraph
        task_type: 'graph',
        task_identifier: subToAdd.graph.id,
        type: 'graph',
        position: { x: 100, y: 500 },
        default_inputs: [],
        inputs_complete: false,
        data: {
          exists: true,
          label: subToAdd.graph.label,
          type: 'internal',
          comment: '',
          // TODO: icon needs to be in the task and graph JSON specification
          icon: subToAdd.graph.uiProps && subToAdd.graph.uiProps.icon,
          inputs: inputsSub,
          outputs: outputsSub,
          // icon: subToAdd.data.icon ? subToAdd.data.icon : '',
        },
        // data: { label: CustomNewNode(id, name, image) },
      };

      console.log('ADD a new graph2', subToAdd, newNode);
      get().setRecentGraphs(subToAdd);
    } else {
      console.log('Couldnt locate the workingGraph in the recent');
    }
    const newWorkingGraph = {
      graph: get().graphRF.graph,
      nodes: [...get().graphRF.nodes, newNode],
      links: get().graphRF.links,
    };
    get().setGraphRF(newWorkingGraph);
    get().setRecentGraphs(newWorkingGraph);
    return graph;
  },
}));
export default useStore;
