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
import {
  Badge,
  Breadcrumbs,
  Fab,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
} from '@mui/material';
import useStore from '../store';
import { findGraphWithName } from '../utils';
import ButtonWrapper from '../Components/ButtonWrapper';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Sidebar from '../sidebar';
import Canvas from './Canvas';

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

function download(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export default function Dashboard1() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);

  useEffect(() => {
    console.log(subgraphsStack.length);
  }, [subgraphsStack]);

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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
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
          <FormControl variant="standard">
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
            <Fab color="primary" size="small" component="span" aria-label="add">
              <SaveIcon onClick={saveToDisk} />
            </Fab>
          </IconButton>
          <IconButton color="inherit">
            <ButtonWrapper>
              <AddIcon onClick={loadFromDisk} />
            </ButtonWrapper>
          </IconButton>
          <IconButton color="inherit">
            <Fab color="primary" size="small" component="span" aria-label="add">
              <CloudDownloadIcon />
            </Fab>
          </IconButton>
          <IconButton color="inherit">
            <Fab color="primary" size="small" component="span" aria-label="add">
              <CloudUploadIcon />
            </Fab>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {/* <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
        <Divider />
        <Sidebar element={selectedElement} />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Paper>
          <Canvas />
        </Paper>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
          ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
          elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
          sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
          mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
          risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
          purus viverra accumsan in. In hendrerit gravida rutrum quisque non
          tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
          morbi tristique senectus et. Adipiscing elit duis tristique
          sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </Main>
    </Box>
  );
}
