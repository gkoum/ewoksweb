/* eslint-disable jsx-a11y/control-has-associated-label */
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Button } from '@material-ui/core';
import { useState } from 'react';
import useStore from '../store';

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

  // const [selectedFile, setSelectedFile] = useState();
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const subgraphsStack = useStore((state) => state.subgraphsStack);
  const graphOrSubgraph = useStore<Boolean>((state) => state.graphOrSubgraph);

  const workingGraph = useStore((state) => state.workingGraph);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const subGraph = useStore((state) => state.subGraph);
  const setSubGraph = useStore((state) => state.setSubGraph);

  const fileNameChanged = async (event) => {
    console.log(event.target.files[0], recentGraphs, graphRF, subgraphsStack);
    const reader = showFile(event);
    const file = await reader.then((val) => val);
    file.onloadend = async function () {
      const links = [];
      const newGraph = JSON.parse(file.result);
      let working = {};
      if (graphOrSubgraph) {
        working = await setWorkingGraph(newGraph);
      } else {
        console.log('ADDING SUBGRAPH:', newGraph);
        working = await setSubGraph(newGraph);
      }
      console.log(working);
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

export default Upload;
