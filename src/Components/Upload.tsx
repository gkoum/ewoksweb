/* eslint-disable jsx-a11y/control-has-associated-label */
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Button } from '@material-ui/core';
import { useState } from 'react';
import useStore from '../store';
import type { Graph, GraphRF } from '../types';
import {
  toRFEwoksLinks,
  toRFEwoksNodes,
  createGraph,
  getGraph,
  getSubgraphs,
} from '../utils';
// import useToRFEwoksNodes from '../hooks/useToRFEwoksNodes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    openFileButton: {
      backgroundColor: '#96a5f9',
    },
  })
);

const showFile = async (e) => {
  e.preventDefault();
  console.log(e);
  const reader = new FileReader();
  reader.addEventListener = async (e) => {
    const text = e.target.result;
    console.log(text);
  };
  reader.readAsText(e.target.files[0]);
  console.log(reader);
  return reader;
};

function Upload(props) {
  // console.log(props);
  const classes = useStyles();

  const [selectedFile, setSelectedFile] = useState();
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const graphOrSubgraph = useStore<Boolean>((state) => state.graphOrSubgraph);

  const getId = (graphName) => {
    let id = 0;
    let graphId = graphName;
    while (graphRF.nodes.find((nod) => nod.id === graphName)) {
      graphId += id++;
    }
    return graphId; // `${graphName}_${id++}`;
  };

  const fileNameChanged = async (event) => {
    console.log(event.target.files[0]);
    // setSelectedFile(event.target.files[0]);
    const reader = showFile(event);
    const file = await reader.then((val) => val);
    file.onloadend = function () {
      setSelectedFile(file.result);
      const newGraph = JSON.parse(file.result);
      const nodes = toRFEwoksNodes(newGraph, recentGraphs);
      const links = toRFEwoksLinks(newGraph);
      const graph = {
        graph: newGraph.graph,
        nodes: nodes,
        links: links,
      };
      console.log(nodes, links, graphOrSubgraph, recentGraphs, newGraph);
      // TODO: need to load first layer subgraphs with failsave if some not found
      // Detect subgraphs and load them to recentGraphs
      getSubgraphs(graph, recentGraphs, setRecentGraphs);
      console.log(recentGraphs);
      // const existingNodeSubgraphs = nodes.filter(
      //   (nod) => nod.task_type === 'graph'
      // );
      // console.log(existingNodeSubgraphs);
      // if (existingNodeSubgraphs.length > 0) {
      //   // there are subgraphs get them to recentGraphs
      //   existingNodeSubgraphs.forEach((graph) => {
      //     setRecentGraphs(getGraph(graph.task_identifier));
      //   });
      // }

      if (graphOrSubgraph) {
        // if it is a new graph opening
        console.log('initialiase');
        setSubgraphsStack({ id: 'initialiase', label: '' });
        console.log('ADD a new graph1');
        setRecentGraphs(graph as GraphRF);
        console.log('RECENT GRAPHS', recentGraphs);
      } else {
        // if we are adding a subgraph to an existing graph:
        // save the super-graph in the recent graphs and add a new graph node to it
        // if there is no initial graph to drop-in the subgraph -> create one
        let superGraph = {} as Graph;
        if (recentGraphs.length === 0) {
          // create a graph and get its id
          superGraph = createGraph();
          setSubgraphsStack({
            id: superGraph.graph.id,
            label: superGraph.graph.label,
          });
          setRecentGraphs(superGraph);
        } else {
          // TODO: if not in the recentGraphs?
          superGraph = recentGraphs.find(
            (gr) => gr.graph.id === graphRF.graph.id
          );
        }

        if (superGraph) {
          const inputsSub = newGraph.graph.input_nodes.map((input) => {
            return {
              label: `${input.id}: ${input.node} ${
                input.sub_node ? `  -> ${input.sub_node}` : ''
              }`,
              type: 'data ',
            };
          });
          const outputsSub = newGraph.graph.output_nodes.map((input) => {
            return {
              label: `${input.id}: ${input.node} ${
                input.sub_node ? ` -> ${input.sub_node}` : ''
              }`,
              type: 'data ',
            };
          });
          const newNode = {
            sourcePosition: 'right',
            targetPosition: 'left',
            task_generator: '',
            // TODO: ids should be unique to this graph only as a node for this subgraph
            // human readable but automatically generated?
            // Not a string for sure?
            id: getId(newGraph.graph.label),
            // TODO: can we upload a task too like a subgraph
            task_type: 'graph',
            task_identifier: newGraph.graph.id,
            type: 'graph',
            position: { x: 100, y: 500 },
            default_inputs: [],
            inputs_complete: false,
            data: {
              label: newGraph.graph.label,
              type: 'internal',
              comment: '',
              // TODO: icon needs to be in the task and graph JSON specification
              icon: newGraph.graph.uiProps && newGraph.graph.uiProps.icon,
              inputs: inputsSub,
              outputs: outputsSub,
              // icon: newGraph.data.icon ? newGraph.data.icon : '',
            },
            // data: { label: CustomNewNode(id, name, image) },
          };
          superGraph.nodes.push(newNode);
          console.log('ADD a new graph2', superGraph);
          setRecentGraphs(superGraph);
        }
      }
      // set the new graph as the working graph
      setGraphRF({
        graph: newGraph.graph,
        nodes: nodes,
        links: links,
      } as GraphRF);
      // add the new graph to the recent graphs if not already there
      console.log('ADD a new graph3');
      setRecentGraphs({
        graph: newGraph.graph,
        nodes: nodes,
        links: links,
      });
      setSubgraphsStack({ id: newGraph.graph.id, label: newGraph.graph.label });
    };
    // var data = require('json!./' + selectedFile.name);
    // console.log(data);
  };

  return (
    <div>
      <label htmlFor="load-graph">
        <input
          style={{ display: 'none' }}
          id="load-graph"
          name="load-graph"
          type="file"
          onChange={fileNameChanged}
        />
        <Fab
          className={classes.openFileButton}
          color="primary"
          size="small"
          component="span"
          aria-label="add"
        >
          {props.children}
        </Fab>
      </label>
    </div>
  );
}

const rootElement = document.querySelector('#root');

export default Upload;
