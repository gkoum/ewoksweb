import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/EditOutlined';
import {
  createStyles,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@material-ui/core';
import ReactJson from 'react-json-view';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1, 0),
        wordBreak: 'break-word',
        // width: '25ch',
      },
    },

    iconBut: {
      padding: '2px',
    },

    formInfo: {
      width: '200px',
      wordWrap: 'break-word',
      wordBreak: 'break-all',
    },
  })
);

function EditTaskProp({ index, row, name, onChange, type, task_identifier }) {
  const classes = useStyles();

  const [editIdentifier, setEditIdentifier] = React.useState(false);
  const [taskIdentifier, setTaskIdentifier] = React.useState('');

  const onEditIdentifier = () => {
    // console.log(selectedElement);
    // setEditIdentifier(!editIdentifier);
  };

  const taskIdentifierChanged = (event) => {
    // setTaskIdentifier(event.target.value);
    // setElement({
    //   ...element,
    //   task_identifier: event.target.value,
    // });
  };

  return (
    <>
      <div className={classes.root}>
        <IconButton
          style={{ padding: '1px' }}
          aria-label="edit"
          onClick={() => onEditIdentifier()}
        >
          <EditIcon />
        </IconButton>
        <b>Identifier:</b> {task_identifier}
      </div>
      {editIdentifier && (
        <TextField
          id="Task Identifier"
          label="Task Identifier"
          variant="outlined"
          value={taskIdentifier || ''}
          onChange={taskIdentifierChanged}
        />
      )}
    </>
  );
}
export default EditTaskProp;
