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
  GraphEwoks,
} from './types';

const { GraphDagre } = dagre.graphlib;
const NODE_SIZE = { width: 270, height: 36 };

export const ewoksNetwork = graph;

export function findGraphWithName(gname: string): Graph {
  const thisSubgraph = gname;
  console.log(thisSubgraph);
  let subgraphL = {
    graph: { id: '', input_nodes: [], output_nodes: [] },
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
  }
  return subgraphL;
}

export function rfToEwoks(tempGraph): GraphEwoks {
  console.log(tempGraph);

  return {
    graph: tempGraph.graph,
    nodes: toEwoksNodes(tempGraph.nodes),
    links: toEwoksLinks(tempGraph.links),
  };
}

// EwoksRFLinks --> EwoksLinks for saving
export function toEwoksLinks(links): EwoksLink[] {
  console.log(links);
  return links.map(
    ({
      id,
      label,
      source,
      target,
      data: { data_mapping, subtarget, subsource },
      conditions,
      on_error,
    }) => ({
      id,
      source,
      target,
      data_mapping,
      conditions,
      on_error,
      subtarget,
      subsource,
      uiProps: { label: label },
    })
  );
}

// EwoksRFNode --> EwoksNode for saving
export function toEwoksNodes(nodes): EwoksNode[] {
  console.log(nodes);

  return nodes.map(
    ({
      id,
      task_type,
      task_identifier,
      // type, exists in EwoksRFNode but is the same as task_type
      inputs_complete,
      task_generator,
      default_inputs,
      data: { label, type, icon, comment },
      sourcePosition,
      targetPosition,
      position,
    }) => {
      if (task_type != 'graph') {
        return {
          id: id.toString(),
          task_type,
          task_identifier,
          inputs_complete,
          task_generator,
          default_inputs,
          uiProps: { label, type, icon, comment, position },
        };
      } else {
        // graphs separately only if a transformation is needed???
        return {
          id: id.toString(),
          task_type,
          task_identifier,
          type: task_type,
          inputs_complete,
          task_generator,
          default_inputs,
          uiProps: { label, type, icon, comment, position },
          // inputs: inputsSub,
          // outputs: outputsSub,
          // inputsFlow,
          // inputs: inputsFlow, // for connecting graphically to different input
        };
      }
    }
  );
}

export function toRFEwoksNodes(tempGraph): EwoksRFNode[] {
  // const tempGraph = findGraphWithName(id);
  console.log(tempGraph);
  const inputsAll =
    tempGraph.graph &&
    tempGraph.graph.input_nodes &&
    tempGraph.graph.input_nodes.map((nod) => nod.id);
  const outputsAll =
    tempGraph.graph &&
    tempGraph.graph.output_nodes &&
    tempGraph.graph.output_nodes.map((nod) => nod.id);
  console.log(inputsAll, outputsAll);
  if (tempGraph.nodes) {
    return tempGraph.nodes.map(
      ({
        id,
        task_type,
        task_identifier,
        default_inputs,
        inputs_complete,
        task_generator,
        uiProps,
      }) => {
        console.log(uiProps);
        const isInput = inputsAll && inputsAll.includes(id);
        const isOutput = outputsAll && outputsAll.includes(id);
        let nodeType = '';
        if (isInput && isOutput) {
          nodeType = 'inputOutput';
        } else if (isInput) {
          nodeType = 'input';
        } else if (isOutput) {
          nodeType = 'output';
        } else {
          nodeType = 'default';
        }
        if (task_type != 'graph') {
          return {
            id: id.toString(),
            task_type,
            task_identifier,
            type: task_type,
            inputs_complete,
            task_generator,
            default_inputs,
            data: {
              label: uiProps.label ? uiProps.label : task_identifier,
              type: nodeType,
              icon: uiProps.icon,
              comment: uiProps.comment,
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
        // const inputsFlow = subgraphL.graph.input_nodes.map(
        //   (alias) => alias.name
        // );
        const outputsSub = subgraphL.graph.output_nodes.map((alias) => {
          return {
            label: `${alias.name}: ${alias.id} ${
              alias.sub_node ? ` -> ${alias.sub_node}` : ''
            }`,
            type: 'data ',
          };
        });
        console.log(default_inputs);
        return {
          id: id.toString(),
          task_type,
          task_identifier,
          type: task_type,
          inputs_complete,
          task_generator,
          default_inputs,
          data: {
            label: task_identifier,
            type: nodeType,
            inputs: inputsSub,
            outputs: outputsSub,
            // inputsFlow,
            icon: uiProps.icon,
            comment: uiProps.comment,
          },
          // inputs: inputsFlow, // for connecting graphically to different input
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          position: uiProps.position,
        };
      }
    );
  } else return [] as EwoksRFNode[];
}

export function toRFEwoksLinks(tempGraph): EwoksRFLink[] {
  // const tempGraph = findGraphWithName(id);
  console.log(tempGraph);
  if (tempGraph.links) {
    return tempGraph.links.map(
      ({
        source,
        target,
        data_mapping = [{ source_output: 'data', target_input: 'mapping' }],
        sub_target,
        sub_source,
        conditions,
        map_all_data,
      }) => ({
        id: `e${source}-${target}`,
        label: data_mapping
          .map((el) => el.source_output + '->' + el.target_input)
          .join(', '),
        source: source.toString(),
        target: target.toString(),
        data: {
          data_mapping,
          sub_target,
          sub_source,
          conditions: conditions ? conditions : [],
          map_all_data: map_all_data ? true : false,
        },
      })
    );
  } else return [] as EwoksRFLink[];
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
