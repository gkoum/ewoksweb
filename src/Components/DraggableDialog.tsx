import React, { useEffect } from 'react';
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

export default function DraggableDialog(props) {
  // { open, content }
  const [graph, setGraph] = React.useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [callbackProps, setCallbackProps] = React.useState({});
  const graphRF = useStore((state) => state.graphRF);
  const recentGraphs = useStore((state) => state.recentGraphs);

  const [selection, setSelection] = React.useState('ewoks');

  const { open, content } = props;

  useEffect(() => {
    setGraph((content && content.object) || {});
    setIsOpen(open || false);
    setTitle((content && content.title) || '');
    setCallbackProps(content.callbackProps);
  }, [open, content]);

  const handleClickOpen = () => {
    setGraph(rfToEwoks(graphRF, recentGraphs));
  };

  const handleClose = () => {
    console.log(graph);
    setIsOpen(false);
  };

  const handleSave = () => {
    console.log(graph);
    setIsOpen(false);
    props.setValue(graph, callbackProps);
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string
  ) => {
    setSelection(newSelection);
    setTitle(newSelection === 'ewoks' ? 'Ewoks Graph' : 'RF Graph');
    setGraph(
      newSelection === 'ewoks' ? rfToEwoks(graphRF, recentGraphs) : graphRF
    );
    setIsOpen(true);
  };

  const graphChanged = (edit) => {
    setGraph(edit.updated_src);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {title || ''}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {['Ewoks Graph', 'RF Graph'].includes(title) && (
            <ToggleButtonGroup
              color="primary"
              value={selection}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value="ewoks">Ewoks Graph</ToggleButton>
              <ToggleButton value="rf">RF Graph</ToggleButton>
            </ToggleButtonGroup>
          )}
          <hr />
          <ReactJson
            src={graph}
            name="Ewoks graph"
            theme="monokai"
            collapsed
            collapseStringsAfterLength={30}
            groupArraysAfterLength={15}
            enableClipboard={false}
            onEdit={(edit) => graphChanged(edit)}
            onAdd={(add) => graphChanged(add)}
            defaultValue="value"
            onDelete={(del) => graphChanged(del)}
            onSelect={(sel) => true}
            quotesOnKeys={false}
            style={{ backgroundColor: 'rgb(59, 77, 172)' }}
            displayDataTypes
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
