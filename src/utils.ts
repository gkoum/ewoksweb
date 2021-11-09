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
import { TurnedIn } from '@material-ui/icons';

const { GraphDagre } = dagre.graphlib;
const NODE_SIZE = { width: 270, height: 36 };

export const ewoksNetwork = graph;

export async function getWorkflows() {
  const workflows = await axios.get('http://mxbes2-1707:38280/ewoks/workflows');
  // 'http://localhost:5000/workflows/'); // 'http://mxbes2-1707:38280/ewoks/workflows');
  console.log(workflows.data.workflows);
  return workflows.data.workflows.map((work) => {
    return { title: work };
  });
}

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
          axios.get(`http://mxbes2-1707:38280/ewoks/workflow/${id}`)
        )
      )
      .then(
        axios.spread((...res) => {
          // all requests are now complete in an array
          console.log('AXIOS OK', res);
          return res.map((result) => result.data);
        })
      )
      .catch((error) => {
        console.log('AXIOS ERROR', id, error);
      });
    console.log('AXIOS', results);
  }
  return results ? results : [];
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
  // TODO: when input-arrow fake nodes exist remove their links to get an Ewoks description
  const tempLinks: EwoksRFNode[] = [...links].filter((link) => !link.startEnd);
  return links.map(
    ({
      label,
      source,
      sourceHandle,
      target,
      targetHandle,
      data: { data_mapping, sub_target, sub_source, map_all_data, conditions },
      on_error,
      type,
      arrowHeadType,
      labelStyle,
      animated,
    }) => ({
      source,
      target,
      data_mapping,
      conditions,
      on_error,
      sub_target,
      sub_source,
      map_all_data,
      uiProps: {
        label,
        type,
        arrowHeadType,
        labelStyle,
        animated,
        sourceHandle,
        targetHandle,
      },
    })
  );
}

// EwoksRFNode --> EwoksNode for saving
export function toEwoksNodes(nodes: EwoksRFNode[]): EwoksNode[] {
  // TODO: when input-arrow fake nodes exist remove them to get an Ewoks description
  const tempNodes: EwoksRFNode[] = [...nodes].filter(
    (nod) => nod.task_identifier !== 'Start-End'
  );
  return tempNodes.map(
    ({
      id,
      task_type,
      task_identifier,
      // type, exists in EwoksRFNode but is the same as task_type
      inputs_complete,
      task_generator,
      default_inputs,
      data: { label, type, icon, comment },
      position,
    }) => {
      if (task_type != 'graph') {
        return {
          id: id.toString(),
          label,
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

function inNodesLinks(graph) {
  const inputs = { nodes: [], links: [] };
  if (
    graph.graph &&
    graph.graph.input_nodes &&
    graph.graph.input_nodes.length > 0
  ) {
    graph.graph.input_nodes.forEach((inNod) => {
      if (inNod.uiProps && inNod.uiProps.position) {
        inputs.nodes.push({
          id: inNod.id,
          label: inNod.id,
          task_type: 'inout',
          task_identifier: 'Start-End',
          uiProps: {
            type: 'input',
            position: inNod.uiProps.position,
            icon: 'arrow1',
          },
        });
        inputs.links.push({
          startEnd: true,
          source: inNod.id,
          target: inNod.node,
          uiProps: {
            type: 'default',
            arrowHeadType: 'arrow',
          },
        });
      }
    });
  }
  return inputs;
}

function outNodesLinks(graph) {
  const outputs = { nodes: [], links: [] };
  if (
    graph.graph &&
    graph.graph.output_nodes &&
    graph.graph.output_nodes.length > 0
  ) {
    graph.graph.output_nodes.forEach((outNod) => {
      if (outNod.uiProps && outNod.uiProps.position) {
        outputs.nodes.push({
          id: outNod.id,
          label: outNod.id,
          task_type: 'inout',
          task_identifier: 'Start-End',
          uiProps: {
            type: 'output',
            position: outNod.uiProps.position,
            icon: 'arrow1',
          },
        });
        outputs.links.push({
          startEnd: true,
          source: outNod.node,
          target: outNod.id,
          uiProps: {
            type: 'default',
            arrowHeadType: 'arrow',
          },
        });
      }
    });
  }
  return outputs;
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
  const inNodeLinks = inNodesLinks(tempGraph);
  const outNodeLinks = outNodesLinks(tempGraph);

  const inOutTempGraph = { ...tempGraph };
  if (inNodeLinks.nodes.length > 0) {
    inOutTempGraph.nodes = [...inOutTempGraph.nodes, ...inNodeLinks.nodes];
  }
  if (outNodeLinks.nodes.length > 0) {
    inOutTempGraph.nodes = [...inOutTempGraph.nodes, ...outNodeLinks.nodes];
  }

  if (inOutTempGraph.nodes) {
    console.log(inOutTempGraph);
    return inOutTempGraph.nodes.map(
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
        } else if (task_type === 'inout') {
          nodeType = 'inout';
        } else {
          nodeType = 'internal';
        }

        // locate the task and add required+optional-inputs + outputs
        // if map all values is the link no calculation is needed? How to get the link?
        let tempTask = tasks.find(
          (tas) => tas.task_identifier === task_identifier
        );
        console.log(task_type, tempTask, nodeType, task_identifier);
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
            // TODO: style directly applies to node and should be saved in ui props
            // style: {
            //   background: '#D6D5E6',
            //   color: '#333',
            //   // border: '1px solid #222138',
            //   // width: 180,
            // },
            data: {
              label: label ? label : task_identifier,
              type: nodeType,
              icon: uiProps && uiProps.icon,
              comment: uiProps && uiProps.comment,
            },
            position:
              uiProps && uiProps.position
                ? uiProps.position
                : { x: 100, y: 100 },
          };
        }
        // if node=subgraph calculate inputs-outputs from subgraph.graph
        const subgraphNode = newNodeSubgraphs.find(
          (subGr) => subGr.graph.id === task_identifier
        );
        console.log(task_identifier, subgraphNode, newNodeSubgraphs);
        let inputsSub = [];
        let outputsSub = [];
        if (subgraphNode && subgraphNode.graph.id) {
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
            label: label ? label : task_identifier,
            type: nodeType,
            exists: subgraphNode && !!subgraphNode.graph.id,
            inputs: inputsSub,
            outputs: outputsSub,
            // inputsFlow,
            icon: uiProps.icon,
            comment: uiProps.comment,
          },
          // inputs: inputsFlow, // for connecting graphically to different input
          position: uiProps.position,
        };
      }
    );
  }
  return [] as EwoksRFNode[];
}

// Accepts a GraphEwoks and returns an EwoksRFLink[]
export function toRFEwoksLinks(tempGraph, newNodeSubgraphs): EwoksRFLink[] {
  // tempGraph: the graph to transform its links
  // newNodeSubgraphs: the subgraphs located in the supergraph.
  // If wrong task_identifier or non-existing graph tempGraph is not in there
  console.log(tempGraph, newNodeSubgraphs);

  const inNodeLinks = inNodesLinks(tempGraph);
  const outNodeLinks = outNodesLinks(tempGraph);

  const inOutTempGraph = { ...tempGraph };
  if (inNodeLinks.links.length > 0) {
    inOutTempGraph.links = [...inOutTempGraph.links, ...inNodeLinks.links];
  }
  if (outNodeLinks.links.length > 0) {
    inOutTempGraph.links = [...inOutTempGraph.links, ...outNodeLinks.links];
  }

  if (inOutTempGraph.links) {
    return inOutTempGraph.links.map(
      ({
        source,
        target,
        data_mapping = [], // { source_output: '', target_input: '' }
        sub_target,
        sub_source,
        on_error,
        conditions,
        map_all_data,
        uiProps,
      }) => {
        console.log(source, target);
        // find the outputs-inputs from the connected nodes
        const sourceTmp = tempGraph.nodes.find((nod) => nod.id === source);
        const targetTmp = tempGraph.nodes.find((nod) => nod.id === target);
        // if undefined source or/and target node does not exist

        console.log('TASKSTMP:', sourceTmp, targetTmp);
        let sourceTask = {};
        let targetTask = {};
        if (sourceTmp) {
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

            if (subgraphNodeSource) {
              subgraphNodeSource.graph.output_nodes.forEach((out) =>
                outputs.push(out.id)
              );
            }
            sourceTask = {
              task_type: sourceTmp.task_type,
              task_identifier: sourceTmp.task_identifier,
              // optional_input_names: sourceTmp.optional_input_names,
              output_names: outputs,
              // required_input_names: sourceTask.required_input_names,
            };
          }
        }
        console.log(targetTmp, newNodeSubgraphs);
        if (targetTmp) {
          if (targetTmp.task_type !== 'graph') {
            // TODO: if a task find it in tasks. IF NOT THERE? add a default?
            targetTask = tasks.find(
              (tas) => tas.task_identifier === targetTmp.task_identifier
            );
          } else {
            // TODO following line examine
            const subgraphNodeTarget = newNodeSubgraphs.find(
              (subGr) => subGr.graph.id === targetTmp.task_identifier
            );
            // if subgraphNodeTarget undefined = not fount
            const inputs = [];
            if (subgraphNodeTarget) {
              subgraphNodeTarget.graph.input_nodes.forEach((inp) =>
                inputs.push(inp.id)
              );
            }

            targetTask = {
              task_type: targetTmp.task_type,
              task_identifier: targetTmp.task_identifier,
              optional_input_names: inputs,
              required_input_names: [],
            };
          }
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
          label:
            uiProps && uiProps.label
              ? uiProps.label
              : data_mapping.length > 0
              ? data_mapping
                  .map((el) => `${el.source_output}->${el.target_input}`)
                  .join(', ')
              : '...',
          source: source.toString(),
          target: target.toString(),
          on_error,
          targetHandle: uiProps && uiProps.targetHandle,
          sourceHandle: uiProps && uiProps.sourceHandle,
          type: uiProps && uiProps.type ? uiProps.type : '',
          arrowHeadType:
            uiProps && uiProps.arrowHeadType ? uiProps.arrowHeadType : '',
          // labelStyle: uiProps && uiProps.labelStyle ? uiProps.labelStyle : {},
          animated: uiProps && uiProps.animated ? uiProps.animated : '',
          style: { stroke: '#96a5f9', strokeWidth: '2.5' },
          labelBgStyle: {
            fill: '#fff',
            color: 'rgb(50, 130, 219)',
            fillOpacity: 0.7,
          },
          labelStyle: { fill: 'blue', fontWeight: 500, fontSize: 14 },
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
