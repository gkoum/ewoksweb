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
  toRFEwoksNodes,
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

function useNodeInputsOutputs(
  task_identifier: string,
  taskType: string
): nodeInputsOutputs {
  // locate the task and add required+optional-inputs + outputs
  let tempTask = {};
  const graphRF = useStore((state) => state.graphRF);
  console.log(task_identifier, taskType, graphRF);
  // For subgraph calculate through input_nodes, output_nodes
  if (taskType === 'graph') {
    // locate subgraph
    const subgraphL = getGraph(task_identifier);
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
    // const outputsSub = subgraphL.graph.output_nodes.map((output) => {
    //   return {
    //     label: `${output.name}: ${output.id} ${
    //       output.sub_node ? ` -> ${output.sub_node}` : ''
    //     }`,
    //     type: 'data ',
    //   };
    // });
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

export default useNodeInputsOutputs;
