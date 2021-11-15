import type { GraphDetails } from '../types';

export function calcGraphInputsOutputs(graph): GraphDetails {
  console.log(graph);
  const input_nodes = [];
  const output_nodes = [];
  graph.nodes.forEach((nod) => {
    if (nod.task_type === 'graphInput') {
      // find those nodes ItIsConnectedTo
      const nodesConnectedTo = graph.links
        .filter((link) => link.source === nod.id)
        .map((link) => link.target);
      console.log(nodesConnectedTo);
      const nodeObjConnectedTo = graph.nodes.filter((node) =>
        nodesConnectedTo.includes(node.id)
      );
      console.log(nodeObjConnectedTo);
      nodeObjConnectedTo.forEach((nodConnected) => {
        console.log(nodConnected);
        if (nodConnected.task_type === 'graph') {
          input_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node: nodConnected.id, // TODO: subgraph exact input ex 'In'
            uiProps: { position: nod.position },
          });
        } else {
          input_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node: '',
            uiProps: { position: nod.position },
          });
        }
      });
    } else if (nod.task_type === 'graphOutput') {
      // find those nodes ItIsConnectedTo
      const nodesConnectedToEnd = graph.links
        .filter((link) => link.target === nod.id)
        .map((link) => link.source);
      console.log(nodesConnectedToEnd);
      const nodeObjConnectedToEnd = graph.nodes.filter((node) =>
        nodesConnectedToEnd.includes(node.id)
      );
      console.log(nodeObjConnectedToEnd);
      nodeObjConnectedToEnd.forEach((nodConnected) => {
        console.log(nodConnected);
        if (nodConnected.task_type === 'graph') {
          output_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node: nodConnected.id, // graph.output_nodes[0].id, // TODO: find the correct output
            uiProps: { position: nod.position },
          });
        } else {
          output_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node: '',
            uiProps: { position: nod.position },
          });
        }
      });
    }
    // TODO: the following does not exist anymore
    // else if (nod.data.type === 'input_output') {
    // }
  });
  console.log(graph, input_nodes, output_nodes);
  return {
    id: graph.graph.id,
    label: graph.graph.label,
    input_nodes: input_nodes,
    output_nodes: output_nodes,
    uiProps: graph.graph.uiProps,
  };
}
