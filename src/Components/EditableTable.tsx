import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
// Icons
import EditIcon from '@material-ui/icons/EditOutlined';
import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '1px',
    // marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    padding: '1px',
    minWidth: 100,
    maxWidth: 220,
  },
  selectTableCell: {
    width: 40,
    padding: '1px',
  },
  tableCell: {
    // padding: '1px',
    width: 70,
    height: 20,
    padding: '1px',
  },
  input: {
    width: 70,
    height: 20,
    padding: '1px',
  },
}));

const createData = ({ name, value }) => {
  console.log(name, value);
  return {
    id: name.replace(' ', '_'),
    name,
    value,
    isEditMode: false,
  };
};

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

function EditableTable(props) {
  const [rows, setRows] = React.useState([
    createData({ name: '-', value: Number }),
  ]);

  useEffect(() => {
    console.log(props.defaultValues);
    setRows(
      props.defaultValues
        ? props.defaultValues.map((pair) => {
            return createData(pair);
          })
        : [createData({ name: '-', value: Number })]
    );
  }, [props.defaultValues]);

  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();

  const onToggleEditMode = (id) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onChange = (e, row) => {
    console.log(e.target.value, e.target.name, row);
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onRevert = (id) => {
    console.log(id, rows);
    if (id === '') return;
    const newRows = rows.filter((row) => {
      console.log(row.id);
      // if (row.id === id) {
      //   console.log(previous[id]);
      //   return previous[id] ? previous[id] : row;
      // }
      return row.id !== id; // row;
    });
    console.log(newRows);
    setRows(newRows);
    // setPrevious((state) => {
    //   delete state[id];
    //   return state;
    // });
    // onToggleEditMode(id);
  };

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="caption table">
        <TableHead>
          <TableRow>Default values</TableRow>
          <TableRow>
            <TableCell style={{ padding: '1px' }} align="left">
              Name
            </TableCell>
            <TableCell style={{ padding: '1px' }} align="left">
              Value
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <CustomTableCell {...{ row, name: 'name', onChange }} />
              <CustomTableCell {...{ row, name: 'value', onChange }} />
              <TableCell className={classes.selectTableCell}>
                {row.isEditMode ? (
                  <>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="done"
                      onClick={() => onToggleEditMode(row.id)}
                    >
                      <DoneIcon />
                    </IconButton>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="revert"
                      onClick={() => onRevert(row.id)}
                    >
                      <RevertIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    style={{ padding: '1px' }}
                    aria-label="delete"
                    onClick={() => onToggleEditMode(row.id)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default EditableTable;