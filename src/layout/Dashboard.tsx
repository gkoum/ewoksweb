/* eslint-disable jsx-a11y/control-has-associated-label */
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import React, { useEffect } from 'react';
import clsx from 'clsx';
// import { createStyles, makeStyles } from '@material-ui/styles';

// import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar from '../sidebar';
import useStore from '../store';
import Canvas from './Canvas';
import Card from '@mui/material/Card';
import CanvasView from './CanvasView';
import ButtonWrapper from '../Components/ButtonWrapper';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Fab, Button } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { findGraphWithName } from '../utils';
import MyCard from './MyCard';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const useStyles = () => {
  return {};
}; // makeStyles((theme: Theme) =>
//   openFileButton: {
//     backgroundColor: '#96a5f9',
//   },
//   formControl: {
//     minWidth: '220px',
//     backgroundColor: '#96a5f9',
//   },

//   canvasView: {
//     'z-index': 2000,
//   },
//   root: {
//     display: 'flex',
//     // width: '100%',
//   },
//   toolbar: {
//     paddingRight: 24, // keep right padding when drawer closed
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     // padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     // ...theme.mixins.toolbar,
//   },
//   toolbarIcon: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     padding: '0 8px',
//     // ...theme.mixins.toolbar,
//   },
//   appBar: {
//     // height: 45,
//     // zIndex: theme.zIndex.drawer + 1,
//     // transition: theme.transitions.create(['width', 'margin'], {
//     //   easing: theme.transitions.easing.sharp,
//     //   duration: theme.transitions.duration.leavingScreen,
//     // }),
//   },
//   appBarShift: {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     // transition: theme.transitions.create(['width', 'margin'], {
//     //   easing: theme.transitions.easing.sharp,
//     //   duration: theme.transitions.duration.enteringScreen,
//     // }),
//   },
//   menuButton: {
//     marginRight: 36,
//   },
//   menuButtonHidden: {
//     display: 'none',
//   },
//   title: {
//     flexGrow: 1,
//   },
//   drawerPaper: {
//     position: 'relative',
//     whiteSpace: 'nowrap',
//     width: drawerWidth,
//     // transition: theme.transitions.create('width', {
//     //   easing: theme.transitions.easing.sharp,
//     //   duration: theme.transitions.duration.enteringScreen,
//     // }),
//   },
//   drawerPaperClose: {
//     overflowX: 'hidden',
//     // transition: theme.transitions.create('width', {
//     //   easing: theme.transitions.easing.sharp,
//     //   duration: theme.transitions.duration.leavingScreen,
//     // }),
//     // width: theme.spacing(7),
//     // [theme.breakpoints.up('sm')]: {
//     //   width: theme.spacing(9),
//     // },
//   },
//   // appBarSpacer: theme.mixins.toolbar,
//   content: {
//     // width: '100%',
//     flexGrow: 1,
//     height: '100vh',
//     overflow: 'auto',
//   },
//   container: {
//     // paddingTop: theme.spacing(1),
//     // paddingBottom: theme.spacing(1),
//   },
//   paper: {
//     // padding: theme.spacing(2),
//     display: 'flex',
//     overflow: 'auto',
//     flexDirection: 'column',
//   },
//   fixedHeight: {
//     height: 1000,
//     padding_top: 45,
//   },
// }));

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

  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const ewoksElements = useStore((state) => state.ewoksElements);
  const selectedElement = useStore((state) => state.selectedElement);
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const selectedSubgraph = useStore((state) => {
    console.log(state);
    return state.selectedSubgraph;
  });
  const subgraphsStack = useStore((state) => {
    console.log(state);
    return state.subgraphsStack;
  });
  const [selectedGraph, setSelectedGraph] = React.useState('graph');
  const [open, setOpen] = React.useState(true);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);

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
    console.log(event, selectedGraph);
  };

  const loadFromDisk = (val) => {
    console.log(val, inputFile);
  };

  const saveToDisk = (val) => {
    console.log(val, inputFile);
    download(JSON.stringify(graphRF), 'json.txt', 'text/plain');
  };

  const goToGraph = (e) => {
    e.preventDefault();
    setSubgraphsStack(e.target.text);
    setGraphRF(findGraphWithName(e.target.text));
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
                subgraphsStack.map((name) => (
                  <Link
                    underline="hover"
                    color="textPrimary"
                    href="/"
                    key={name}
                    onClick={goToGraph}
                  >
                    {name}
                  </Link>
                ))}
            </Breadcrumbs>
            {subgraphsStack[subgraphsStack.length - 1]}
          </Typography>

          <FormControl variant="standard" className={classes.formControl}>
            <InputLabel
              style={{ color: 'white' }}
              id="demo-simple-select-standard-label"
            >
              Recent Files
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard"
              id="ddemo-simple-select-standard"
              value={selectedGraph}
              onChange={selectedGraphChange}
            >
              <MenuItem value={1}>
                <em>Graph</em>
              </MenuItem>
              <MenuItem value={10}>subGraph</MenuItem>
              <MenuItem value={20}>subsubGraph</MenuItem>
              <MenuItem value={30}>subsubsubGraph</MenuItem>
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
            <ButtonWrapper>
              <AddIcon onClick={loadFromDisk} />
            </ButtonWrapper>
          </IconButton>
          <IconButton color="inherit">
            <Fab
              className={classes.openFileButton}
              color="primary"
              size="small"
              component="span"
              aria-label="add"
            >
              <CloudDownloadIcon />
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
