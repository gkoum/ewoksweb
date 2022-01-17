import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useStore from '../store';
import type {
  EwoksRFLink,
  EwoksRFNode,
  GraphDetails,
  GraphEwoks,
  GraphRF,
  Task,
} from '../types';
import axios from 'axios';
import { rfToEwoks } from '../utils';
import { toEwoksNodes } from '../utils/toEwoksNodes';

export default function FormDialog(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [taskType, setTaskType] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [icon, setIcon] = React.useState('');
  const [optionalInputNames, setOptionalInputNames] = React.useState(
    [] as string[]
  );
  const [requiredInputNames, setRequiredInputNames] = React.useState(
    [] as string[]
  );
  const [outputNames, setOutputNames] = React.useState([] as string[]);
  const selectedElement = useStore<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );
  // const graphRF = useStore((state) => state.graphRF);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [element, setElement] = React.useState<Task | GraphRF>(
    {} as Task | GraphRF
  );

  const { open, action, elementToEdit } = props;

  useEffect(() => {
    console.log(elementToEdit);
    setIsOpen(open);
    setElement(elementToEdit);
    // if selected element a task get its name
    if (action === 'cloneGraph') {
      // const selG = elementToEdit as GraphDetails;
      setNewName(elementToEdit.label);
    } else {
      setNewName(elementToEdit.task_identifier);
      setTaskType(elementToEdit.task_type);
      setCategory(elementToEdit.category);
      setIcon(elementToEdit.icon);
      setOptionalInputNames(elementToEdit.optional_input_names);
      setRequiredInputNames(elementToEdit.required_input_names);
      setOutputNames(elementToEdit.output_names);
    }
  }, [open, action, elementToEdit]);

  const handleSave = () => {
    // get the selected element (graph or Node) give a new name before saving
    // fire a POST
    console.log(newName, action);
    if (newName !== '' && action === 'cloneGraph') {
      const el = element as GraphRF;
      axios // if await is used const response =
        .post(
          `http://localhost:5000/workflows`,
          rfToEwoks({
            ...el,
            graph: { ...el.graph, id: newName, label: newName },
          })
        )
        .then((res) => {
          props.setOpenSaveDialog(false);
          setWorkingGraph(res.data as GraphEwoks);
          setRecentGraphs({} as GraphRF, true);
        })
        .catch(() => {
          // error
          setOpenSnackbar({
            open: true,
            text: 'The name exists. Please retry with another name',
            // TODO: replace by server error
            severity: 'warning',
          });
        });
    } else if (['cloneTask', 'newTask'].includes(action)) {
      // or newTask
      console.log('Save the task!', element);
      const elem = element as Task;
      axios // if await is used const response =
        .post(`http://localhost:5000/tasks`, {
          ...elem,
        })
        .then((res) => {
          console.log(res);
          props.setOpenSaveDialog(false);
        })
        .catch((error) => {
          console.log(error.message + error.response.data);
          setOpenSnackbar({
            open: true,
            text: error.response.data,
            severity: 'warning',
          });
        });
    }
  };

  const newNameChanged = (event) => {
    const val = event.target.value;
    setNewName(val);
    if ('graph' in selectedElement) {
      const el = element as GraphRF;
      setElement({
        ...el,
        graph: { ...el.graph, id: val, label: val },
      });
    } else {
      setElement({
        ...element,
        task_identifier: val,
      });
    }
  };

  const taskTypeChanged = (event) => {
    const val = event.target.value;
    setTaskType(val);
    setElement({
      ...element,
      task_type: val,
    });
  };

  const categoryChanged = (event) => {
    const val = event.target.value;
    setCategory(val);

    setElement({
      ...element,
      category: val,
    });
  };

  const iconChanged = (event) => {
    const val = event.target.value;
    setIcon(val);
    setElement({
      ...element,
      icon: val,
    });
  };

  const optionalInputNamesChanged = (event) => {
    const val = event.target.value;
    setOptionalInputNames(val.split(','));
    setElement({
      ...element,
      optional_input_names: val.split(','),
    });
  };

  const requiredInputNamesChanged = (event) => {
    const val = event.target.value;
    setRequiredInputNames(val.split(','));
    setElement({
      ...element,
      required_input_names: val.split(','),
    });
  };

  const outputNamesChanged = (event) => {
    const val = event.target.value;
    setOutputNames(val.split(','));
    setElement({
      ...element,
      output_names: val.split(','),
    });
  };

  const handleClose = () => {
    props.setOpenSaveDialog(false);
    setNewName('');
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        Give the new {action === 'cloneGraph' ? 'Workflow' : 'Task'} name
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          The {action === 'cloneGraph' ? 'Workflow' : 'Task'} will be saved to
          file with the name-identifier you will provide.
        </DialogContentText>
        <TextField
          margin="dense"
          id="saveAsName"
          label="New Name - Identifier"
          fullWidth
          variant="standard"
          value={newName}
          onChange={newNameChanged}
        />
        {action !== 'cloneGraph' && (
          <>
            <TextField
              margin="dense"
              id="saveAsName"
              label="Task Type"
              fullWidth
              variant="standard"
              value={taskType}
              onChange={taskTypeChanged}
            />
            <TextField
              margin="dense"
              id="category"
              label="Category"
              fullWidth
              variant="standard"
              value={category}
              onChange={categoryChanged}
            />
            <TextField
              margin="dense"
              id="icon"
              label="icon"
              fullWidth
              variant="standard"
              value={icon}
              onChange={iconChanged}
            />
            <TextField
              margin="dense"
              id="optionalInputNames"
              label="Optional inputs"
              fullWidth
              variant="standard"
              value={optionalInputNames}
              onChange={optionalInputNamesChanged}
            />
            <TextField
              margin="dense"
              id="requiredInputNames"
              label="Required inputs"
              fullWidth
              variant="standard"
              value={requiredInputNames}
              onChange={requiredInputNamesChanged}
            />
            <TextField
              margin="dense"
              id="outputNames"
              label="Outputs"
              fullWidth
              variant="standard"
              value={outputNames}
              onChange={outputNamesChanged}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>
          Save {action === 'cloneGraph' ? 'Workflow' : 'Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
