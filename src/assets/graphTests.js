// the graphs we will get from the server or DB
// decoupling from the Graph visualisation library used means we have a model
// of ewoks and a map-engine to create a model for react-flow or another for vis etc.
export const graph = {
  nodes: [
    {
      id: 'node1',
      task_type: 'method',
      task_identifier: 'ewokscore.tests.examples.tasks.simplemethods.add0',
      // type: 'method', // can be infered from task_type?
      data: { name: 'OSIPI' }, // name is also infered by task_identifier + id
      position: { x: 0, y: 80 },
    },
    {
      id: 'node2',
      task_type: 'graph',
      task_identifier: 'subgraph.json',
      // type: 'graph', // infered
      data: {
        // this needs to be infered by the link and the subgraph inputs-outputs
        // I begin from the inner graphs to have an understanding of inputs outputs:
        // If a graph exist on a node go deeper for every node till there are just nodes
        // and start drawing. OR
        // for each graph find the info from the included subgraphs and draw it
        name: 'some_function', // infered
        inputs: [
          { label: 'Dataset', type: 'data' }, // needed for subgraph
          { label: 'Labels', type: 'data' }, // simple node does not need them
        ], // if missing in a subgraph default in-out will be used
        outputs: [
          { label: 'Model', type: 'data' },
          { label: 'Error', type: 'value' },
        ],
      },
      position: { x: 500, y: 80 },
    },
    {
      id: 'node3',
      task_type: 'method',
      task_identifier: 'ewokscore.tests.examples.tasks.simplemethods.add1',
      // type: 'method', // infered
      data: { name: '3OSIPI' }, // infered
      position: { x: 700, y: 580 },
    },
  ],
  links: [
    // checking each link, if source or target is a graph we need to have sub_graph_nodes
    // if we don't we assume "subtarget: in" as a default
    // if we do the sub_target must be the same with one input or output of the subgraph
    {
      source: 'node1',
      target: 'node2',
      args: {
        zero: 'return_value',
      },
      sub_graph_nodes: {
        sub_target: 'in',
      },
    },
    {
      source: 'node2',
      target: 'node3',
      args: {
        zero: 'return_value',
      },
      sub_graph_nodes: {
        sub_source: 'out',
      },
    },
  ],
};

export const subgraph = {
  graph: {
    input_nodes: {
      in: {
        id: 'task1',
      },
    },
    output_nodes: {
      out: {
        id: 'subsubgraph',
        // if sub_node graph in a graph with a final node being a graph again...
        sub_node: 'out',
      },
    },
  },
  nodes: [
    {
      id: 'task1',
      task_type: 'method',
      task_identifier: 'ewokscore.tests.examples.tasks.simplemethods.add2',
    },
    {
      id: 'task2',
      task_type: 'method',
      task_identifier: 'ewokscore.tests.examples.tasks.simplemethods.add3',
    },
    {
      id: 'subsubgraph',
      task_type: 'graph',
      task_identifier: 'subsubgraph.json',
    },
  ],
  links: [
    {
      source: 'task1',
      target: 'task2',
      args: {
        zero: 'return_value',
      },
    },
    {
      source: 'task2',
      target: 'subsubgraph',
      args: {
        zero: 'return_value',
      },
      sub_graph_nodes: {
        sub_target: 'in',
      },
    },
  ],
};

export const subsubgraph = {
  graph: {
    input_nodes: {
      in: {
        id: 'task1',
      },
    },
    output_nodes: {
      out: {
        id: 'subsubsubgraph',
        sub_node: 'out',
      },
    },
  },
  nodes: [
    {
      id: 'task1',
      task_type: 'method',
      task_identifier: 'ewokscore.tests.examples.tasks.simplemethods.add4',
    },
    {
      id: 'task2',
      task_type: 'method',
      task_identifier: 'ewokscore.tests.examples.tasks.simplemethods.add5',
    },
    {
      id: 'subsubsubgraph',
      task_type: 'graph',
      task_identifier: 'subsubsubgraph.json',
    },
  ],
  links: [
    {
      source: 'task1',
      target: 'task2',
      args: {
        zero: 'return_value',
      },
    },
    {
      source: 'task2',
      target: 'subsubsubgraph',
      args: {
        zero: 'return_value',
      },
      sub_graph_nodes: {
        sub_target: 'in',
      },
    },
  ],
};

export const subsubsubgraph = {
  graph: {
    input_nodes: {
      in: {
        id: 'task1',
      },
    },
    output_nodes: {
      out: {
        id: 'task2',
      },
    },
  },
  nodes: [
    {
      id: 'task1',
      task_type: 'method',
      task_identifier: 'ewokscore.tests.examples.tasks.simplemethods.add6',
    },
    {
      id: 'task2',
      task_type: 'method',
      task_identifier: 'ewokscore.tests.examples.tasks.simplemethods.add7',
    },
  ],
  links: [
    {
      source: 'task1',
      target: 'task2',
      args: {
        zero: 'return_value',
      },
    },
  ],
};
