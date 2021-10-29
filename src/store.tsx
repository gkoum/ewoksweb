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

const nodes: EwoksRFNode[] = [];
const edges: EwoksRFLink[] = [];
console.log(nodes, edges);
// const positionedNodes = positionNodes(nodes, edges);
// console.log(positionedNodes);

const useStore = create<State>((set, get) => ({
  // updateNeeded: 0,

  // setUpdateNeeded: (num: number) => {
  //   set((state) => ({
  //     ...state,
  //     updateNeeded: get().updateNeeded + num,
  //   }));
  // },

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

  workingGraph: { graph: { id: 0 }, nodes: [], links: [] } as GraphRF,

  setWorkingGraph: async (workingGraph: GraphEwoks): Promise<GraphRF> => {
    // 1. if it is a new graph opening initialize
    console.log('initialiase');
    get().setSubgraphsStack({ id: 'initialiase', label: '' });
    get().setGraphRF({ graph: { id: 0 }, nodes: [], links: [] } as GraphRF);
    get().setRecentGraphs({ graph: { id: '' } } as GraphRF, true);

    console.log(workingGraph);
    // run the tree and find all subgraphs
    let subsToGet = [workingGraph];
    const newNodeSubgraphs = [];

    while (subsToGet.length > 0) {
      console.log('getting subgraphs for:', subsToGet[0]);
      // eslint-disable-next-line no-await-in-loop
      const allGraphSubs = await getSubgraphs(subsToGet[0], get().recentGraphs);
      console.log('allGraphSubs', allGraphSubs, subsToGet);
      allGraphSubs.forEach((gr) => newNodeSubgraphs.push(gr));
      console.log(newNodeSubgraphs);
      subsToGet.shift();
      subsToGet = [...subsToGet, ...allGraphSubs];
      console.log(subsToGet);
    }

    // Attempt to remove re-fetching the same subgraph
    // let subsToGet = [workingGraph];
    // const allSubs = new Set();
    // allSubs.add(workingGraph.graph.id);
    // const newNodeSubgraphs = [];

    // while (subsToGet.length > 0) {
    //   console.log('getting subgraphs for:', subsToGet[0]);
    //   // eslint-disable-next-line no-await-in-loop
    //   const allGraphSubs = await getSubgraphs(subsToGet[0], get().recentGraphs);
    //   console.log('allGraphSubs', allGraphSubs, subsToGet);
    //   allGraphSubs.map((gr) => gr.graph.id).forEach((gra) => allSubs.add(gra));

    //   allGraphSubs.forEach((gr) => {
    //     console.log('allSubs', allSubs, gr.graph.id);
    //     if (!allSubs.has(gr.graph.id)) {
    //       newNodeSubgraphs.push(gr);
    //     }
    //   });
    //   console.log(newNodeSubgraphs);
    //   subsToGet.shift();
    //   subsToGet = [...subsToGet, ...allGraphSubs];
    //   console.log(subsToGet);
    // }

    // 2. search for  1st layer subgraphs in it (async)
    // console.log('getSubgraphs:', workingGraph, get().recentGraphs);
    // const newNodeSubgraphs = await getSubgraphs(
    //   workingGraph,
    //   get().recentGraphs
    // );

    // const newNodeSubgraphs2 = [];
    // newNodeSubgraphs.forEach(async (sub) => {
    //   const subgraph = await getSubgraphs(sub, get().recentGraphs);
    //   console.log(subgraph);
    //   if (subgraph) {
    //     newNodeSubgraphs2.push(subgraph.data);
    //   }
    // });

    // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
    newNodeSubgraphs.forEach((gr) => {
      console.log('putting newNodeSubgraph in recent', gr);
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

  graphRF: { graph: { id: 0 }, nodes: [], links: [] } as GraphRF,

  setGraphRF: (graphRF) => {
    console.log(graphRF);
    set((state) => ({
      ...state,
      graphRF,
    }));
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

  subGraph: {
    graph: { id: '', label: '', input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  } as GraphRF,

  setSubGraph: async (subGraph: GraphRF) => {
    // 1. input the graphEwoks from server or file-system
    console.log(subGraph);
    // 2. search for subgraphs in it (async)
    console.log('getSubgraphs:', subGraph, get().recentGraphs);
    const newNodeSubgraphs = await getSubgraphs(subGraph, get().recentGraphs);
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
    let workingGraph = {} as GraphRF;
    if (get().recentGraphs.length === 0) {
      // if there is no initial graph to drop-in the subgraph -> create one? TODO?
      workingGraph = createGraph();
      get().setSubgraphsStack({
        id: workingGraph.graph.id,
        label: workingGraph.graph.label,
      });
      get().setRecentGraphs(workingGraph);
    } else {
      // TODO: if not in the recentGraphs?
      console.log(get().recentGraphs, get().graphRF);
      workingGraph = get().recentGraphs.find(
        (gr) => gr.graph.id === get().graphRF.graph.id
      );
    }
    console.log(workingGraph);
    if (workingGraph) {
      const inputsSub = workingGraph.graph.input_nodes.map((input) => {
        return {
          label: `${input.id}: ${input.node} ${
            input.sub_node ? `  -> ${input.sub_node}` : ''
          }`,
          type: 'data ',
        };
      });
      const outputsSub = workingGraph.graph.output_nodes.map((input) => {
        return {
          label: `${input.id}: ${input.node} ${
            input.sub_node ? ` -> ${input.sub_node}` : ''
          }`,
          type: 'data ',
        };
      });
      let id = 0;
      let graphId = workingGraph.graph.label;
      while (get().graphRF.nodes.find((nod) => nod.id === graphId)) {
        graphId += id++;
      }
      const newNode = {
        sourcePosition: 'right',
        targetPosition: 'left',
        task_generator: '',
        // TODO: ids should be unique to this graph only as a node for this subgraph
        // human readable but automatically generated?
        id: graphId,
        // TODO: can we upload a task too like a subgraph
        task_type: 'graph',
        task_identifier: workingGraph.graph.id,
        type: 'graph',
        position: { x: 100, y: 500 },
        default_inputs: [],
        inputs_complete: false,
        data: {
          exists: true,
          label: workingGraph.graph.label,
          type: 'internal',
          comment: '',
          // TODO: icon needs to be in the task and graph JSON specification
          icon: workingGraph.graph.uiProps && workingGraph.graph.uiProps.icon,
          inputs: inputsSub,
          outputs: outputsSub,
          // icon: workingGraph.data.icon ? workingGraph.data.icon : '',
        },
        // data: { label: CustomNewNode(id, name, image) },
      };
      console.log(newNode, workingGraph);
      workingGraph.nodes.push(newNode);
      console.log('ADD a new graph2', workingGraph);
      get().setRecentGraphs(workingGraph);
    } else {
      console.log('Couldnt locate the workingGraph in the recent');
    }
    get().setGraphRF(graph as GraphRF);
    return graph;
  },
}));
export default useStore;
