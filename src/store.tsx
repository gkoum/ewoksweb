import type { Edge, Node } from 'react-flow-renderer';
import create from 'zustand';
import { getEdges, getNodes, positionNodes, ewoksNetwork } from './utils';

// type State = {
//   clickedElement: string;
//   setClickedElement: (element: string) => void;
// };

interface State {
  ewoksElements: Array<Node | Edge>;
  setEwoksElements: (elements: Array<Node | Edge>) => void;
  selectedElement: Node | Edge;
  setSelectedElement: (element: Node | Edge) => void;
}

interface Inputs {
  key: string;
  value: string;
}

interface UiProps {
  key: string;
  value: string;
}

interface EwoksNode {
  id: string;
  task_type: string;
  task_identifier: string;
  type: string;
  inputs: Inputs;
  inputs_complete: boolean;
  task_generator: string;
  uiProps: UiProps;
}

const nodes = getNodes();
const edges = getEdges();
console.log(nodes, edges);
const positionedNodes = positionNodes(nodes, edges);
console.log(positionedNodes);

const useStore = create<State>((set) => ({
  ewoksElements: [...nodes, ...edges],

  setEwoksElements: (ewoksElements) =>
    set((state) => ({
      ...state,
      ewoksElements,
    })),

  selectedElement: {
    id: '',
    type: '',
    data: { label: '' },
    position: { x: 0, y: 0 },
  } as Node, // set initial values here

  setSelectedElement: (element: Node | Edge) =>
    set((state) => ({
      ...state,
      selectedElement: element,
    })),
}));
export default useStore;
