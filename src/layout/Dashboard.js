/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
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
import FiberNew from '@material-ui/icons/FiberNew';
import Sidebar from '../sidebar';
import useStore from '../store';
import Canvas from './Canvas';
import Card from '@material-ui/core/Card';
import CanvasView from './CanvasView';
import Upload from '../Components/Upload';
import AutocompleteDrop from '../Components/AutocompleteDrop';
import AddIcon from '@material-ui/icons/Add';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
// import UploadFileIcon from '@material-ui/icons/UploadFile';
// import FileUploadIcon from '@material-ui/icons/FileUpload';
// import DriveFolderUploadIcon from '@material-ui/icons/DriveFolderUpload';
// import UploadIcon from '@material-ui/icons/Upload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Fab, Button } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { getGraph, rfToEwoks, toRFEwoksLinks, toRFEwoksNodes } from '../utils';
import MyCard from '../layout/MyCard';
import axios from 'axios';
import { getWorkflows } from '../utils';

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  openFileButton: {
    backgroundColor: '#96a5f9',
  },
  formControl: {
    minWidth: '220px',
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
    backgroundColor: '#3f51b5',
  },
  appBar: {
    // height: 55,
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
    // whiteSpace: 'nowrap',
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
    // height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(0),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 920,
    padding_top: 45,
  },
}));

function download(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export default function Dashboard() {
  const classes = useStyles();

  const inputFile = React.useRef(null);

  const [workflowValue, setWorkflowValue] = React.useState('');
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const selectedElement = useStore((state) => state.selectedElement);
  const selectedSubgraph = useStore((state) => {
    return state.selectedSubgraph;
  });
  const subgraphsStack = useStore((state) => {
    console.log(state);
    return state.subgraphsStack;
  });
  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);
  const [selectedGraph, setSelectedGraph] = React.useState('');
  const [open, setOpen] = React.useState(true);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);

  useEffect(() => {
    console.log(subgraphsStack.length);
  }, [subgraphsStack]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const selectedGraphChange = (event) => {
    console.log(event.target.value, selectedGraph);
    setSelectedGraph(event.target.value);
  };

  const loadFromDisk = (val) => {
    console.log(val, inputFile);
    // TODO: possible race situation with setting pgraphOrSubgraph
    setGraphOrSubgraph(true);
  };

  const saveToDisk = (event) => {
    console.log(graphRF, rfToEwoks(graphRF));
    download(JSON.stringify(graphRF), 'json.txt', 'text/plain');
  };

  const getFromServer = async (event) => {
    console.log('Get graphs from server', workflowValue);
    const response = await axios.get(
      `http://mxbes2-1707:38280/ewoks/workflow/${workflowValue}`
    );
    setWorkingGraph(response.data);
  };

  const newGraph = (event) => {
    // Name of graph unique and used in recentGraphs, graphRF, subgraphsStack
    setGraphRF({ graph: {}, nodes: [], links: [] });
    console.log('Start drawing please!');
  };

  const goToGraph = (e) => {
    e.preventDefault();
    console.log(e.target.text, e.target.id, recentGraphs);
    setSubgraphsStack({ id: e.target.id, label: e.target.text });
    const subgraph = recentGraphs.find((gr) => gr.graph.id === e.target.id);
    console.log(subgraph);
    // subgraph = subgraph ? subgraph : getGraph(e.target.text);
    if (!subgraph) {
      // subgraph = getGraph(e.target.text);
      // console.log(subgraph);
      setGraphRF({
        graph: subgraph.graph,
        nodes: toRFEwoksNodes(subgraph),
        links: toRFEwoksLinks(subgraph),
      });
    } else {
      setGraphRF(subgraph);
    }
  };

  const setInputValue = (val) => {
    console.log(val, recentGraphs);
    setWorkflowValue(val);
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
            <Breadcrumbs aria-label="breadcrumb" color="textPrimary">
              {subgraphsStack[0] &&
                subgraphsStack.map((gr) => (
                  <Link
                    underline="hover"
                    color="textPrimary"
                    href="/"
                    id={gr.id}
                    key={gr.id}
                    value={gr.id}
                    onClick={goToGraph}
                  >
                    {gr.label}
                  </Link>
                ))}
            </Breadcrumbs>
            {subgraphsStack[0] &&
              subgraphsStack[subgraphsStack.length - 1].label}
          </Typography>
          <FormControl variant="standard" className={classes.formControl}>
            <InputLabel
              id="demo-simple-select-filled-label"
              style={{ color: 'white' }}
            >
              Recent Files
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={selectedGraph}
              onChange={selectedGraphChange}
            >
              {recentGraphs.map((gr, index) => (
                <MenuItem value={gr.graph.label} key={gr.graph.id}>
                  <em>{gr.graph.label}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton color="inherit">
            <Fab
              className={classes.openFileButton}
              color="primary"
              size="small"
              component="span"
              aria-label="add"
            >
              <SaveIcon onClick={saveToDisk} />
            </Fab>
          </IconButton>
          <IconButton color="inherit">
            <Fab
              className={classes.openFileButton}
              color="primary"
              size="small"
              component="span"
              aria-label="add"
            >
              <FiberNew onClick={newGraph} />
            </Fab>
          </IconButton>
          <IconButton color="inherit">
            <Upload>
              <AddIcon onClick={loadFromDisk} />
            </Upload>
          </IconButton>
          <IconButton color="inherit">
            <Fab
              className={classes.openFileButton}
              color="primary"
              size="small"
              component="span"
              aria-label="add"
            >
              <CloudDownloadIcon onClick={getFromServer} />
            </Fab>
          </IconButton>
          <IconButton color="inherit">
            <Fab
              className={classes.openFileButton}
              color="primary"
              size="small"
              component="span"
              aria-label="add"
            >
              <CloudUploadIcon />
            </Fab>
          </IconButton>
          <FormControl variant="standard" className={classes.formControl}>
            <AutocompleteDrop setInputValue={setInputValue} />
          </FormControl>
          <IconButton color="inherit">
            <Fab
              className={classes.openFileButton}
              color="primary"
              size="small"
              component="span"
              aria-label="add"
            >
              {/* <b>Open</b> */}
              <DoubleArrowIcon onClick={getFromServer} />
            </Fab>
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
          {/* {selectedSubgraph.graph && selectedSubgraph.graph.id && (
            <span className={classes.canvasView}>
              <CanvasView subgraph={selectedSubgraph} />
            </span>
          )} */}
          {/* <span className={classes.canvasView}>
            <CanvasView />
          </span>
          <span className={classes.canvasView}>
            <CanvasView />
          </span> */}
        </Paper>
      </main>
      {/* <MyCard /> */}
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
