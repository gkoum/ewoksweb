import { Node, Edge, Position } from 'react-flow-renderer';
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
  nodeInputsOutputs,
  GraphRF,
} from './types';
import axios from 'axios';

const { GraphDagre } = dagre.graphlib;
const NODE_SIZE = { width: 270, height: 36 };

export const ewoksNetwork = graph;

// this will get graphs from the server async after checking the recentGraphs
export async function getGraph(
  byTaskIdentifier: string,
  fromWeb: boolean
): Graph {
  let subgraphL = {
    graph: { id: '', input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  };
  if (fromWeb) {
    await axios
      .get(
        'http://mxbes2-1707:38280/ewoks/workflow/CommonPrepareExperiment.json'
      )
      .then((response) => {
        console.log(response.data);
        subgraphL = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    const thisSubgraph = byTaskIdentifier;
    console.log(thisSubgraph);
    if (thisSubgraph === 'graph') {
      subgraphL = graph;
    } else if (thisSubgraph === 'subgraph1') {
      subgraphL = subgraph;
    } else if (thisSubgraph === 'subsubgraph1') {
      // subgraphL = subsubgraph;
    } else if (thisSubgraph === 'subsubsubgraph1') {
      subgraphL = subsubsubgraph;
    }
  }
  return subgraphL;
}

const id = 'graph';
export function createGraph() {
  // server returns the basic structure of a graph
  return {
    graph: {
      id: id + '1',
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
  console.log(graph, recentGraphs);
  // TODO: need to load first layer subgraphs with failsave if some not found
  const existingNodeSubgraphs = graph.nodes.filter(
    (nod) => nod.task_type === 'graph'
  );
  console.log(existingNodeSubgraphs);
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
        console.log('not in recent', graph.task_identifier);
        notInRecent.push(graph.task_identifier);
      }
    });
    console.log(notInRecent);
    results = await axios
      .all(
        notInRecent.map((id) =>
          axios.get('http://mxbes2-1707:38280/ewoks/workflow/' + id)
        )
      )
      .then(
        axios.spread(function (...res) {
          // all requests are now complete in an array
          console.log(res);
          return res.map((result) => result.data);
        })
      );
  }
  return results;
}

export function rfToEwoks(tempGraph): GraphEwoks {
  // console.log(tempGraph);

  return {
    graph: tempGraph.graph,
    nodes: toEwoksNodes(tempGraph.nodes),
    links: toEwoksLinks(tempGraph.links),
  };
}

// EwoksRFLinks --> EwoksLinks for saving
export function toEwoksLinks(links): EwoksLink[] {
  // console.log(links);
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
  // console.log(nodes);

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
        // type: task_type,
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

export function calcNodeInputsOutputs(
  // TODO
  task_identifier: string,
  taskType: string,
  recentGraphs: GraphRF[]
): nodeInputsOutputs {
  // locate the task and add required+optional-inputs + outputs
  let tempTask = {};
  console.log(task_identifier, taskType, recentGraphs);
  // For subgraph calculate through input_nodes, output_nodes
  if (taskType === 'graph') {
    // locate subgraph
    let subgraphL = getGraph(task_identifier, true);
    subgraphL = subgraphL.then((res) => res);
    // get inputs-outputs from each subnode connected to each input and map to nodeInOut
    console.log(subgraphL);
    const inputsSub = subgraphL.graph.input_nodes.map((input) => {
      const nodeSubgraph = subgraphL.nodes.find((nod) => nod.id === input.node);
      return {
        optional_input_names: nodeSubgraph.optional_input_names,
        output_names: [],
        required_input_names: [],
      };
    });
  } else if (tempTask) {
    // If a know task get inputs-outputs
    tempTask = tasks.find((tas) => tas.task_identifier === task_identifier);
    return tempTask;
  }
  tempTask = tempTask
    ? tempTask
    : task_type === 'graph'
    ? tempTask // calculate inputs-outputs from subgraph
    : // will it have the subgraph from the beggining? NO.
      // Needs to handle it until it get it
      {
        optional_input_names: [],
        output_names: [],
        required_input_names: [],
      };
  return tempTask;
}

// Accepts a GraphEwoks and returns an EwoksRFNode[]
export function toRFEwoksNodes(tempGraph, newNodeSubgraphs): EwoksRFNode[] {
  console.log('calc nodes:', tempGraph, newNodeSubgraphs);
  // Find input and output nodes of the graph
  const inputsAll =
    tempGraph.graph &&
    tempGraph.graph.input_nodes &&
    tempGraph.graph.input_nodes.map((nod) => nod.node);
  const outputsAll =
    tempGraph.graph &&
    tempGraph.graph.output_nodes &&
    tempGraph.graph.output_nodes.map((nod) => nod.node);
  // console.log(inputsAll, outputsAll);
  if (tempGraph.nodes) {
    return tempGraph.nodes.map(
      ({
        id,
        task_type,
        task_identifier,
        label,
        default_inputs,
        inputs_complete,
        task_generator,
        uiProps,
      }) => {
        // calculate if node input and/or output or internal
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
        // if map all values is the link no calculation is needed? How to get the link?
        let tempTask = tasks.find(
          (tas) => tas.task_identifier === task_identifier
        );
        console.log(task_type, tempTask, nodeType);
        // if it is not in the tasks list like a new task or subgraph?
        // Not in the list => add a default one FAILSAFE TODO
        console.log('found Task and go for inputs-outputs');
        // for subgraph calculate through input_nodes, output_nodes
        tempTask = tempTask
          ? tempTask // if you found the Task return it
          : task_type === 'graph' // if not found check if it is a graph
          ? tempTask // if a graph return it and if not add some default inputs-outputs
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
            type: task_type, // need it for visualizing dataNodes
            inputs_complete,
            task_generator,
            default_inputs,
            optional_input_names: tempTask.optional_input_names,
            output_names: tempTask.output_names,
            required_input_names: tempTask.required_input_names,
            label,
            data: {
              label: label ? label : task_identifier,
              type: nodeType,
              icon: uiProps.icon,
              comment: uiProps.comment,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            position: uiProps.position,
          };
        }
        // if node=subgraph calculate inputs-outputs from subgraph.graph
        const subgraphNode = newNodeSubgraphs.find(
          (subGr) => subGr.graph.id === task_identifier
        );
        console.log(task_identifier, subgraphNode, newNodeSubgraphs);
        let inputsSub = [];
        let outputsSub = [];
        if (subgraphNode.graph.id) {
          inputsSub = subgraphNode.graph.input_nodes.map((input) => {
            return {
              label: `${input.id}: ${input.node} ${
                input.sub_node ? `  -> ${input.sub_node}` : ''
              }`,
              type: 'data ',
            };
          });
          outputsSub = subgraphNode.graph.output_nodes.map((output) => {
            return {
              label: `${output.id}: ${output.node} ${
                output.sub_node ? ` -> ${output.sub_node}` : ''
              }`,
              type: 'data ',
            };
          });
        } else {
          inputsSub = [{ label: 'unknown_input', type: 'data' }];
          outputsSub = [{ label: 'unknown_output', type: 'data' }];
        }

        // console.log(default_inputs);
        return {
          id: id.toString(),
          task_type,
          task_identifier,
          type: task_type,
          inputs_complete,
          task_generator,
          default_inputs,
          label,
          data: {
            label,
            type: nodeType,
            exists: !!subgraphNode.graph.id,
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

// Accepts a GraphEwoks and returns an EwoksRFLink[]
export function toRFEwoksLinks(tempGraph, newNodeSubgraphs): EwoksRFLink[] {
  // const tempGraph = getGraph(id);
  console.log(tempGraph, newNodeSubgraphs);
  if (tempGraph.links) {
    return tempGraph.links.map(
      ({
        source,
        target,
        data_mapping = [{ source_output: '', target_input: '' }],
        sub_target,
        sub_source,
        conditions,
        map_all_data,
      }) => {
        // find the outputs-inputs from the connected nodes
        const sourceTmp = tempGraph.nodes.find((nod) => nod.id === source);
        const targetTmp = tempGraph.nodes.find((nod) => nod.id === target);
        // console.log('TASKSTMP:', sourceTmp, targetTmp);
        let sourceTask = {};
        let targetTask = {};
        if (sourceTmp.task_type !== 'graph') {
          // TODO: if a task find it in tasks. IF NOT THERE?
          sourceTask = tasks.find(
            (tas) => tas.task_identifier === sourceTmp.task_identifier
          );
        } else {
          // TODO following line examine
          // if node=subgraph calculate inputs-outputs from subgraph.graph
          const subgraphNodeSource = newNodeSubgraphs.find(
            (subGr) => subGr.graph.id === sourceTmp.task_identifier
          );
          console.log(sourceTmp, subgraphNodeSource, newNodeSubgraphs);

          // const subgraphL = getGraph(sourceTmp.task_identifier, false);
          const outputs = [];
          subgraphNodeSource.graph.output_nodes.forEach((out) =>
            outputs.push(out.id)
          );
          sourceTask = {
            task_type: sourceTmp.task_type,
            task_identifier: sourceTmp.task_identifier,
            // optional_input_names: sourceTmp.optional_input_names,
            output_names: outputs,
            // required_input_names: sourceTask.required_input_names,
          };
        }
        console.log(targetTmp, newNodeSubgraphs);
        if (targetTmp.task_type !== 'graph') {
          // TODO: if a task find it in tasks. IF NOT THERE?
          targetTask = tasks.find(
            (tas) => tas.task_identifier === targetTmp.task_identifier
          );
        } else {
          // TODO following line examine
          const subgraphNodeTarget = newNodeSubgraphs.find(
            (subGr) => subGr.graph.id === targetTmp.task_identifier
          );
          console.log(targetTmp.task_identifier, subgraphNodeTarget);

          console.log(targetTmp.task_identifier, subgraphNodeTarget);
          const inputs = [];
          subgraphNodeTarget.graph.input_nodes.forEach((inp) =>
            inputs.push(inp.id)
          );

          targetTask = {
            task_type: targetTmp.task_type,
            task_identifier: targetTmp.task_identifier,
            optional_input_names: inputs,
            required_input_names: [],
          };

          console.log(targetTmp.task_identifier, subgraphNodeTarget);
        }
        // console.log('TASKS1:', sourceTask, targetTask);
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
        // console.log('TASKS2:', sourceTask, targetTask, data_mapping);
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
