import type { Edge, Node } from 'react-flow-renderer';
import create from 'zustand';

// type State = {
//   clickedElement: string;
//   setClickedElement: (element: string) => void;
// };

interface State {
  selectedElement: Node;
  pokemon: Array<string>;
  setSelectedElement: (element: Node) => void;
  setPokemon: (pokemon: Array<string>) => void;
}

const useStore = create<State>((set) => ({
  // clickedElements: '',
  // setClickedElement: (name) =>
  //   set((state) => ({
  //     clickedElement: name,
  //   })),
  selectedElement: {} as Node, // set initial values here
  pokemon: [],

  setSelectedElement: (element: Node) =>
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
