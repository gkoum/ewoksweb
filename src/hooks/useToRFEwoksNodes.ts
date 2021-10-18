import { useState, useEffect } from 'react';
import type {
  Graph,
  EwoksNode,
  EwoksRFNode,
  EwoksLink,
  EwoksRFLink,
  GraphEwoks,
  RFNode,
  nodeInputsOutputs,
} from '../types';
import {
  toRFEwoksLinks,
  positionNodes,
  ewoksNetwork,
  getGraph,
} from '../utils';
import {
  graph,
  subgraph,
  subsubgraph,
  subsubsubgraph,
  tasks,
} from '../assets/graphTests';

import useStore from '../store';
import { Position } from 'react-flow-renderer';
import useNodeInputsOutputs from './useNodeInputsOutputs';

function useToRFEwoksNodes(tempGraph): EwoksRFNode[] {
  // const tempGraph = getGraph(id);
  console.log(tempGraph);
  const inputsAll =
    tempGraph.graph &&
    tempGraph.graph.input_nodes &&
    tempGraph.graph.input_nodes.map((nod) => nod.node);
  const outputsAll =
    tempGraph.graph &&
    tempGraph.graph.output_nodes &&
    tempGraph.graph.output_nodes.map((nod) => nod.node);
  // console.log(inputsAll, outputsAll);
  // const nod = useNodeInputsOutputs(
  //   tempGraph.nodes[0].task_identifier,
  //   tempGraph.nodes[0].task_type
  // );
  // console.log(nod);
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
        // console.log(uiProps);
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
        let tempTask = tasks.find(
          (tas) => tas.task_identifier === task_identifier
        );
        // if it is not in the tasks list like a new subgraph?
        // for subgraph calculate through input_nodes, output_nodes

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
        // console.log('TASK:', tempTask);
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
              label: uiProps && uiProps.label ? uiProps.label : task_identifier,
              type: nodeType,
              icon: uiProps && uiProps.icon,
              comment: uiProps && uiProps.comment,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            position: uiProps ? uiProps.position : { x: 100, y: 100 },
          };
        }
        const subgraphL = getGraph(task_identifier);
        // get the inputs outputs of the graph
        console.log(subgraphL, tempGraph);
        const inputsSub = subgraphL.graph.input_nodes.map((input) => {
          return {
            label: `${input.id}: ${input.node} ${
              input.sub_node ? `  -> ${input.sub_node}` : ''
            }`,
            type: 'data ',
          };
        });
        const outputsSub = subgraphL.graph.output_nodes.map((output) => {
          return {
            label: `${output.id}: ${output.node} ${
              output.sub_node ? ` -> ${output.sub_node}` : ''
            }`,
            type: 'data ',
          };
        });
        // console.log(default_inputs);
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
            icon: uiProps && uiProps.icon,
            comment: uiProps && uiProps.comment,
          },
          // inputs: inputsFlow, // for connecting graphically to different input
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          position: uiProps ? uiProps.position : { x: 100, y: 100 },
        };
      }
    );
  }
  return [] as EwoksRFNode[];
}

export default useToRFEwoksNodes;
