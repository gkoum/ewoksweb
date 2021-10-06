import type { Node, Edge, Position } from 'react-flow-renderer';

export interface GraphNodes {
  name: string;
  id: string;
  sub_node?: string;
}

export interface GraphDetails {
  id: string;
  input_nodes?: Array<GraphNodes>;
  output_nodes?: Array<GraphNodes>;
}

export interface Graph {
  graph?: GraphDetails;
  nodes: Array<EwoksNode>;
  links: Array<EwoksLink>;
}

export interface State {
  graphOrSubgraph?: Boolean;
  setGraphOrSubgraph: (getGraph: Boolean) => void;
  subgraphsStack?: Array<string>;
  setSubgraphsStack?: (graphRF: string) => void;
  graphRF: GraphRF;
  setGraphRF: (graphRF: GraphRF) => void;
  selectedElement: EwoksRFNode | EwoksRFLink;
  setSelectedElement: (element: EwoksRFNode | EwoksRFLink) => void;
  selectedSubgraph: GraphRF;
  setSelectedSubgraph: (graph: GraphRF) => void;
}

export interface Inputs {
  key?: string;
  value?: string;
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

export interface EwoksNode {
  id: string;
  task_type: string;
  task_identifier: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  uiProps?: UiProps;
}

export interface EwoksRFNode {
  id: string;
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
