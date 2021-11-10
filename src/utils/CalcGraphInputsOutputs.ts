export function calcGraphInputsOutputs(graph) {
  console.log(graph);
  const newGraph = { ...graph };
  newGraph.graph.input_nodes = [];
  newGraph.graph.output_nodes = [];
  // newGraph.nodes.forEach((nod) => {
  //   if (nod.data.type === 'output') {
  //     newGraph.graph.input_nodes.push();
  //   } else if (nod.data.type === 'input') {
  //   } else if (nod.data.type === 'input_output') {
  //   }
  // });
}
