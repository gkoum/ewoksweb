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

const { Graph } = dagre.graphlib;
const NODE_SIZE = { width: 270, height: 36 };

export const ewoksNetwork = subgraph;
// {
//   nodes: [
//     {
//       id: 'name1',
//       type: 'input',
//       task_identifier: 'module.task.SumTask1',
//       task_type: 'class',
//       inputs: { a: 1 },
//     },
//     {
//       id: 'name2',
//       type: 'default',
//       task_identifier: 'module.task.SumTask2',
//       task_type: 'generated',
//     },
//     {
//       id: 'name3',
//       type: 'output',
//       task_identifier: 'module.task.SumTask3',
//       task_type: 'graph',
//     },
//   ],
//   links: [
//     { source: 'name1', target: 'name2', arguments: { a: 'result' } },
//     { source: 'name1', target: 'name1', arguments: { a: 'result' } },
//   ],
// };
// const getPairs = (obj) => {
//   const

//   for (const [key, value] of Object.entries(obj)) {
//     console.log(`${key}: ${value}`);
//   }
// }

// A map-engine for react-flow that needs to run with every change to the UI
// Maps (ewoks -> react-flow) and (react-flow -> ewoks)
export function getNodes(): Node[] {
  return ewoksNetwork.nodes.map<Node>(
    ({ id, task_type, task_identifier, data, position }) => {
      if (task_type != 'graph') {
        return {
          id: id.toString(),
          task_type,
          task_identifier,
          type: task_type,
          data: { name: task_identifier },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          position,
        };
      } else {
        // find the subgraph it refers to
        const thisSubgraph = task_identifier.slice(0, -4);
        console.log(thisSubgraph);
        let subgraphL = { graph: { input_nodes: [], output_nodes: [] } };
        if (thisSubgraph === 'subgraph') {
          subgraphL = subgraph;
        } else if (thisSubgraph === 'subsubgraph') {
          subgraphL = subsubgraph;
        } else if (thisSubgraph === 'subsubsubgraph') {
          subgraphL = subsubsubgraph;
        }
        console.log(subgraphL);
        // get the inputs outputs of the graph
        const inputs = subgraphL.graph.input_nodes.map((alias) => {
          return {
            label: `${alias.name}: ${alias.id} ${
              alias.sub_node ? '  -> ' + alias.sub_node : ''
            }`,
            type: 'data ',
          };
        });
        const outputs = subgraphL.graph.output_nodes.map((alias) => {
          return {
            label: `${alias.name}: ${alias.id} ${
              alias.sub_node ? ' -> ' + alias.sub_node : ''
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
          data: {
            name: 'graph: ' + task_identifier,
            inputs,
            outputs,
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          position: { x: 350, y: 150 },
        };
      }
    }
  );
}

export function getEdges(): Edge[] {
  return ewoksNetwork.links.map<Edge>(({ source, target, args }) => ({
    id: `e${source}-${target}`,
    label: Object.entries(args),
    source: source.toString(),
    target: target.toString(),
  }));
}

function getNodeType(isSource: boolean, isTarget: boolean): string {
  return isSource ? (isTarget ? 'default' : 'input') : 'output';
}

export function positionNodes(nodes: Node[], edges: Edge[]): Node[] {
  const graph = new Graph();
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
