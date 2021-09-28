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
  const classes = useStyles();

  const [selectedFile, setSelectedFile] = useState();
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);

  const fileNameChanged = async (event) => {
    console.log(event.target.files[0]);
    // setSelectedFile(event.target.files[0]);
    const reader = showFile(event);
    const file = await reader.then((val) => val);
    file.onloadend = function () {
      // console.log('DONE', file.result); // readyState will be 2
      setSelectedFile(file.result);
      // console.log(selectedFile);
      const nodes = toRFEwoksNodes(JSON.parse(file.result));
      const links = toRFEwoksLinks(JSON.parse(file.result));
      console.log(nodes, links);
      setGraphRF({
        graph: JSON.parse(file.result).graph,
        nodes: nodes,
        links: links,
      } as GraphRF);
      setSubgraphsStack('initialiase');
      setSubgraphsStack(JSON.parse(file.result).graph.id);
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
