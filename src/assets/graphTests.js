// the graphs we will get from the server or DB
// decoupling from the Graph visualisation library used means we have a model
// of ewoks and a map-engine to create a model for react-flow or another for vis etc.
const PpfPortTask = 'ewokscore.ppftasks.PpfPortTask';
export const graph = {};
// export const graph = {
//   graph: {
//     id: 'graph1',
//     label: 'graph',
//     input_nodes: [
//       { id: 'in1', node: 'node1' },
//       { id: 'in2', node: 'node4' },
//     ],
//     output_nodes: [
//       { id: 'out1', node: 'node3' },
//       { id: 'out2', node: 'node7' },
//     ],
//   },
//   nodes: [
//     {
//       id: 'node1',
//       task_type: 'method',
//       task_identifier: 'ewokscore.methodtask.MethodExecutorTask',
//       default_inputs: [{ name: 'a', value: 1 }],
//       uiProps: { position: { x: 50, y: 80 }, icon: 'orange1' },
//     },
//     {
//       id: 'node2',
//       task_type: 'graph',
//       task_identifier: 'subgraph1',
//       uiProps: { position: { x: 400, y: 80 }, icon: 'orange2' },
//     },
//     {
//       id: 'node3',
//       task_type: 'method',
//       task_identifier: 'ewokscore.scripttask.ScriptExecutorTask',
//       uiProps: {
//         position: { x: 700, y: 580 },
//         icon: 'orange3',
//       },
//     },
//     {
//       id: 'node4',
//       task_type: 'method',
//       task_identifier: 'ewokscore.ppftasks.PpfMethodExecutorTask',
//       uiProps: { position: { x: 50, y: 380 }, icon: 'Continuize' },
//     },
//     {
//       id: 'node5',
//       task_type: 'method',
//       task_identifier: 'tasks.methods.rerr15',
//       uiProps: {
//         position: { x: 700, y: 80 },
//         icon: 'AggregateColumns',
//       },
//     },
//     {
//       id: 'node6',
//       task_type: 'method',
//       task_identifier: PpfPortTask,
//       uiProps: { position: { x: 900, y: 80 }, icon: 'Correlations' },
//     },
//     {
//       id: 'node7',
//       task_type: 'method',
//       task_identifier: 'ewokscore.tests.examples.tasks.sumtask.SumTask',
//       uiProps: {
//         position: { x: 1100, y: 240 },
//         icon: 'CreateClass',
//       },
//     },
//   ],
//   links: [
//     {
//       source: 'node1',
//       target: 'node2',
//       data_mapping: [{ source_output: 'ab', target_input: 'result' }],
//       sub_target: 'in1',
//       conditions: [{ source_output: 'return_value', value: 10 }],
//     },
//     {
//       source: 'node4',
//       target: 'node2',
//       data_mapping: [{ source_output: 'ab3', target_input: 'result5' }],
//       sub_target: 'in2',
//     },
//     {
//       source: 'node2',
//       target: 'node3',
//       data_mapping: [{ source_output: 'aretb', target_input: 'result78' }],
//       sub_source: 'out',
//     },
//     {
//       source: 'node2',
//       target: 'node5',
//       data_mapping: [{ source_output: 'aretb', target_input: 'result78' }],
//       sub_source: 'out',
//     },
//     {
//       source: 'node5',
//       target: 'node6',
//       data_mapping: [{ source_output: 'aretb', target_input: 'result78' }],
//     },
//     {
//       source: 'node6',
//       target: 'node7',
//       data_mapping: [{ source_output: 'aretb', target_input: 'result78' }],
//     },
//   ],
// };

export const subgraph = {
  graph: {
    id: 'subgraph1',
    label: 'subgraph',
    input_nodes: [
      { id: 'in1', node: 'task1' },
      { id: 'in2', node: 'task3' },
    ],
    output_nodes: [
      { id: 'out1', node: 'subsubgraph', sub_node: 'out1' },
      { id: 'out2', node: 'subsubgraph', sub_node: 'out2' },
    ],
    uiProps: { icon: 'orange2' },
  },
  nodes: [
    {
      id: 'task1',
      task_type: 'method',
      task_identifier: 'PpfPortTask',
      uiProps: { position: { x: 50, y: 80 }, icon: 'Correlations' },
    },
    {
      id: 'task2',
      task_type: 'method',
      task_identifier: 'tasks.methods.rerr15',
      uiProps: {
        position: { x: 500, y: 180 },
        icon: 'AggregateColumns',
      },
    },
    {
      id: 'task3',
      task_type: 'method',
      task_identifier: 'tasks.methods.add4',
      uiProps: { position: { x: 50, y: 500 } },
    },
    {
      id: 'subsubgraph',
      task_type: 'graph',
      task_identifier: 'subsubgraph1',
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
    id: 'subsubgraph1',
    label: 'subsubgraph',
    input_nodes: [{ id: 'in1', node: 'task1' }],
    output_nodes: [
      { id: 'out1', node: 'subsubsubgraph', sub_node: 'out' },
      { id: 'out2', node: 'subsubsubgraph', sub_node: 'out' },
    ],
    uiProps: { icon: 'orange2' },
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
      task_identifier: 'subsubsubgraph1',
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
    id: 'subsubsubgraph1',
    label: 'subsubsubgraph',
    input_nodes: [{ id: 'in1', node: 'task1' }],
    output_nodes: [{ id: 'in2', node: 'task2' }],
    uiProps: { icon: 'orange2' },
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

export const tasks = [
  {
    task_type: 'class',
    task_identifier: 'ewokscore.methodtask.MethodExecutorTask',
    required_input_names: ['method'],
    optional_input_names: [],
    output_names: ['return_value'],
    category: 'ewokscore',
  },
  {
    task_type: 'class',
    task_identifier: 'ewokscore.scripttask.ScriptExecutorTask',
    required_input_names: ['script'],
    optional_input_names: [],
    output_names: ['returncode'],
    category: 'ewokscore',
  },
  {
    task_type: 'class',
    task_identifier: 'ewokscore.ppftasks.PpfMethodExecutorTask',
    required_input_names: ['method'],
    optional_input_names: ['ppfdict'],
    output_names: ['ppfdict'],
    category: 'ewokscore',
  },
  {
    task_type: 'class',
    task_identifier: PpfPortTask,
    required_input_names: [],
    optional_input_names: ['ppfport', 'ppfdict'],
    output_names: ['ppfdict'],
    category: 'ewokscore',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.DataSelection',
    required_input_names: ['filenames'],
    optional_input_names: [
      'in_memory',
      'copy_files',
      'dark_filename',
      'root_dir',
    ],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.DataCopy',
    required_input_names: ['dataset'],
    optional_input_names: [],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.DataPassThrough',
    required_input_names: ['dataset'],
    optional_input_names: [],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.NoiseRemoval',
    required_input_names: ['dataset'],
    optional_input_names: [
      'method',
      'kernel_size',
      'background_type',
      'chunks',
      'step',
    ],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.RoiSelection',
    required_input_names: ['roi_size', 'dataset', 'roi_origin'],
    optional_input_names: [],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.DataPartition',
    required_input_names: ['dataset'],
    optional_input_names: ['bins', 'n_bins'],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.DimensionDefinition',
    required_input_names: ['dataset', '_dims'],
    optional_input_names: [],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.ShiftCorrection',
    required_input_names: ['dataset'],
    optional_input_names: ['shift'],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.BlindSourceSeparation',
    required_input_names: ['dataset', 'method'],
    optional_input_names: ['n_comp'],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.RockingCurves',
    required_input_names: ['dataset'],
    optional_input_names: [],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.GrainPlot',
    required_input_names: ['dataset'],
    optional_input_names: [],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.Transformation',
    required_input_names: ['dataset'],
    optional_input_names: [],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    task_type: 'class',
    task_identifier: 'darfix.core.process.ZSum',
    required_input_names: ['dataset'],
    optional_input_names: ['plot'],
    output_names: ['dataset'],
    category: 'darfix',
  },
  {
    optional_input_names: [],
    output_names: [],
    required_input_names: [],
    task_identifier: 'Start-End',
    task_type: 'graphInput',
    uiProps: { icon: 'graphInput' },
  },
  {
    optional_input_names: [],
    output_names: [],
    required_input_names: [],
    task_identifier: 'Start-End',
    task_type: 'graphOutput',
    uiProps: { icon: 'graphOutput' },
  },
  {
    optional_input_names: [],
    output_names: ['return_value'],
    required_input_names: ['method'],
    task_identifier: 'ewokscore.methodtask.MethodExecutorTask',
    task_type: 'class',
    uiProps: { icon: 'orange1' },
  },
  {
    optional_input_names: [],
    output_names: ['returncode'],
    required_input_names: ['script'],
    task_identifier: 'ewokscore.scripttask.ScriptExecutorTask',
    task_type: 'class',
  },
  {
    optional_input_names: ['ppfdict'],
    output_names: ['ppfdict'],
    required_input_names: ['method'],
    task_identifier: 'ewokscore.ppftasks.PpfMethodExecutorTask',
    task_type: 'class',
  },
  {
    optional_input_names: ['ppfport', 'ppfdict'],
    output_names: ['ppfdict'],
    required_input_names: [],
    task_identifier: PpfPortTask,
    task_type: 'class',
  },
  {
    optional_input_names: ['b'],
    output_names: ['result'],
    required_input_names: ['a'],
    task_identifier: 'ewokscore.tests.examples.tasks.sumtask.SumTask',
    task_type: 'class',
  },
  {
    optional_input_names: ['b'],
    output_names: ['result'],
    required_input_names: ['a'],
    task_identifier: 'subsubgraph1',
    task_type: 'class',
  },
  {
    optional_input_names: ['b'],
    output_names: ['result'],
    required_input_names: ['a'],
    task_identifier: 'subgraph1',
    task_type: 'class',
  },
  {
    optional_input_names: ['b'],
    output_names: ['result'],
    required_input_names: ['a'],
    task_identifier: 'CommonPrepareExperiment.json',
    task_type: 'graph',
  },
  {
    optional_input_names: ['b'],
    output_names: ['result'],
    required_input_names: ['a'],
    task_identifier: 'mx.src.prepareTroubleShooting.run',
    task_type: 'class',
  },
  {
    optional_input_names: ['b'],
    output_names: ['result'],
    required_input_names: ['a'],
    task_identifier: 'mx.src.checkMoveOfPhi.run',
    task_type: 'class',
  },
  {
    optional_input_names: ['b'],
    output_names: ['result'],
    required_input_names: ['a'],
    task_identifier: 'mx.src.ispyb_set_status_success_with_errors.run',
    task_type: 'class',
  },
  {
    optional_input_names: ['b'],
    output_names: ['result'],
    required_input_names: ['a'],
    task_identifier: 'mx.src.troubleShootingAllTestsOk.run',
    task_type: 'class',
  },
  {
    optional_input_names: ['b'],
    output_names: ['result'],
    required_input_names: ['a'],
    task_identifier: 'mx.src.ispyb_set_status_success.run',
    task_type: 'class',
  },
];
