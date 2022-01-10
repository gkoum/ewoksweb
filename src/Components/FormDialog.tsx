import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useStore from '../store';
import type { EwoksRFLink, EwoksRFNode } from '../types';
import axios from 'axios';
import { rfToEwoks } from '../utils';

export default function FormDialog(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const selectedElement = useStore<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );
  const graphRF = useStore((state) => state.graphRF);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [isGraph, setIsGraph] = React.useState('Workflow');

  const handleSave = () => {
    // get the selected element (graph or Node) give a new name before saving
    // fire a POST
    console.log(open, newName);
    props.setOpenSaveDialog(false);
    if (newName !== '') {
      if (isGraph) {
        // save the graphRF
        const response = axios
          .post(
            `http://localhost:5000/workflows`,
            rfToEwoks(
              {
                ...graphRF,
                graph: { ...graphRF.graph, id: newName, label: newName },
              },
              recentGraphs
            )
          )
          .then((res) => {
            console.log(res.data);
            setWorkingGraph(res.data);
            setRecentGraphs({}, true);
          })
          .catch((error) => {
            console.log(error);
            setOpenSnackbar({
              open: true,
              text: 'The name exists. Please retry with another name',
              // TODO: replace by server error
              severity: 'warning',
            });
          });
      } else if (selectedElement.position) {
        // it is a node save the selectedElement
        console.log(selectedElement);
      }
    }
  };

  const newNameChanged = (event) => {
    console.log(event.target.value, open);
    setNewName(event.target.value);
  };

  const handleClose = () => {
    props.setOpenSaveDialog(false);
    setNewName('');
  };
  const { open } = props;

  useEffect(() => {
    setIsOpen(open);
    setIsGraph(selectedElement.input_nodes ? 'Workflow' : 'Task');
    setNewName(graphRF.graph.label);
  }, [open, graphRF.graph.label, selectedElement.input_nodes]);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Give the new {isGraph} name</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The {isGraph} will be saved with the name you will provide.
        </DialogContentText>
        <TextField
          margin="dense"
          id="saveAsName"
          label="New Name"
          fullWidth
          variant="standard"
          value={newName}
          onChange={newNameChanged}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save {isGraph}</Button>
      </DialogActions>
    </Dialog>
  );
}
