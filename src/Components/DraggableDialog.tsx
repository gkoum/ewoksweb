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
  const [open, setOpen] = React.useState(false);
  const [graph, setGraph] = React.useState({});
  const graphRF = useStore((state) => state.graphRF);
  const recentGraphs = useStore((state) => state.recentGraphs);

  const handleClickOpen = () => {
    setOpen(true);
    setGraph(rfToEwoks(graphRF, recentGraphs));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open draggable dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Subscribe
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <ReactJson
              src={graph}
              name={''}
              theme={'monokai'}
              collapsed
              collapseStringsAfterLength={30}
              groupArraysAfterLength={15}
              onEdit={(edit) => true}
              onAdd={(add) => true}
              defaultValue={'value'}
              onDelete={(del) => true}
              onSelect={(sel) => true}
              quotesOnKeys={false}
              style={{ 'background-color': 'rgb(59, 77, 172)' }}
              displayDataTypes
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
