import { Node, Edge, Position } from 'react-flow-renderer';
import { nodes as rawNodes, links as rawLinks } from './data/directed.json';
// @ts-ignore
import dagre from 'dagre';

const { Graph } = dagre.graphlib;
const NODE_SIZE = { width: 172, height: 36 };

export const ewoksNetwork = {
  nodes: [
    {
      id: 'name1',
      type: 'input',
      clas: 'module.task.SumTask1',
      inputs: { a: 1 },
    },
    { id: 'name2', type: 'output', clas: 'module.task.SumTask2' },
    { id: 'name3', type: 'output', clas: 'module.task.SumTask3' },
  ],
  links: [{ source: 'name1', target: 'name2', arguments: { a: 'result' } }],
};

export function getNodes(): Node[] {
  return ewoksNetwork.nodes.map<Node>(({ id, clas, type, inputs }) => ({
    id: id.toString(),
    data: { label: `${id} ${type} ${clas}` },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 100, y: 100 },
  }));
}

export function getEdges(): Edge[] {
  return ewoksNetwork.links.map<Edge>(({ source, target }) => ({
    id: `e${source}-${target}`,
    source: source.toString(),
    target: target.toString(),
    label: `e${source}-${target}`,
    data: { label: `e${source}-${target}` },
    position: { x: 100, y: 100 },
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
