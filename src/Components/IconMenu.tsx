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

export default function IconMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);

  const graphRF = useStore((state) => state.graphRF);
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

  return (
    <>
      <FormDialog
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
        content={graphRF}
      />
      <Tooltip title="Clone in the canvas or create a new task/graph">
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
            {/* <MenuItem onClick={cloneToCanvas}>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Clone</ListItemText>
              <Typography variant="body2" color="secondary">
                ⌘X
              </Typography>
            </MenuItem> */}
            <MenuItem onClick={() => setOpenSaveDialog(true)}>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Save as..</ListItemText>
              <Typography variant="body2" color="primary">
                Ctrl+C
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleShowEwoksGraph}>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
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
