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
        const link_index = graph_links.findIndex(
          (lin) => lin.source === nod.id && lin.target === nodConnected.id
        );
        if (nodConnected.task_type === 'graph') {
          // find the link and get the sub_node it is connected to in the graph
          // TODO: find the correct input if a graph has two links to the same input
          console.log(link_index, graph_links, nodConnected, nod);
          input_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node:
              (graph_links[link_index] &&
                graph_links[link_index].data.sub_target) ||
              '',
            link_attributes: {
              conditions:
                (graph_links[link_index] &&
                  graph_links[link_index].data.conditions) ||
                [],
            },
            uiProps: {
              position: nod.position,
              linkStyle:
                (graph_links[link_index] && graph_links[link_index].type) ||
                'default',
            },
          });
          // remove link so that it gets the next
          const removed = graph_links.splice(link_index, 1);
          console.log(removed, link_index, graph_links);
        } else {
          input_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node: '',
            link_attributes: {
              conditions:
                (graph_links[link_index] &&
                  graph_links[link_index].data.conditions) ||
                [],
            },
            uiProps: {
              position: nod.position,
              linkStyle:
                (graph_links[link_index] && graph_links[link_index].type) ||
                'default',
            },
          });
        }
        console.log(input_nodes);
      });
    } else if (nod.task_type === 'graphOutput') {
      // find those nodes this OUTPUT node is connected to
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
        const link_index = graph_links.findIndex(
          (lin) => lin.target === nod.id && lin.source === nodConnected.id
        );
        if (nodConnected.task_type === 'graph') {
          // find the link and get the sub_node it is connected to in the graph
          // TODO: find the correct output if a graph has two links to the same output
          console.log(link_index, graph_links, nodConnected, nod);
          output_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node:
              (graph_links[link_index] &&
                graph_links[link_index].data.sub_source) ||
              '',
            link_attributes: {
              conditions:
                (graph_links[link_index] &&
                  graph_links[link_index].data.conditions) ||
                [],
            },
            uiProps: {
              position: nod.position,
              linkStyle:
                (graph_links[link_index] && graph_links[link_index].type) ||
                'default',
            },
          });
          graph_links.splice(link_index, 1);
        } else {
          output_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node: '',
            link_attributes: {
              conditions:
                (graph_links[link_index] &&
                  graph_links[link_index].data.conditions) ||
                [],
            },
            uiProps: {
              position: nod.position,
              linkStyle:
                (graph_links[link_index] && graph_links[link_index].type) ||
                'default',
            },
          });
        }
      });
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
