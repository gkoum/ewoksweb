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
  const subgraphsStack = useStore((state) => state.subgraphsStack);
  const graphOrSubgraph = useStore<Boolean>((state) => state.graphOrSubgraph);

  const updateNeeded = useStore((state) => state.updateNeeded);
  const setUpdateNeeded = useStore((state) => state.setUpdateNeeded);

  const getId = (graphName) => {
    console.log(
      graphName,
      graphRF.nodes.find((nod) => nod.id === graphName)
    );
    let id = 0;
    let graphId = graphName;
    while (graphRF.nodes.find((nod) => nod.id === graphId)) {
      graphId += id++;
    }
    console.log(graphId);
    return graphId; // `${graphName}_${id++}`;
  };

  const fileNameChanged = async (event) => {
    console.log(event.target.files[0], recentGraphs, graphRF, subgraphsStack);
    // setSelectedFile(event.target.files[0]);
    const reader = showFile(event);
    const file = await reader.then((val) => val);
    file.onloadend = async function () {
      setSelectedFile(file.result);
      const links = [];

      // 1. get the graph
      const newGraph = JSON.parse(file.result);

      // 2. search for subgraphs in it (async)
      console.log('getSubgraphs:', newGraph, recentGraphs);
      const newNodeSubgraphs = await getSubgraphs(newGraph, recentGraphs);

      // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
      newNodeSubgraphs.forEach((gr) => {
        console.log('putting newNodeSubgraph in recent', gr);
        // calculate the rfNodes using the fetched subgraphs
        const rfNodes = toRFEwoksNodes(gr, newNodeSubgraphs);
        console.log('rfNodes', rfNodes, toRFEwoksLinks(gr, newNodeSubgraphs));

        setRecentGraphs({
          graph: gr.graph,
          nodes: rfNodes,
          links: toRFEwoksLinks(gr, newNodeSubgraphs), // needs graphEwoks or graphRF?
        });
        // 4. for the superGraph I only need inputs-outputs in gr.graph
        //    to draw node-subgraph before a draw links
      });

      const grfNodes = toRFEwoksNodes(newGraph, newNodeSubgraphs);
      const graph = {
        graph: newGraph.graph,
        nodes: grfNodes,
        links: toRFEwoksLinks(newGraph, newNodeSubgraphs),
      };
      console.log(grfNodes, graph, graphOrSubgraph, recentGraphs, newGraph);

      // when a base graph or a sugraph of a graph
      if (graphOrSubgraph) {
        // if it is a new graph opening
        console.log('initialiase');
        setSubgraphsStack({ id: 'initialiase', label: '' });
        console.log('ADD a new graph1');
        setRecentGraphs(graph as GraphRF);
        console.log('RECENT GRAPHS', recentGraphs);
      } else {
        console.log('adding a subgraph:', graph, recentGraphs);
        // if we are adding a subgraph to an existing graph:
        // save the super-graph in the recent graphs and add a new graph node to it
        // if there is no initial graph to drop-in the subgraph -> create one
        let superGraph = {} as Graph;
        if (recentGraphs.length === 0) {
          // can never happen? adding to existing graph..
          // create a graph and get its id
          superGraph = createGraph();
          setSubgraphsStack({
            id: superGraph.graph.id,
            label: superGraph.graph.label,
          });
          setRecentGraphs(superGraph);
        } else {
          // TODO: if not in the recentGraphs?
          console.log(recentGraphs, graphRF);
          superGraph = recentGraphs.find(
            (gr) => gr.graph.id === graphRF.graph.id
          );
        }
        console.log(superGraph);
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
            id: getId(newGraph.graph.label),
            // TODO: can we upload a task too like a subgraph
            task_type: 'graph',
            task_identifier: newGraph.graph.id,
            type: 'graph',
            position: { x: 100, y: 500 },
            default_inputs: [],
            inputs_complete: false,
            data: {
              exists: true,
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
          console.log(newNode, newGraph);
          superGraph.nodes.push(newNode);
          console.log('ADD a new graph2', superGraph);
          setRecentGraphs(superGraph);
        }
      }
      // set the new graph as the working graph
      setGraphRF(graph as GraphRF);
      // add the new graph to the recent graphs if not already there
      console.log('ADD the new supergraph to recent');
      setRecentGraphs({
        graph: newGraph.graph,
        nodes: grfNodes,
        links: toRFEwoksLinks(newGraph, newNodeSubgraphs),
      });
      setSubgraphsStack({
        id: newGraph.graph.id,
        label: newGraph.graph.label,
      });
    };
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
