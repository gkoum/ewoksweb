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
  selectedElement: Node;
  pokemon: Array<string>;
  setSelectedElement: (element: Node) => void;
  setPokemon: (pokemon: Array<string>) => void;
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
  class: string;
  method: string;
  graph: string;
  inputs: Inputs;
  inputs_complete: boolean;
  task_generator: string;
  uiProps: UiProps;
}

const nodes = getNodes();
const edges = getEdges();
const positionedNodes = positionNodes(nodes, edges);
console.log(positionedNodes);

const useStore = create<State>((set) => ({
  ewoksElements: [...positionedNodes, ...edges],
  setEwoksElements: (ewoksElements: Node | Edge) =>
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
  pokemon: [],

  setSelectedElement: (element: Node | Edge) =>
    set((state) => ({
      ...state,
      selectedElement: element,
    })),

  setPokemon: (pokemon) =>
    set((state) => ({
      ...state,
      pokemon,
    })),
}));
export default useStore;
