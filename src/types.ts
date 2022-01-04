import type { Color } from '@material-ui/lab';
import type { Node, Edge, Position } from 'react-flow-renderer';

export interface GraphNodes {
  id: string;
  node: string;
  sub_node?: string;
  uiProps?: UiProps;
}

export interface GraphDetails {
  id: string;
  label?: string;
  input_nodes?: Array<GraphNodes>;
  output_nodes?: Array<GraphNodes>;
  uiProps?: UiProps;
}

export interface Graph {
  graph?: GraphDetails;
  nodes: Array<EwoksNode>;
  links: Array<EwoksLink>;
}

export interface SnackbarParams {
  open: boolean;
  text: string;
  severity: Color;
}

export interface DialogParams {
  open: boolean;
  content: any; // {title: string; graph: }
}

export interface State {
  initializedGraph: GraphRF;
  tasks: Array<Task>;
  setTasks: (tasks: Array<Task>) => void;
  openDraggableDialog: DialogParams;
  setOpenDraggableDialog: (params: DialogParams) => void;
  openSnackbar: SnackbarParams;
  setOpenSnackbar: (params: SnackbarParams) => void;
  // updateNeeded: any;
  allWorkflows: Array<GraphEwoks>;
  setAllWorkflows: (workflows: Array<GraphEwoks>) => void;
  recentGraphs?: Array<GraphRF>;
  setRecentGraphs?: (graphRF: GraphRF, reset?: boolean) => void;
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

export interface Task {
  task_type?: string;
  task_identifier?: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  optional_input_names?: Array<string>;
  output_names?: Array<string>;
  required_input_names?: Array<string>;
  icon?: string;
}

export interface Inputs {
  name?: string;
  value?: string | boolean;
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
  label?: string;
  type?: string;
  icon?: string;
  comment?: string;
  position?: CanvasPosition;
}

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface DataMapping {
  source_output: string;
  target_input: string;
}

export interface Conditions {
  source_output: string;
  value: string | boolean;
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
  map_all_data: boolean;
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
    moreHandles?: boolean;
  };
  sourcePosition?: string;
  targetPosition?: string;
  position?: CanvasPosition;
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
    data_mapping?: DataMapping[];
    type?: string;
    comment?: string;
    conditions?: Conditions[];
    on_error?: Inputs;
    map_all_data: boolean;
    sub_target?: string;
    sub_source?: string;
  };
  subtarget?: string;
  subsource?: string;
  uiProps?: UiProps;
  type?: string;
  arrowHeadType?: string;
  animated?: boolean;
  sourceHandle?: string;
  targetHandle?: string;
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
  position?: CanvasPosition;
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
