// the graphs we will get from the server or DB
// decoupling from the Graph visualisation library used means we have a model
// of ewoks and a map-engine to create a model for react-flow or another for vis etc.
export const graph = {
  graph: {
    name: 'graph',
    input_nodes: [
      { name: 'in1', id: 'node1' },
      { name: 'in2', id: 'node4' },
    ],
    output_nodes: [
      { name: 'out1', id: 'node3' },
      { name: 'out2', id: 'node7' },
    ],
  },
  nodes: [
    {
      id: 'node1',
      task_type: 'method',
      task_identifier: 'tasks.methods.add12',
      default_inputs: [{ name: 'a', value: 1 }],
      uiProps: { position: { x: 50, y: 80 }, icon: 'orange1' },
    },
    {
      id: 'node2',
      task_type: 'graph',
      task_identifier: 'subgraph',
      uiProps: { position: { x: 400, y: 80 }, icon: 'orange2' },
    },
    {
      id: 'node3',
      task_type: 'method',
      task_identifier: 'tasks.methods.find13',
      uiProps: {
        position: { x: 700, y: 580 },
        icon: 'orange3',
      },
    },
    {
      id: 'node4',
      task_type: 'method',
      task_identifier: 'tasks.methods.yut14',
      uiProps: { position: { x: 50, y: 380 }, icon: 'Continuize' },
    },
    {
      id: 'node5',
      task_type: 'method',
      task_identifier: 'tasks.methods.rerr15',
      uiProps: {
        position: { x: 700, y: 80 },
        icon: 'AggregateColumns',
      },
    },
    {
      id: 'node6',
      task_type: 'method',
      task_identifier: 'tasks.methods.track16',
      uiProps: { position: { x: 900, y: 80 }, icon: 'Correlations' },
    },
    {
      id: 'node7',
      task_type: 'method',
      task_identifier: 'tasks.methods.kep17',
      uiProps: {
        position: { x: 1100, y: 240 },
        icon: 'CreateClass',
      },
    },
  ],
  links: [
    {
      source: 'node1',
      target: 'node2',
      data_mapping: [{ source_output: 'ab', target_input: 'result' }],
      sub_target: 'in1',
    },
    {
      source: 'node4',
      target: 'node2',
      data_mapping: [{ source_output: 'ab3', target_input: 'result5' }],
      sub_target: 'in2',
    },
    {
      source: 'node2',
      target: 'node3',
      data_mapping: [{ source_output: 'aretb', target_input: 'result78' }],
      sub_source: 'out',
    },
    {
      source: 'node2',
      target: 'node5',
      data_mapping: [{ source_output: 'aretb', target_input: 'result78' }],
      sub_source: 'out',
    },
    {
      source: 'node5',
      target: 'node6',
      data_mapping: [{ source_output: 'aretb', target_input: 'result78' }],
    },
    {
      source: 'node6',
      target: 'node7',
      data_mapping: [{ source_output: 'aretb', target_input: 'result78' }],
    },
  ],
};

export const subgraph = {
  graph: {
    name: 'subgraph',
    input_nodes: [{ name: 'in1', id: 'task1' }],
    output_nodes: [
      { name: 'out1', id: 'subsubgraph', sub_node: 'out1' },
      { name: 'out2', id: 'subsubgraph', sub_node: 'out2' },
    ],
  },
  nodes: [
    {
      id: 'task1',
      task_type: 'method',
      task_identifier: 'tasks.methods.add2',
      uiProps: { position: { x: 50, y: 80 } },
    },
    {
      id: 'task2',
      task_type: 'method',
      task_identifier: 'tasks.methods.add3',
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
      sub_target: 'in',
    },
  ],
};

export const subsubgraph = {
  graph: {
    name: 'subsubgraph',
    input_nodes: [{ name: 'in1', id: 'task1' }],
    output_nodes: [
      { name: 'out1', id: 'subsubsubgraph', sub_node: 'out' },
      { name: 'out2', id: 'subsubsubgraph', sub_node: 'out' },
    ],
  },
  nodes: [
    {
      id: 'task1',
      task_type: 'method',
      task_identifier: 'tasks.methods.add4',
      uiProps: { position: { x: 50, y: 80 } },
    },
    {
      id: 'task2',
      task_type: 'method',
      task_identifier: 'tasks.methods.add5',
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
      sub_target: 'in',
    },
  ],
};

export const subsubsubgraph = {
  graph: {
    name: 'subsubsubgraph',
    input_nodes: [{ name: 'in1', id: 'task1' }],
    output_nodes: [{ name: 'in2', id: 'task2' }],
  },
  nodes: [
    {
      id: 'task1',
      task_type: 'method',
      task_identifier: 'tasks.methods.add6',
      uiProps: { position: { x: 50, y: 80 } },
    },
    {
      id: 'task2',
      task_type: 'method',
      task_identifier: 'tasks.methods.add7',
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
