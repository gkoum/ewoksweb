import React from 'react';
import useStore from '../store';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Cloud from '@material-ui/icons/Cloud';
import { Button, Menu, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import FormDialog from './FormDialog';
import type {
  EwoksRFLink,
  EwoksRFNode,
  GraphDetails,
  GraphRF,
  Task,
} from '../types';

export default function IconMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);
  const [elementToEdit, setElementToEdit] = React.useState<Task | GraphRF>(
    {} as EwoksRFNode | GraphRF
  );
  const [doAction, setDoAction] = React.useState<string>('');
  const selectedElement = useStore<EwoksRFNode | EwoksRFLink | GraphDetails>(
    (state) => state.selectedElement
  );
  const initializedTask = useStore((state) => state.initializedTask);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const graphRF = useStore((state) => state.graphRF);
  const tasks = useStore((state) => state.tasks);
  const { handleShowEwoksGraph } = props;

  // const cloneToCanvas = () => {
  //   console.log('clone the graphRF initializing the id and the label', graphRF);
  // };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const action = (action, element) => {
    console.log(action, element, tasks);
    setDoAction(action);
    if (action === 'newTask') {
      setElementToEdit({} as Task);
    } else if (action === 'cloneTask') {
      if ('position' in element) {
        const task = tasks.find(
          (tas) => tas.task_identifier === element.task_identifier
        );
        console.log(task);
        setElementToEdit(task || initializedTask);
      } else {
        setOpenSnackbar({
          open: true,
          text: 'First select in the canvas a Task to clone',
          severity: 'success',
        });
        return;
      }
    } else if (action === 'cloneGraph') {
      setElementToEdit(graphRF);
    }

    setOpenSaveDialog(true);
  };

  return (
    <>
      <FormDialog
        elementToEdit={elementToEdit}
        action={doAction}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
      <Tooltip title="Clone or create task/workflow">
        <Button
          style={{ margin: '8px' }}
          variant="contained"
          color="primary"
          onClick={handleClick}
          size="small"
        >
          <MenuIcon />
        </Button>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Paper>
          <MenuList>
            <MenuItem onClick={() => action('newTask', {})}>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Task</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => action('cloneTask', selectedElement)}>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Clone Task</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => action('cloneGraph', graphRF)}>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Clone Graph</ListItemText>
              <Typography variant="body2" color="primary"></Typography>
            </MenuItem>
            <MenuItem onClick={handleShowEwoksGraph}>
              <ListItemIcon></ListItemIcon>
              <ListItemText>Graph in json</ListItemText>
            </MenuItem>
            {/* <Divider />
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Web Clipboard?</ListItemText>
            </MenuItem> */}
          </MenuList>
        </Paper>
      </Menu>
    </>
  );
}
