// @ts-ignore
// import dagre from 'dagre';
import type {
  EwoksNode,
  EwoksRFNode,
  EwoksLink,
  EwoksRFLink,
  GraphEwoks,
  GraphRF,
  Task,
} from './types';
import axios from 'axios';
import { calcGraphInputsOutputs } from './utils/CalcGraphInputsOutputs';
import { toEwoksLinks } from './utils/toEwoksLinks';
import { toEwoksNodes } from './utils/toEwoksNodes';
// import { inNodesLinks } from './utils/inNodesLinks';
// import { outNodesLinks } from './utils/outNodesLinks';
// import { toRFEwoksNodes } from './utils/toRFEwoksNodes';

// const { GraphDagre } = dagre.graphlib;
// const NODE_SIZE = { width: 270, height: 36 };

export const ewoksNetwork = {};

export async function getWorkflows() {
  // const workflows = await axios.get('http://mxbes2-1707:38280/ewoks/workflows');
  // return workflows.data.workflows.map((work) => {
  const workflows: { data: [] } = await axios.get(
    'http://localhost:5000/workflows'
  );
  return workflows.data.map((work) => {
    return { title: work };
  });
}

const id = 'graph';
export function createGraph() {
  // server returns the basic structure of a graph
  return {
    graph: {
      id: `${id}1`,
      label: 'newGraph',
      input_nodes: [],
      output_nodes: [],
    },
    nodes: [],
    links: [],
  };
}

export async function getSubgraphs(
  graph: GraphEwoks | GraphRF,
  recentGraphs: GraphRF[]
) {
  // TODO: need to load first layer subgraphs with failsave if some not found
  const nodes: EwoksRFNode[] = graph.nodes;
  const existingNodeSubgraphs = nodes.filter(
    (nod) => nod.task_type === 'graph'
  );
  let results = [];
  if (existingNodeSubgraphs.length > 0) {
    // there are subgraphs -> first search in the recentGraphs for them
    const notInRecent = [];
    existingNodeSubgraphs.forEach((graph) => {
      if (
        recentGraphs.filter((gr) => gr.graph.id === graph.task_identifier)
          .length === 0
      ) {
        // add them in an array to request them from the server
        notInRecent.push(graph.task_identifier);
      }
    });
    results = await axios
      .all(
        notInRecent.map((id) =>
          axios.get(`http://localhost:5000/workflow/${id}`)
        )
      )
      .then(
        axios.spread((...res) => {
          // all requests are now complete in an array
          return res.map((result) => result.data);
        })
      )
      .catch((error) => {
        // remove after handling the error
        console.log('AXIOS ERROR', id, error);
      });
  }
  return results ? results : [];
}

export function rfToEwoks(tempGraph, recentGraphs): GraphEwoks {
  // calculate input_nodes-output_nodes nodes from graphInput-graphOutput
  const graph = calcGraphInputsOutputs(tempGraph);
  return {
    graph: graph,
    nodes: toEwoksNodes(tempGraph.nodes),
    links: toEwoksLinks(tempGraph.links, recentGraphs),
  };
}

// function getNodeType(isSource: boolean, isTarget: boolean): string {
//   return isSource ? (isTarget ? 'internal' : 'input') : 'output';
// }

// export function positionNodes(nodes: Node[], edges: Edge[]): Node[] {
//   const graph = new GraphDagre();
//   graph.setDefaultEdgeLabel(() => ({}));
//   graph.setGraph({ rankdir: 'LR' });

//   const sourceNodes = new Set();
//   const targetNodes = new Set();

//   edges.forEach((e) => {
//     sourceNodes.add(e.source);
//     targetNodes.add(e.target);
//     graph.setEdge(e.source, e.target);
//   });

//   nodes.forEach((n) => graph.setNode(n.id, { ...NODE_SIZE }));

//   dagre.layout(graph);

//   return nodes.map<Node>((node) => {
//     const { id } = node;
//     const { x, y } = graph.node(id);

//     return {
//       ...node,
//       type: getNodeType(sourceNodes.has(id), targetNodes.has(id)),
//       position: {
//         x: x - NODE_SIZE.width / 2,
//         y: y - NODE_SIZE.height / 2,
//       },
//     };
//   });
// }
