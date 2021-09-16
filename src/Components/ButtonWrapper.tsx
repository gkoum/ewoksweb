/* eslint-disable jsx-a11y/control-has-associated-label */
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    openFileButton: {
      backgroundColor: '#96a5f9',
    },
  })
);

function OpenFile(props) {
  const classes = useStyles();

  return (
    <div>
      <label htmlFor="upload-photo">
        <input
          style={{ display: 'none' }}
          id="upload-photo"
          name="upload-photo"
          type="file"
        />
        {/* <Fab
          color="secondary"
          size="small"
          component="span"
          aria-label="add"
          variant="extended"
        >
          <AddIcon /> Upload photo
        </Fab>
        <br />
        <br /> */}
        <Fab
          className={classes.openFileButton}
          color="primary"
          size="small"
          component="span"
          aria-label="add"
        >
          {props.children}
          {/* <SaveIcon /> */}
          {/* <AddIcon /> */}
        </Fab>
        {/* <br />
        <br />
        <Button color="secondary" variant="contained" component="span">
          Upload button
        </Button>{' '} */}
      </label>
    </div>
  );
}

const rootElement = document.querySelector('#root');

export default OpenFile;
