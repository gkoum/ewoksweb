import type { GraphDetails } from '../types';

export function calcGraphInputsOutputs(graph): GraphDetails {
  console.log(graph);
  const input_nodes = [];
  const output_nodes = [];
  graph.nodes.forEach((nod) => {
    if (nod.task_identifier === 'graphInput') {
      // find those nodes ItIsConnectedTo
      const nodesConnectedTo = graph.links
        .filter((link) => link.source === nod.id)
        .map((link) => link.target);
      console.log(nodesConnectedTo);

      input_nodes.push({
        id: nod.id,
        node: 'thoseItIsConnectedTo',
        sub_node: 'getInputIdFromSub',
      });
    } else if (nod.task_identifier === 'graphOutput') {
      output_nodes.push({
        id: nod.id,
        node: 'thoseItIsConnectedToOutput',
        sub_node: 'getOutputIdFromSub',
      });
    }
    // TODO: the following does not exist anymore
    // else if (nod.data.type === 'input_output') {
    // }
  });
  console.log(input_nodes, output_nodes);
  return graph.graph;
}
