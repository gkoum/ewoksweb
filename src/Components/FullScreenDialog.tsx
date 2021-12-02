import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TabPanel from './TabPanel';

const useStyles = makeStyles({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function FullScreenDialog(props) {
  console.log(props);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    console.log(open, props.openSettings);
    // setOpen(props.openSettings);
  }, [open, props.openSettings]);

  // setOpen(props.openClose);
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    props.handleOpenSettings();
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={props.openSettings}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Resources Management
            </Typography>
            <Button color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        {/* <List>
          <ListItem button>
            <ListItemText
              primary="Manage my Workflows"
              secondary="Upload-Download-Discover"
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Manage my Tasks"
              secondary="Upload-Download-Discover"
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Profile" secondary="manage" />
          </ListItem>
          <Divider />
        </List> */}
        <TabPanel />
      </Dialog>
    </div>
  );
}

export default FullScreenDialog;
