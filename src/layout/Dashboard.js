/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SaveIcon from '@material-ui/icons/Save';
import Sidebar from '../sidebar';
import useStore from '../store';
import Canvas from './Canvas';
import Card from '@material-ui/core/Card';
import CanvasView from './CanvasView';
import ButtonWrapper from '../Components/ButtonWrapper';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

// import { mainListItems, secondaryListItems } from './listItems';
// import Chart from './Chart';
// import Deposits from './Deposits';
// import Orders from './Orders';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: '250px',
    backgroundColor: '#7685dd',
  },

  canvasView: {
    'z-index': 2000,
  },

  root: {
    display: 'flex',
    // width: '100%',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    // height: 45,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    // width: '100%',
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 1000,
    padding_top: 45,
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  const inputFile = React.useRef(null);

  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const ewoksElements = useStore((state) => state.ewoksElements);
  const selectedElement = useStore((state) => state.selectedElement);
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const selectedSubgraph = useStore((state) => state.selectedSubgraph);
  const [selectedGraph, setSelectedGraph] = React.useState('graph');
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const selectedGraphChange = (event) => {
    console.log(event, selectedGraph);
  };

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            graph
          </Typography>

          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="demo-simple-select-filled-label">
              Recent Files
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={selectedGraph}
              onChange={selectedGraphChange}
            >
              <MenuItem value="">
                <em>Graph</em>
              </MenuItem>
              <MenuItem value={10}>subGraph</MenuItem>
              <MenuItem value={20}>subsubGraph</MenuItem>
              <MenuItem value={30}>subsubsubGraph</MenuItem>
            </Select>
          </FormControl>
          <IconButton color="inherit">
            <ButtonWrapper>
              <SaveIcon />
            </ButtonWrapper>
          </IconButton>
          <IconButton color="inherit">
            <ButtonWrapper>
              <AddIcon onClick={onButtonClick} />
              <input
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: 'none' }}
              />
            </ButtonWrapper>
          </IconButton>
          <IconButton color="inherit">
            <ButtonWrapper>
              <CloudDownloadIcon />
            </ButtonWrapper>
          </IconButton>
          <IconButton color="inherit">
            <ButtonWrapper>
              <CloudUploadIcon />
            </ButtonWrapper>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {/* <IconButton color="inherit">
            <AccessAlarmIcon />
          </IconButton> */}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {/* <List>{mainListItems}</List> */}
        <Divider />
        {/* <List>{secondaryListItems}</List> */}
        <Sidebar element={selectedElement} />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Paper className={fixedHeightPaper}>
          <Canvas />
          {selectedSubgraph.graph && selectedSubgraph.graph.id && (
            <span className={classes.canvasView}>
              <CanvasView subgraph={selectedSubgraph} />
            </span>
          )}
          {/* <span className={classes.canvasView}>
            <CanvasView />
          </span>
          <span className={classes.canvasView}>
            <CanvasView />
          </span> */}
        </Paper>
      </main>
      {/* <Canvas /> */}
      {/* <main> */}
      {/* <div className={classes.appBarSpacer} /> */}
      {/* <Container className={classes.container}> */}
      {/* <Grid container>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <Canvas />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper} />
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper} />
        </Grid>
      </Grid> */}
      {/* <Box pt={4}>
        <Copyright />
      </Box> */}
      {/* </Container> */}
      {/* </main> */}
    </div>
  );
}
