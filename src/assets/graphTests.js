// the graphs we will get from the server or DB

export const graph = {
  nodes: [
    {
      id: 'node1',
      task_type: 'method',
      task_identifier: 'ewokscore.tests.examples.tasks.simplemethods.add0',
    },
    {
      id: 'node2',
      task_type: 'graph',
      task_identifier: 'subgraph.json',
    },
    {
      id: 'node3',
      task_type: 'method',
      task_identifier: 'ewokscore.tests.examples.tasks.simplemethods.add1',
    },
  ],
  links: [
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
