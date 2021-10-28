import type { Node, Edge, Position } from 'react-flow-renderer';

export interface GraphNodes {
  id: string;
  node: string;
  sub_node?: string;
}

export interface GraphDetails {
  id: string;
  label: string;
  input_nodes?: Array<GraphNodes>;
  output_nodes?: Array<GraphNodes>;
  uiProps?: UiProps;
}

export interface Graph {
  graph?: GraphDetails;
  nodes: Array<EwoksNode>;
  links: Array<EwoksLink>;
}

export interface State {
  // updateNeeded: number;
  // setUpdateNeeded: (num: number) => void;
  recentGraphs?: Array<GraphRF>;
  setRecentGraphs?: (graphRF: GraphRF) => void;
  graphOrSubgraph?: Boolean;
  setGraphOrSubgraph: (isItGraph: Boolean) => void;
  subgraphsStack?: Array<stackGraph>;
  setSubgraphsStack?: (graphRF: stackGraph) => void;
  graphRF: GraphRF;
  setGraphRF: (graphRF: GraphRF) => void;
  selectedElement: EwoksRFNode | EwoksRFLink;
  setSelectedElement: (element: EwoksRFNode | EwoksRFLink) => void;
  subGraph: GraphRF;
  setSubGraph: (graph: GraphRF) => Promise<GraphRF>;
  workingGraph: GraphRF;
  setWorkingGraph: (graph: GraphEwoks) => Promise<GraphRF>;
}

export interface Inputs {
  key?: string;
  value?: string;
}

export interface nodeInputsOutputs {
  optional_input_names?: Array<string>;
  output_names?: Array<string>;
  required_input_names?: Array<string>;
}

export interface stackGraph {
  id: string;
  label: string;
}

export interface UiProps {
  key?: string;
  value?: string;
}

export interface DataMapping {
  source_output: string;
  target_input: string;
}

export interface Conditions {
  source_output: string;
  value: string;
}

export interface EwoksNode {
  id: string;
  label?: string;
  task_type: string;
  task_identifier: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  uiProps?: UiProps;
}

export interface EwoksLink {
  id?: string;
  source: string;
  target: string;
  data_mapping?: DataMapping[];
  conditions?: Conditions[];
  on_error?: Inputs;
  subtarget?: string;
  subsource?: string;
  uiProps?: UiProps;
}

export interface EwoksRFNode {
  id: string;
  label?: string;
  task_type?: string;
  task_identifier?: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  data?: {
    label?: string;
    type?: string;
    inputs?: [string]; // ?
    outputs?: [string]; // ?
    icon?: string;
    comment?: string;
  };
  sourcePosition?: Position;
  targetPosition?: Position;
  position?: { x: number; y: number };
  optional_input_names?: Array<string>;
  output_names?: Array<string>;
  required_input_names?: Array<string>;
}

export interface EwoksRFLink {
  id?: string;
  source: string;
  target: string;
  label?: string;
  data?: {
    data_mapping?: DataMapping;
    type?: string;
    comment?: string;
    conditions?: Conditions[];
    on_error?: Inputs;
  };
  subtarget?: string;
  subsource?: string;
  uiProps?: UiProps;
}

export interface RFLink {
  id?: string;
  source: string;
  target: string;
  label?: string;
  data?: {
    data_mapping?: DataMapping;
    type?: string;
    comment?: string;
    conditions?: Conditions[];
    on_error?: Inputs;
  };
  subtarget?: string;
  subsource?: string;
  uiProps?: UiProps;
}

// coming out of react-flow when selected
// data:
//   comment: "Prepare troubleshouting"
//   icon: "orange1"
//   label: "barmboutsalaMethod"
//   type: "input"
//   only when subgraph we have the following calculated
//   inputs:
//     0: Object { label: "in1: task1 ", type: "data " }
//   outputs:
//     0: Object { label: "out1: subsubgraph  -> out1", type: "data " }
//     1: Object { label: "out2: subsubgraph  -> out2", type: "data " }
// id: "node1"
// position: Object { x: 155, y: 65 }
// type: "method"
export interface RFNode {
  id: string;
  label?: string;
  task_type?: string;
  task_identifier?: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  data?: {
    label?: string;
    type?: string;
    inputs?: [string]; // ?
    outputs?: [string]; // ?
    icon?: string;
    comment?: string;
  };
  sourcePosition?: Position;
  targetPosition?: Position;
  position?: { x: number; y: number };
}

export interface GraphRF {
  graph?: GraphDetails;
  nodes: Array<EwoksRFNode>;
  links: Array<EwoksRFLink>;
}

export interface GraphEwoks {
  graph?: GraphDetails;
  nodes: Array<EwoksNode>;
  links: Array<EwoksLink>;
}
