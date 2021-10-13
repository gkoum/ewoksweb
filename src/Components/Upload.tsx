/* eslint-disable jsx-a11y/control-has-associated-label */
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Button } from '@material-ui/core';
import { useState } from 'react';
import useStore from '../store';
import type { GraphRF } from '../types';
import { toRFEwoksLinks, toRFEwoksNodes } from '../utils';

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

  const fileNameChanged = async (event) => {
    console.log(event.target.files[0]);
    // setSelectedFile(event.target.files[0]);
    const reader = showFile(event);
    const file = await reader.then((val) => val);
    file.onloadend = function () {
      console.log('DONE', file.result); // readyState will be 2
      setSelectedFile(file.result);
      const newGraph = JSON.parse(file.result);
      const nodes = toRFEwoksNodes(newGraph);
      const links = toRFEwoksLinks(newGraph);
      console.log('Executed', nodes, links, graphOrSubgraph, recentGraphs);
      // if it is a new graph opening
      if (graphOrSubgraph) {
        console.log('initialiase');
        setSubgraphsStack('initialiase');
        console.log('ADD a new graph1');
        setRecentGraphs({
          graph: newGraph.graph,
          nodes: nodes,
          links: links,
        } as GraphRF);
      } else {
        // if we are adding a subgraph to an existing graph:
        // save the super-graph in the recent graphs and add a new graph node to it
        const newNode = {
          id: newGraph.graph.name,
          task_type: newGraph.task_type,
          task_identifier: newGraph.task_identifier,
          type: newGraph.task_type,
          position: { x: 100, y: 100 },
          data: {
            label: newGraph.task_identifier,
            type: 'internal',
            // icon: newGraph.data.icon ? newGraph.data.icon : '',
          },
          // data: { label: CustomNewNode(id, name, image) },
        };
        const superGraph = recentGraphs.find(
          (gr) => gr.graph.name === graphRF.graph.name
        );
        superGraph.nodes.push(newNode);
        console.log('ADD a new graph2', superGraph);
        setRecentGraphs(superGraph);
      }
      // set the new graph as the working graph
      setGraphRF({
        graph: newGraph.graph,
        nodes: nodes,
        links: links,
      } as GraphRF);
      // add the new graph to the recent graphs if not already there
      console.log('ADD a new graph3');
      setRecentGraphs(graphRF);
      setSubgraphsStack(JSON.parse(file.result).graph.name);
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
