import React from 'react';
import useStore from '../store';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Cloud from '@material-ui/icons/Cloud';
import { Button, Menu, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { rfToEwoks } from '../utils';

export default function IconMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const setOpenDraggableDialog = useStore(
    (state) => state.setOpenDraggableDialog
  );
  const graphRF = useStore((state) => state.graphRF);
  const recentGraphs = useStore((state) => state.recentGraphs);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDraggableDialog = () => {
    console.log(graphRF);
    setOpenDraggableDialog({
      open: true,
      content: {
        title: 'Ewoks Graph',
        graph: rfToEwoks(graphRF, recentGraphs),
      },
    });
  };

  return (
    <>
      <Tooltip title="Clone in the canvas or as a new task">
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
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Clone to canvas</ListItemText>
              <Typography variant="body2" color="text.secondary">
                ⌘X
              </Typography>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Clone and save</ListItemText>
              <Typography variant="body2" color="text.secondary">
                ⌘C
              </Typography>
            </MenuItem>
            <MenuItem onClick={openDraggableDialog}>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>View graphs</ListItemText>
              <Typography variant="body2" color="text.secondary">
                ⌘V
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Web Clipboard</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </Menu>
    </>
  );
}
