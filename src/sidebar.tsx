/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const onDragStart = (event, nodeType) => {
  console.log(event, nodeType);
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  })
);

export default function Sidebar(props) {
  const classes = useStyles();
  const [name, setName] = React.useState('Cat in the Hat');
  const handleChange = (event) => {
    console.log(event.target.value);
    setName(event.target.value);
  };

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'input')}
        draggable
      >
        Input Node
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        Default Node
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, 'output')}
        draggable
      >
        Output Node
      </div>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            id="outlined-basic"
            label="id"
            variant="outlined"
            value={props.element.id}
            onChange={handleChange}
          />
          {props.element.id}
        </div>
        <div>Type: {props.element.type}</div>
        <div>Label: {props.element.data && props.element.data.label}</div>
        <div>
          Position: {props.element.position && props.element.position.x},{' '}
          {props.element.position && props.element.position.y}
        </div>
      </form>
    </aside>
  );
}
