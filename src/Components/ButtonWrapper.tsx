/* eslint-disable jsx-a11y/control-has-associated-label */
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Button } from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    openFileButton: {
      backgroundColor: '#96a5f9',
    },
  })
);

function ButtonWrapper(props) {
  const classes = useStyles();

  const [fileName, setFileName] = useState('');

  const fileNameChanged = (value) => {
    console.log(value);
    setFileName(value);
  };

  return (
    <div>
      <label htmlFor="upload-photo">
        <input
          style={{ display: 'none' }}
          id="upload-photo"
          name="upload-photo"
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

const rootElement = document.querySelector('#root');

export default ButtonWrapper;
