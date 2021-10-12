import { Node, Edge, Position } from 'react-flow-renderer';
import { nodes as rawNodes, links as rawLinks } from './data/directed.json';
// @ts-ignore
import dagre from 'dagre';
import {
  graph,
  subgraph,
  subsubgraph,
  subsubsubgraph,
  tasks,
} from './assets/graphTests';
import type {
  Graph,
  EwoksNode,
  EwoksRFNode,
  EwoksLink,
  EwoksRFLink,
  GraphEwoks,
  RFNode,
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
      uiProps: { label },
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
      }
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
  );
}

// gets an RfNode finds the RFEwoksNode and updates it in graphRF
// export function RFtoRFEwoksNode(rfNode: RFNode): EwoksRFNode[] {
//   console.log(rfNode);
//   const RFEwoksNode = .find((el) => el.id === element.id);
//   return {
//     id: rfNode.id.toString(),
//     task_type: rfNode,
//     task_identifier,
//     type: task_type,
//     inputs_complete,
//     task_generator,
//     default_inputs,
//     data: {
//       label: uiProps.label ? uiProps.label : task_identifier,
//       type: nodeType,
//       icon: uiProps.icon,
//       comment: uiProps.comment,
//     },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     position: uiProps.position,
//   };
// }

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
          nodeType = 'input_output';
        } else if (isInput) {
          nodeType = 'input';
        } else if (isOutput) {
          nodeType = 'output';
        } else {
          nodeType = 'internal';
        }
        // locate the task and add required+optional-inputs + outputs
        console.log('TASKS:', tasks);
        let tempTask = tasks.find(
          (tas) => tas.task_identifier === task_identifier
        );
        // if not found app does not break, put an empty skeleton
        tempTask = tempTask
          ? tempTask
          : {
              optional_input_names: [],
              output_names: [],
              required_input_names: [],
            };
        console.log('TASK:', tempTask);
        if (task_type != 'graph') {
          return {
            id: id.toString(),
            task_type,
            task_identifier,
            type: task_type,
            inputs_complete,
            task_generator,
            default_inputs,
            optional_input_names: tempTask.optional_input_names,
            output_names: tempTask.output_names,
            required_input_names: tempTask.required_input_names,
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
  }
  return [] as EwoksRFNode[];
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
      }) => {
        // find the outputs-inputs from the connected nodes
        const sourceTmp = tempGraph.nodes.find((nod) => nod.id === source);
        const targetTmp = tempGraph.nodes.find((nod) => nod.id === target);
        console.log('TASKSTMP:', sourceTmp, targetTmp);
        let sourceTask = {};
        let targetTask = {};
        if (sourceTmp.task_type !== 'graph') {
          sourceTask = tasks.find(
            (tas) => tas.task_identifier === sourceTmp.task_identifier
          );
        } else {
          const subgraphL = findGraphWithName(sourceTmp.task_identifier);
          const outputs = [];
          subgraphL.graph.output_nodes.forEach((out) => outputs.push(out.name));

          sourceTask = {
            task_type: sourceTmp.task_type,
            task_identifier: sourceTmp.task_identifier,
            // optional_input_names: sourceTmp.optional_input_names,
            output_names: outputs,
            // required_input_names: sourceTask.required_input_names,
          };
        }
        if (targetTmp.task_type !== 'graph') {
          targetTask = tasks.find(
            (tas) => tas.task_identifier === targetTmp.task_identifier
          );
        } else {
          const subgraphL = findGraphWithName(targetTmp.task_identifier);
          const inputs = [];
          subgraphL.graph.input_nodes.forEach((inp) => inputs.push(inp.name));

          targetTask = {
            task_type: targetTmp.task_type,
            task_identifier: targetTmp.task_identifier,
            optional_input_names: inputs,
            required_input_names: [],
          };
        }
        console.log('TASKS1:', sourceTask, targetTask);
        // if not found app does not break, put an empty skeleton
        sourceTask = sourceTask
          ? sourceTask
          : {
              output_names: [],
            };
        targetTask = targetTask
          ? targetTask
          : {
              optional_input_names: [],
              required_input_names: [],
            };
        console.log('TASKS2:', sourceTask, targetTask, data_mapping);
        return {
          id: `e${source}-${target}`,
          // if label exists in uiProps? And general transformation of data...
          // Label if empty use data-mapping
          label: data_mapping
            .map((el) => `${el.source_output}->${el.target_input}`)
            .join(', '),
          source: source.toString(),
          target: target.toString(),
          data: {
            // node optional_input_names are link's optional_output_names
            links_optional_output_names: targetTask.optional_input_names,
            // node required_input_names are link's required_output_names
            links_required_output_names: targetTask.required_input_names,
            // node output_names are link's input_names
            links_input_names: sourceTask.output_names,

            data_mapping,
            sub_target,
            sub_source,
            conditions: conditions ? conditions : [],
            map_all_data: !!map_all_data,
          },
        };
      }
    );
  }
  return [] as EwoksRFLink[];
}

function getNodeType(isSource: boolean, isTarget: boolean): string {
  return isSource ? (isTarget ? 'internal' : 'input') : 'output';
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
