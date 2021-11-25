import type { GraphDetails } from '../types';

export function calcGraphInputsOutputs(graph): GraphDetails {
  console.log(graph);
  const graph_links = [...graph.links];
  const input_nodes = [];
  const output_nodes = [];
  graph.nodes.forEach((nod) => {
    if (nod.task_type === 'graphInput') {
      // find those nodes this INPUT node is connected to
      const nodesNamesConnectedTo = graph.links
        .filter((link) => link.source === nod.id)
        .map((link) => link.target);

      const nodeObjConnectedTo = [];
      for (let i = 0; i < nodesNamesConnectedTo.length; i++) {
        nodeObjConnectedTo.push(
          graph.nodes.find((node) => nodesNamesConnectedTo[i] === node.id)
        );
      }
      console.log(nodesNamesConnectedTo, nodeObjConnectedTo);
      // iterate the nodes to create the new input_nodes
      nodeObjConnectedTo.forEach((nodConnected) => {
        console.log(nodConnected);
        if (nodConnected.task_type === 'graph') {
          // find the link and get the sub_node it is connected to in the graph
          const link_index = graph_links.findIndex(
            (lin) => lin.source === nod.id && lin.target === nodConnected.id
          );
          // TODO: find the correct input if a graph has two links to the same input
          console.log(link_index, graph_links, nodConnected, nod);
          input_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node:
              (graph_links[link_index] &&
                graph_links[link_index].data.sub_target) ||
              '',
            uiProps: { position: nod.position },
          });
          // remove link so that it gets the next
          const removed = graph_links.splice(link_index, 1);
          console.log(removed, link_index, graph_links);
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
      const nodesNamesConnectedToEnd = graph.links
        .filter((link) => link.target === nod.id)
        .map((link) => link.source);

      const nodeObjConnectedToEnd = [];
      for (let i = 0; i < nodesNamesConnectedToEnd.length; i++) {
        nodeObjConnectedToEnd.push(
          graph.nodes.find((node) => nodesNamesConnectedToEnd[i] === node.id)
        );
      }
      console.log(nodesNamesConnectedToEnd, nodeObjConnectedToEnd);
      // iterate the nodes to create the new input_nodes
      nodeObjConnectedToEnd.forEach((nodConnected) => {
        if (nodConnected.task_type === 'graph') {
          // find the link and get the sub_node it is connected to in the graph
          const link_index = graph_links.findIndex(
            (lin) => lin.target === nod.id && lin.source === nodConnected.id
          );
          // TODO: find the correct output if a graph has two links to the same output
          console.log(link_index, graph_links, nodConnected, nod);
          output_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node:
              (graph_links[link_index] &&
                graph_links[link_index].data.sub_source) ||
              '',
            uiProps: { position: nod.position },
          });
          graph_links.splice(link_index, 1);
          console.log(link_index, graph_links);
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
  // if no position then no graphInput-Output exists so just push them back in
  graph.graph.input_nodes.forEach((nod) => {
    if (!(nod.uiProps && nod.uiProps.position)) {
      input_nodes.push(nod);
    }
  });
  graph.graph.output_nodes.forEach((nod) => {
    if (!(nod.uiProps && nod.uiProps.position)) {
      output_nodes.push(nod);
    }
  });
  return {
    id: graph.graph.id,
    label: graph.graph.label,
    input_nodes: input_nodes,
    output_nodes: output_nodes,
    uiProps: graph.graph.uiProps,
  };
}
