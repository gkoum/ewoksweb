// the graphs we will get from the server or DB
// decoupling from the Graph visualisation library used means we have a model
// of ewoks and a map-engine to create a model for react-flow or another for vis etc.
export const graph = {
  graph: {
    id: 'graph',
    input_nodes: [{ name: 'in1', id: 'node1' }],
    output_nodes: [{ name: 'out1', id: 'node3' }],
  },
  nodes: [
    {
      id: 'node1',
      task_type: 'method',
      task_identifier: 'tasks.simplemethods.add0',
      default_inputs: [{ name: 'a', value: 1 }],
      uiProps: { position: { x: 50, y: 80 } },
    },
    {
      id: 'node2',
      task_type: 'graph',
      task_identifier: 'subgraph',
      uiProps: { position: { x: 500, y: 80 } },
    },
    {
      id: 'node3',
      task_type: 'method',
      task_identifier: 'tasks.simplemethods.add1',
      uiProps: { position: { x: 700, y: 580 } },
    },
    {
      id: 'node4',
      task_type: 'method',
      task_identifier: 'tasks.simplemethods.add44',
      uiProps: { position: { x: 50, y: 380 } },
    },
  ],
  links: [
    // checking each link, if source or target is a graph we need to have sub_graph_nodes
    // if we don't we assume "subtarget: in" as a default
    // if we do the sub_target must be the same with one input or output of the subgraph
    {
      source: 'node1',
      target: 'node2',
      data_mapping: [{ source_output: 'ab', target_input: 'result' }],
      sub_graph_nodes: {
        sub_target: 'in1',
      },
    },
    {
      source: 'node4',
      target: 'node2',
      data_mapping: [{ source_output: 'ab3', target_input: 'result5' }],
      sub_graph_nodes: {
        sub_target: 'in2',
      },
    },
    {
      source: 'node2',
      target: 'node3',
      data_mapping: [{ source_output: 'aretb', target_input: 'result78' }],
      sub_graph_nodes: {
        sub_source: 'out',
      },
    },
  ],
};

export const subgraph = {
  graph: {
    id: 'subgraph',
    input_nodes: [
      { name: 'in1', id: 'task1' },
      { name: 'in2', id: 'task2' },
    ],
    output_nodes: [
      { name: 'out1', id: 'subsubgraph', sub_node: 'out1' },
      { name: 'out2', id: 'subsubgraph', sub_node: 'out2' },
    ],
  },
  nodes: [
    {
      id: 'task1',
      task_type: 'method',
      task_identifier: 'tasks.simplemethods.add2',
      uiProps: { position: { x: 50, y: 80 } },
    },
    {
      id: 'task2',
      task_type: 'method',
      task_identifier: 'tasks.simplemethods.add3',
      uiProps: { position: { x: 500, y: 180 } },
    },
    {
      id: 'subsubgraph',
      task_type: 'graph',
      task_identifier: 'subsubgraph',
      uiProps: { position: { x: 700, y: 480 } },
    },
  ],
  links: [
    {
      source: 'task1',
      target: 'task2',
      data_mapping: [{ source_output: 'ab6', target_input: 'result6' }],
    },
    {
      source: 'task2',
      target: 'subsubgraph',
      data_mapping: [{ source_output: 'ab56', target_input: 'result56' }],
      sub_graph_nodes: {
        sub_target: 'in',
      },
    },
  ],
};

export const subsubgraph = {
  graph: {
    id: 'subsubgraph',
    input_nodes: [
      { name: 'in1', id: 'task1' },
      { name: 'in2', id: 'task2' },
    ],
    output_nodes: [
      { name: 'out1', id: 'subsubsubgraph', sub_node: 'out' },
      { name: 'out2', id: 'subsubsubgraph', sub_node: 'out' },
    ],
  },
  nodes: [
    {
      id: 'task1',
      task_type: 'method',
      task_identifier: 'tasks.simplemethods.add4',
      uiProps: { position: { x: 50, y: 80 } },
    },
    {
      id: 'task2',
      task_type: 'method',
      task_identifier: 'tasks.simplemethods.add5',
      uiProps: { position: { x: 350, y: 280 } },
    },
    {
      id: 'subsubsubgraph',
      task_type: 'graph',
      task_identifier: 'subsubsubgraph',
      uiProps: { position: { x: 700, y: 480 } },
    },
  ],
  links: [
    {
      source: 'task1',
      target: 'task2',
      data_mapping: [{ source_output: 'ab45', target_input: 'result45' }],
    },
    {
      source: 'task2',
      target: 'subsubsubgraph',
      data_mapping: [{ source_output: 'ab78', target_input: 'result7' }],
      sub_graph_nodes: {
        sub_target: 'in',
      },
    },
  ],
};

export const subsubsubgraph = {
  graph: {
    id: 'subsubsubgraph',
    input_nodes: [
      { name: 'in1', id: 'task1' },
      { name: 'in2', id: 'task2' },
    ],
    output_nodes: [
      { name: 'out1', id: 'subsubsubgraph', sub_node: 'out' },
      { name: 'out2', id: 'subsubsubgraph', sub_node: 'out' },
    ],
  },
  nodes: [
    {
      id: 'task1',
      task_type: 'method',
      task_identifier: 'tasks.simplemethods.add6',
      uiProps: { position: { x: 50, y: 80 } },
    },
    {
      id: 'task2',
      task_type: 'method',
      task_identifier: 'tasks.simplemethods.add7',
      uiProps: { position: { x: 300, y: 80 } },
    },
  ],
  links: [
    {
      source: 'task1',
      target: 'task2',
      data_mapping: [{ source_output: 'ab', target_input: 'result' }],
    },
  ],
};
