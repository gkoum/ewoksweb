const nodes = {
  id: '',
  type: 'class, method, graph ...', // must be clear and draw conclusions from both key and value of a dictionary,
  name: 'the class or method... name',
  // graphMap: [{}],
  inputs: [{}], // all inputs including static seem to semantically belong to a node and not use links to know them,
  outputs: [{}], // all'
  inputs_complete: '?',
  task_generator: '',
  // -- visual additions
  graph: {
    position: 'in the diagram',
    nodeType: 'input, output, middle, custom: {properties }',
    customProps: { prop1: 1 },
    style: 'css properties',
  },
};

const links = [
  {
    source: 'Prepare trouble shooting',
    target: 'CommonPrepareExperiment',
    links: [
      {
        source: 'Prepare trouble shooting',
        target: 'In',
        all_arguments: true,
      },
    ],
  },
  {
    source: 'CommonPrepareExperiment',
    target: 'Check move of phi',
    links: [
      {
        source: 'Out',
        target: 'Check move of phi',
        all_arguments: true,
      },
    ],
  },
];

// I would leave the node take care of the subgraph it includes and the "links inside a links" structure
// you have an input to node that needs to be mapped to an input to 1 or more nodes in the subgraph
// inputs: {key1: value1, key2:  value2} mapping [[key1, subNode1], [key2, subNode2]]
