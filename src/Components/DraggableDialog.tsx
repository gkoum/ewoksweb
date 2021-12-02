/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { rfToEwoks } from '../utils';
import useStore from '../store';
import ReactJson from 'react-json-view';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog() {
  const [graph, setGraph] = React.useState({});
  const graphRF = useStore((state) => state.graphRF);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const openDraggableDialog = useStore((state) => state.openDraggableDialog);
  const setOpenDraggableDialog = useStore(
    (state) => state.setOpenDraggableDialog
  );
  const [selection, setSelection] = React.useState('ewoks');

  const handleClickOpen = () => {
    setGraph(rfToEwoks(graphRF, recentGraphs));
  };

  const handleClose = () => {
    setOpenDraggableDialog({ open: false, content: {} });
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string
  ) => {
    console.log(newSelection);
    setSelection(newSelection);
    setOpenDraggableDialog({
      open: true,
      content: {
        title: newSelection === 'ewoks' ? 'Ewoks Graph' : 'RF Graph',
        graph:
          newSelection === 'ewoks' ? rfToEwoks(graphRF, recentGraphs) : graphRF,
      },
    });
  };

  return (
    <Dialog
      open={openDraggableDialog.open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {openDraggableDialog.content.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <ToggleButtonGroup
            color="primary"
            value={selection}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="ewoks">Ewoks Graph</ToggleButton>
            <ToggleButton value="rf">RF Graph</ToggleButton>
          </ToggleButtonGroup>
          <hr />
          <ReactJson
            src={openDraggableDialog.content.graph}
            name={'Ewoks graph'}
            theme={'monokai'}
            collapsed
            collapseStringsAfterLength={30}
            groupArraysAfterLength={15}
            enableClipboard={false}
            // onEdit={(edit) => true}
            // onAdd={(add) => true}
            // defaultValue={'value'}
            // onDelete={(del) => true}
            // onSelect={(sel) => true}
            quotesOnKeys={false}
            style={{ backgroundColor: 'rgb(59, 77, 172)' }}
            displayDataTypes
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
