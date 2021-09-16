import { Node, Edge, Position } from 'react-flow-renderer';
import { nodes as rawNodes, links as rawLinks } from './data/directed.json';
// @ts-ignore
import dagre from 'dagre';
import {
  graph,
  subgraph,
  subsubgraph,
  subsubsubgraph,
} from './assets/graphTests';
import type {
  Graph,
  EwoksNode,
  EwoksRFNode,
  EwoksLink,
  EwoksRFLink,
} from './types';

const { GraphDagre } = dagre.graphlib;
const NODE_SIZE = { width: 270, height: 36 };

export const ewoksNetwork = graph;

// A map-engine for react-flow that needs to run with every change to the UI
// Maps (ewoks -> react-flow) and (react-flow -> ewoks)

// All graphs included in a given graph
const allGraphs = [graph, subgraph, subsubgraph, subsubsubgraph];

export function findGraphWithName(gname: string): Graph {
  // find the subgraph it refers to
  // const graph = allGraphs.find((gr) => {
  //   console.log(gr);
  //   return Object.keys({ gr })[0] === gname;
  // });
  const thisSubgraph = gname;
  console.log(thisSubgraph);
  let subgraphL = {
    graph: { input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  };
  if (thisSubgraph === 'graph') {
    subgraphL = graph;
  } else if (thisSubgraph === 'subgraph') {
    subgraphL = subgraph;
  } else if (thisSubgraph === 'subsubgraph') {
    subgraphL = subsubgraph;
  } else if (thisSubgraph === 'subsubsubgraph') {
    subgraphL = subsubsubgraph;
  } else {
    subgraphL = { graph: {}, nodes: [], links: [] };
  }
  // console.log(graph);
  return subgraphL;
}

// export function getSubNetwork(subNetName: string) {
//   return subNetName;
// }
export function getNodes(id: string): EwoksRFNode[] {
  const tempGraph = findGraphWithName(id);
  console.log(tempGraph);
  return tempGraph.nodes.map<EwoksNode>(
    ({
      id,
      task_type,
      task_identifier,
      inputs,
      inputs_complete,
      task_generator,
      uiProps,
    }) => {
      console.log(uiProps);
      if (task_type != 'graph') {
        return {
          id: id.toString(),
          task_type,
          task_identifier,
          type: task_type,
          inputs_complete,
          task_generator,
          data: {
            name: task_identifier,
            // id: id.toString(),
            // task_type,
            // task_identifier,
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          position: uiProps.position,
        };
      }
      const subgraphL = findGraphWithName(task_identifier);
      // get the inputs outputs of the graph
      const inputsSub = subgraphL.graph.input_nodes.map((alias) => {
        return {
          label: `${alias.name}: ${alias.id} ${
            alias.sub_node ? `  -> ${alias.sub_node}` : ''
          }`,
          type: 'data ',
        };
      });
      const inputsFlow = subgraphL.graph.input_nodes.map((alias) => alias.name);
      const outputsSub = subgraphL.graph.output_nodes.map((alias) => {
        return {
          label: `${alias.name}: ${alias.id} ${
            alias.sub_node ? ` -> ${alias.sub_node}` : ''
          }`,
          type: 'data ',
        };
      });
      console.log(inputs);
      return {
        id: id.toString(),
        task_type,
        task_identifier,
        type: task_type,
        inputs_complete,
        task_generator,
        inputs,
        data: {
          name: `graph: ${task_identifier}`,
          id: id.toString(),
          task_type,
          task_identifier,
          inputs: inputsSub,
          outputs: outputsSub,
        },
        // inputs: inputsFlow, // for connecting graphically to different input
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        position: uiProps.position,
      };
    }
  );
}

export function getLinks(id: string): EwoksRFLink[] {
  const tempGraph = findGraphWithName(id);
  console.log(tempGraph);
  return tempGraph.links.map<EwoksLink>(
    ({ source, target, data_mapping, sub_graph_nodes }) => ({
      id: `e${source}-${target}`,
      label: data_mapping
        .map((el) => el.source_output + '->' + el.target_input)
        .join(', '),
      source: source.toString(),
      target: target.toString(),
      data: { data_mapping, sub_graph_nodes },
    })
  );
}

function getNodeType(isSource: boolean, isTarget: boolean): string {
  return isSource ? (isTarget ? 'default' : 'input') : 'output';
}

export function positionNodes(nodes: Node[], edges: Edge[]): Node[] {
  const graph = new GraphDagre();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: 'LR' });

  const sourceNodes = new Set();
  const targetNodes = new Set();

  edges.forEach((e) => {
    sourceNodes.add(e.source);
    targetNodes.add(e.target);
    graph.setEdge(e.source, e.target);
  });

  nodes.forEach((n) => graph.setNode(n.id, { ...NODE_SIZE }));

  dagre.layout(graph);

  return nodes.map<Node>((node) => {
    const { id } = node;
    const { x, y } = graph.node(id);

    return {
      ...node,
      type: getNodeType(sourceNodes.has(id), targetNodes.has(id)),
      position: {
        x: x - NODE_SIZE.width / 2,
        y: y - NODE_SIZE.height / 2,
      },
    };
  });
}
