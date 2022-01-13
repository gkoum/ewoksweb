/* eslint-disable jsx-a11y/control-has-associated-label */
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import useStore from '../store';
import { validateEwoksGraph } from '../utils/EwoksValidator';

const useStyles = makeStyles(() =>
  createStyles({
    openFileButton: {
      backgroundColor: '#96a5f9',
    },
  })
);

const showFile = async (e) => {
  e.preventDefault();
  const reader = new FileReader();
  reader.addEventListener = async (e) => {
    const text = e.target.result;
  };
  reader.readAsText(e.target.files[0]);
  return reader;
};

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

function Upload(props) {
  const classes = useStyles();

  // const [selectedFile, setSelectedFile] = useState();
  const graphRF = useStore((state) => state.graphRF);
  const graphOrSubgraph = useStore<Boolean>((state) => state.graphOrSubgraph);

  const workingGraph = useStore((state) => state.workingGraph);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setSubGraph = useStore((state) => state.setSubGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const fileNameChanged = async (event) => {
    // console.log(event.target.files[0], recentGraphs, graphRF, subgraphsStack);

    if (workingGraph.graph.id === graphRF.graph.id) {
      const reader = showFile(event);
      const file = await reader.then((val) => val);
      file.onloadend = async function () {
        if (isJsonString(file.result)) {
          const newGraph = JSON.parse(file.result as string);
          let working = {};
          if (graphOrSubgraph) {
            const { result } = validateEwoksGraph(newGraph);
            if (result) {
              working = await setWorkingGraph(newGraph);
            }
          } else {
            working = await setSubGraph(newGraph);
          }
        } else {
          setOpenSnackbar({
            open: true,
            text:
              'Error in JSON structure. Please correct input file and retry!',
            severity: 'error',
          });
        }
      };
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to add a new node-graph to any sub-graph!',
        severity: 'success',
      });
    }
  };

  return (
    <div>
      <label htmlFor="load-graph">
        <input
          style={{ display: 'none' }}
          id="load-graph"
          name="load-graph"
          type="file"
          onChange={fileNameChanged}
        />
        <Fab
          className={classes.openFileButton}
          color="primary"
          size="small"
          component="span"
          aria-label="add"
        >
          {props.children}
        </Fab>
      </label>
    </div>
  );
}

export default Upload;
