/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import clsx from 'clsx';
// import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
// import Badge from '@material-ui/core/Badge';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SaveIcon from '@material-ui/icons/Save';
import FiberNew from '@material-ui/icons/FiberNew';
import Sidebar from '../sidebar';
import useStore from '../store';
import Canvas from './Canvas';
import Upload from '../Components/Upload';
import AutocompleteDrop from '../Components/AutocompleteDrop';
import AddIcon from '@material-ui/icons/Add';
// import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Fab, Button } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { rfToEwoks } from '../utils';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import axios from 'axios';
import SimpleSnackbar from '../Components/Snackbar';
// import FullScreenDialog from '../Components/FullScreenDialog';
import TemporaryDrawer from '../Components/Drawer';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardStyle from './DashboardStyle';
import SendIcon from '@material-ui/icons/Send';
import IntegratedSpinner from '../Components/IntegratedSpinner';

const useStyles = DashboardStyle;

function download(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export default function Dashboard() {
  // const useStyles = DashboardStyle;
  const classes = useStyles();

  const inputFile = React.useRef(null);

  const [workflowValue, setWorkflowValue] = React.useState('');
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const selectedElement = useStore((state) => state.selectedElement);
  const subgraphsStack = useStore((state) => {
    console.log(state);
    return state.subgraphsStack;
  });
  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);
  const [selectedGraph, setSelectedGraph] = React.useState('');
  const [open, setOpen] = React.useState(true);
  const [editing, setEditing] = React.useState(false);
  const [openSettings, setOpenSettings] = React.useState(false);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setSubGraph = useStore((state) => state.setSubGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const [gettingFromServer, setGettingFromServer] = React.useState(false);

  useEffect(() => {
    console.log(subgraphsStack.length);
  }, [subgraphsStack]);

  const handleOpenSettings = () => {
    setOpenSettings(!openSettings);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    // setEditing(!editing);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const selectedGraphChange = (event) => {
    setSelectedGraph(event.target.value);
  };

  const loadFromDisk = (val) => {
    // TODO: possible race situation with setting pgraphOrSubgraph
    setGraphOrSubgraph(true);
  };

  const saveToDisk = (event) => {
    download(
      JSON.stringify(rfToEwoks(graphRF, recentGraphs), null, 2),
      `${graphRF.graph.label}.json`,
      'text/plain'
    );
  };

  const saveToServer = async () => {
    // console.log('Save graph to server', graphRF, recentGraphs);
    // if id: new_graph000 POST and id=label
    // else PUT and replace existing on server
    if (graphRF.graph.id === 'new_graph000') {
      const newIdGraph = {
        graph: { ...graphRF.graph, id: graphRF.graph.label },
        nodes: graphRF.nodes,
        links: graphRF.links,
      };
      const response = await axios
        .post(
          `http://localhost:5000/workflows`,
          rfToEwoks(newIdGraph, recentGraphs)
        )
        .then((res) => {
          console.log(res.data);
          setWorkingGraph(res.data);
          setRecentGraphs({}, true);
        });
    } else if (graphRF.graph.id) {
      const response = await axios.put(
        `http://localhost:5000/workflow/${graphRF.graph.id}`, // ${graphRF.graph.id}
        rfToEwoks(graphRF, recentGraphs)
      );
    } else {
      setOpenSnackbar({
        open: true,
        text: 'No graph exists to save!',
        severity: 'warning',
      });
    }
  };

  const executeWorkflow = async () => {
    console.log('execute workflow', recentGraphs, graphRF);
    if (recentGraphs.length > 0) {
      await axios
        .post(
          `http://localhost:5000/workflow/execute`,
          rfToEwoks(graphRF, recentGraphs)
        )
        .then((res) => console.log(res))
        .catch((error) => console.log(error));
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please open a workflow in the canvas to execute',
        severity: 'warning',
      });
    }
  };

  const getSubgraphFromServer = () => {
    getFromServer('subgraph');
  };

  const getFromServer = async (isSubgraph) => {
    if (workflowValue) {
      setGettingFromServer(true);
      console.log('setGettingFromServer started');
      const response = await axios.get(
        // `http://mxbes2-1707:38280/ewoks/workflow/${workflowValue}`
        `http://localhost:5000/workflow/${workflowValue}`
      );
      if (response.data) {
        setGettingFromServer(false);
        console.log('setGettingFromServer');
        if (isSubgraph === 'subgraph') {
          setSubGraph(response.data);
        } else {
          setWorkingGraph(response.data);
        }
      } else {
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: 'Could not locate the requested workflow! Maybe it is deleted!',
          severity: 'warning',
        });
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please select a graph to fetch and re-click!',
        severity: 'warning',
      });
    }
  };

  const newGraph = (event) => {
    // Name of graph unique and used in recentGraphs, graphRF, subgraphsStack
    // setGraphRF(initializedGraph);
    setWorkingGraph(initializedGraph);
  };

  const goToGraph = (e) => {
    e.preventDefault();
    // console.log(e.target.text, e.target.id, recentGraphs);
    setSubgraphsStack({ id: e.target.id, label: e.target.text });
    const subgraph = recentGraphs.find((gr) => gr.graph.id === e.target.id);

    if (!subgraph) {
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
    setWorkflowValue(val);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <SimpleSnackbar />
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
            <Breadcrumbs aria-label="breadcrumb" color="secondary">
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
          <Tooltip title="Save to Disk">
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
          </Tooltip>
          <Tooltip title="Load from Disk">
            <IconButton color="inherit">
              <Upload>
                <AddIcon onClick={loadFromDisk} />
              </Upload>
            </IconButton>
          </Tooltip>
          <div className={classes.verticalRule} />
          <IntegratedSpinner tooltip="Save Workflow">
            <CloudUploadIcon onClick={saveToServer} />
          </IntegratedSpinner>
          <FormControl variant="standard" className={classes.formControl}>
            <AutocompleteDrop setInputValue={setInputValue} />
          </FormControl>
          <IntegratedSpinner
            getting={gettingFromServer}
            tooltip="Open and edit Workflow"
            action={getFromServer}
          >
            <CloudDownloadIcon />
          </IntegratedSpinner>
          <IntegratedSpinner
            tooltip="Add workflow as subgraph"
            action={getSubgraphFromServer}
          >
            <ArrowDownwardIcon />
          </IntegratedSpinner>
          <IntegratedSpinner
            tooltip="Execute Workflow"
            action={executeWorkflow}
          >
            <SendIcon />
          </IntegratedSpinner>
          <div className={classes.verticalRule} />
          <Tooltip title="Manage tasks and workflows">
            <IconButton color="inherit">
              <Fab
                className={classes.openFileButton}
                color="primary"
                size="small"
                component="span"
                aria-label="add"
              >
                <SettingsIcon onClick={handleOpenSettings} />
              </Fab>
            </IconButton>
          </Tooltip>
          <TemporaryDrawer
            handleOpenSettings={handleOpenSettings}
            openSettings={openSettings}
          />
          {/* <FullScreenDialog
            handleOpenSettings={handleOpenSettings}
            openSettings={openSettings}
          /> */}
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
        <Divider />
        <Sidebar element={selectedElement} />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Paper className={fixedHeightPaper}>
          <Canvas />
        </Paper>
      </main>
      <Drawer />
    </div>
  );
}
