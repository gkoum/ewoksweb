// https://docs.google.com/document/d/1kGRwyrPJQfpx9xUND6Epei2oa71rXeWRZ3owRDglVHk/edit#heading=h.1p7naowyrq09
// https://confluence.esrf.fr/pages/viewpage.action?spaceKey=AAWWK&title=Automation+and+Analysis+Workflows
// https://confluence.esrf.fr/display/AAWWK/Zocalo
// https://discourse.jupyter.org/t/tool-for-notebook-workflows/3764
// https://gitlab.esrf.fr/denolf/workflow_concepts/-/blob/master/doc/workflows_meeting_march2021.pdf

const nodes = {
  id: '',
  type: 'class, method, graph ...', // must be clear and draw conclusions from both key and value of a dictionary,
  name: 'the class or method... name',
  inputs: [{}], // all inputs including static seem to semantically belong to a node and not use links to know them,
  outputs: [{}], // all'
  inputs_complete: '?',
  task_generator: '',
  // -- visual additions
  graphical_params: {
    position: 'in the diagram',
    nodeType: 'input, output, middle, custom: {has_properties }',
    customProps: { prop1: 1 },
    style: 'css properties',
  },
};

// I would leave the node take care of the subgraph it includes and the "links inside a links" structure
// you have an input to node that needs to be mapped to an input to 1 or more nodes in the subgraph
// inputs: {key1: value1, key2:  value2} mapping [[key1, subNode1], [key2, subNode2]]

const upperGraph = {
  directed: true,
  graph: { name: 'TroubleShooting' },
  multigraph: false,
  nodes: [
    {
      id: 'CommonPrepareExperiment',
      task_type: 'graph',
      task_identifier: 'CommonPrepareExperiment.json',
      inputs: {
        // optional for defining a node autonomoysly and used be the end-user
        nonStatic: [{}], // arguments in links do the mapping of inputs to outputs
        static: [{}],
      },
      outputs: [],
      graphical_params: {},
    },
    {
      id: 'Prepare trouble shooting',
      ppfmethod: 'mx.src.prepareTroubleShooting.run',
    },
    {
      id: 'Check1 move of phi',
      ppfmethod: 'mx.src.checkMoveOfPhi.run',
    },
    {
      id: 'Set ISPyB status to success with error message',
      ppfmethod: 'mx.src.ispyb_set_status_success_with_errors.run',
    },
    {
      id: 'All tests ok',
      ppfmethod: 'mx.src.troubleShootingAllTestsOk.run',
    },
    {
      id: 'Set ISPyB to success',
      ppfmethod: 'mx.src.ispyb_set_status_success.run',
    },
  ],

  links: [
    {
      source: 'Prepare trouble shooting',
      target: 'CommonPrepareExperiment', // this is a graph from nodes
      arguments: {}, // map output of node to inputs in nodegraph. "In" is an input not a node
      all_arguments: Boolean,
      conditions: {}, // map last nodes outputs to expected values
      on_error: Boolean,
      // other
      effects: {}, // if link is good to go some sub-actions FSM formalism
      // the existing
      // "subgraph_nodes": [
      //     {
      //         "source": "Prepare trouble shooting",
      //         "target": "In",
      //         "all_arguments": true
      //     }
      //  ]
    },
    {
      source: 'CommonPrepareExperiment',
      target: 'Check move of phi',
      links: [
        {
          source: 'Out',https://confluence.esrf.fr/pages/viewpage.action?spaceKey=AAWWK&title=Automation+and+Analysis+Workflows
          target: 'Check move of phi',
          all_arguments: true,
        },
      ],
    },
  ],
};

const subgraph = {
  directed: true,
  graph: { name: 'CommonPrepareExperiment' },
  multigraph: false,
  inputs: [
    { name: '', type: '', restrictions: '' }, // ?
  ],
  outputs: [
    { name: '', type: '', restrictions: '' }, // ?
  ],
  nodes: [
    // {
    //     "id": "In",
    //     "ppfport": "output"
    // },
    // {
    //     "id": "Out",
    //     "ppfport": "input"
    // },
    {
      id: 'Init1 workflow',
      task_type: 'ppfmethod',
      task_name: 'mx.src.init_workflow.run',
      inputs: {
        nonStatic: [inputs.name],
      },
    },
    {
      id: 'Default1 parameters',
      ppfmethod: 'mx.src.common_default_parameters.run',
    },
    {
      id: 'Read1 motor positions',
      ppfmethod: 'mx.src.read_motor_positions.run',
    },
  ],

  links: [
    {
      source: 'In',
      target: 'Init workflow',
      all_arguments: true,
    },
    {
      source: 'Init workflow',
      target: 'Read motor positions',
      all_arguments: true,
    },
    {
      source: 'Default parameters',
      target: 'Out',
      all_arguments: true,
    },
    {
      source: 'Read motor positions',
      target: 'Default parameters',
      all_arguments: true,
    },
  ],
};
// The subgraph should be a decoupled entity that could change any given moment.
// Even the first node can change its name and the super-graph should remain unaltered.
// So the subgraph has it own json representation and should only be referenced from the supergraph.
// When using a subgraph we create an instance of it upon which changes can be made to alter it from the original one?
// The outer graph needs to just assign 1 or more links to the inputs of the subgraph with the abstraction name we use
// in the uper-graph for the subgraph and take get an output. TREAT IT LIKE A NODE in every way.
// The rest of the info will be included at the decoupled subgraph as if it was an upper-graph as it can as well be.
// subgraph then has input1 and input2 defined not as nodes but as inputs and the same goes for outputs.

const graph = {
  inputs: [
    { name: '', type: '', restrictions: '' }, // ?
  ],
  outputs: [
    { name: '', type: '', restrictions: '' }, // ?
  ],
  nodes: [],
  edges: [],
};

// the node should as well be an autonomous entity and wait from the links to "know" its inputs.
// So all inputs must be specified in the node. inputs: [{}]
// do we at any point need different outputs from a node. outputs: [{}]


// referencing 2 layers down breaks? the decoupling


const graph = {
  "nodes": [
      {
          "id": "node1",
          "task_type": "method",
          "task_identifier": "__main__.myfunc",
          "inputs": {
              "name": "node1",
              "value": 0
          }
      },
      {
          "id": "node2",
          "task_type": "graph",
          "task_identifier": "subgraph.json"
      }
  ],
  "links": [
      {
          "source": "node1",
          "target": "node2",
          // "sub_graph_nodes": {
          to_target_input: "in1", // applicable when more than one inputs or else it can be defined in the node?
          // },
          "arguments": {
              "value": "return_value"
          }
      }
  ]
}


const subgraph = {
  "graph": {
    inputs: [
      {name: 'in1', to: 'subnode1'}
    ],
    outputs: [
      {name: 'out1', to: 'in1'}
    ],
    // "input_nodes": {
    //   "in1": [
    //     "subnode1",
    //     "in1b"
    //   ]
    // }
  },
  "nodes": [
    {
      "id": "subnode1",
      "task_type": "graph",
      "task_identifier": "subsubgraph.json"
    }
  ]
}

const subsubgraph = {
  "graph": {
    input: [
      {name: 'in1', to: 'subsubnode1'}
    ],
    // "input_nodes": {
    //   "in1": "subsubnode1"
    // }
  },
  "nodes": [
    {
      "task_type": "method",
      "task_identifier": "__main__.myfunc",
      "inputs": {
        "name": "subnode1",
        "value": 0
      },
      "id": "subsubnode1"
    }
  ],
  "links": []
}


{/* {'source' in elementClickedStore && ( */}
        //   <React.Fragment>
        //     <div>
        //       <TextField
        //         id="outlined-basic"
        //         label="Task identifier"
        //         variant="outlined"
        //         value={source || ''}
        //         onChange={sourceChanged}
        //       />
        //     </div>
        //     <div>
        //       <TextField
        //         id="outlined-basic"
        //         label="Task type"
        //         variant="outlined"
        //         value={target || ''}
        //         onChange={targetChanged}
        //       />
        //     </div>
        //     <div>
        //       <TextField
        //         id="outlined-basic"
        //         label="Task identifier"
        //         variant="outlined"
        //         value={args || ''}
        //         onChange={argsChanged}
        //       />
        //     </div>
        //     <div>
        //       <TextField
        //         id="outlined-basic"
        //         label="Task type"
        //         variant="outlined"
        //         value={allArgs || ''}
        //         onChange={allArgsChanged}
        //       />
        //     </div>
        //     <div>
        //       <TextField
        //         id="outlined-basic"
        //         label="Task identifier"
        //         variant="outlined"
        //         value={conditions || ''}
        //         onChange={conditionsChanged}
        //       />
        //     </div>
        //     <div>
        //       <TextField
        //         id="outlined-basic"
        //         label="Task type"
        //         variant="outlined"
        //         value={onError || ''}
        //         onChange={onErrorChanged}
        //       />
        //     </div>
        //     <div>
        //       <TextField
        //         id="outlined-basic"
        //         label="Task identifier"
        //         variant="outlined"
        //         value={args || ''}
        //         onChange={argsChanged}
        //       />
        //     </div>
        //     <div>
        //       <TextField
        //         id="outlined-basic"
        //         label="Task type"
        //         variant="outlined"
        //         value={allArgs || ''}
        //         onChange={allArgsChanged}
        //       />
        //     </div>
        //   </React.Fragment>
        // )}

let graph = {
  "nodes": [
    {
      "id": "node1",
      "task_type": "method",
      "task_identifier": "asks.simplemethods.add0"
    },
    {
      "id": "node2",
      "task_type": "graph",
      "task_identifier": "subgraph.json"
    },
    {
      "id": "node3",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    }
  ],
  "links": [
    {
      "source": "node1",
      "target": "node2",
      "arguments": {
        "0": "return_value"
      },
      "sub_graph_nodes": {
        "sub_target": "in",
      }
    },
    {
      "source": "node2",
      "target": "node3",
      "arguments": {
        "0": "return_value"
      },
      "sub_graph_nodes": {
        "sub_source": "out"
      }
    }
  ]
}

let subgraph = {
  "graph": {
    "input_nodes": { // specify all input nodes in1, in2...
      "in": { //  for in which is the default input
        "id": "task1" // task1 is a/the input node of the graph
      }
    },
    "output_nodes": { // All outputs out1, out2...
      "out": { //  out is
        "id": "subsubgraph", // the ssg node that is specified in this graph
        "sub_node": "out" // and since it is again a graph we map to the out of the inner graph
      // the ssg could have 2 outputs (out1, out2) and then we wouldn't know which one to get as out
      }
    }
  },
  "nodes": [
    {
      "id": "task1",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    },
    {
      "id": "task2",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    },
    {
      "id": "subsubgraph",
      "task_type": "graph",
      "task_identifier": "subsubgraph.json"
    }
  ],
  "links": [
    {
      "source": "task1",
      "target": "task2",
      "arguments": {
        "0": "return_value"
      }
    },
    {
      "source": "task2",
      "target": "subsubgraph",
      "arguments": {
        "0": "return_value"
      },
      "sub_graph_nodes": {
        "sub_target": "in"
      }
    }
  ]
}

let subsubgraph = {
  "graph": {
    "input_nodes": {
      "in": {
        "id": "task1"
      }
    },
    "output_nodes": {
      "out": {
        "id": "subsubsubgraph",
        "sub_node": "out"
      }
    }
  },
  "nodes": [
    {
      "id": "task1",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    },
    {
      "id": "task2",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    },
    {
      "id": "subsubsubgraph",
      "task_type": "graph",
      "task_identifier": "subsubsubgraph.json"
    }
  ],
  "links": [
    {
      "source": "task1",
      "target": "task2",
      "arguments": {
        "0": "return_value"
      }
    },
    {
      "source": "task2",
      "target": "subsubsubgraph",
      "arguments": {
        "0": "return_value"
      },
      "sub_graph_nodes": {
        "sub_target": "in"
      }
    }
  ]
}

let subsubsubgraph = {
  "graph": {
    "input_nodes": {
      "in": {
        "id": "task1"
      }
    },
    "output_nodes": {
      "out": {
        "id": "task2"
      }
    }
  },
  "nodes": [
    {
      "id": "task1",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    },
    {
      "id": "task2",
      "task_type": "method",
      "task_identifier": "ewokscore.tests.examples.tasks.simplemethods.add"
    }
  ],
  "links": [
    {
      "source": "task1",
      "target": "task2",
      "arguments": {
        "0": "return_value"
      }
    }
  ]
}
