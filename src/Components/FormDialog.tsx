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
import { rfToEwoks, toRFEwoksLinks, toRFEwoksNodes } from '../utils';

export default function FormDialog(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(false);
  const selectedElement = useStore<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );
  const graphRF = useStore((state) => state.graphRF);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const handleSave = () => {
    // get the selected element (graph or Node) give a new name before saving
    // fire a POST
    console.log(open);
    props.setOpenSaveDialog(false);
    if (selectedElement.input_nodes) {
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
      console.log(response);
    } else if (selectedElement.position) {
      // it is a node save the selectedElement
      console.log(selectedElement);
    }
  };

  const newNameChanged = (event) => {
    setNewName(event.target.value);
    console.log(event.target.value, open);
  };

  const handleClose = () => {
    console.log(open);
    props.setOpenSaveDialog(false);
  };
  const { open } = props;

  useEffect(() => {
    console.log(open);
    setIsOpen(open);
  }, [open]);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Give the new name</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The graph-node will be saved with the name you will provide and can be
          opened as a new graph to be edited.
        </DialogContentText>
        <TextField
          margin="dense"
          id="name"
          label="New Name"
          type=""
          fullWidth
          variant="standard"
          value={newName || ''}
          onChange={newNameChanged}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
