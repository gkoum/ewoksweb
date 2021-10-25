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
import { Icon, MenuItem, Select } from '@material-ui/core';
// import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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

const createData = (pair) => {
  // console.log(
  //   pair,
  //   Object.keys(pair)[1],
  //   Object.values(pair)[1],
  //   Object.keys(pair)[0],
  //   Object.values(pair)[0]
  // );
  return pair.id && pair.value
    ? { ...pair, isEditMode: false }
    : {
        id: Object.values(pair)[0],
        name: Object.values(pair)[0],
        value: Object.values(pair)[1],
        isEditMode: false,
      };
};

function CustomTableCell({ row, name, onChange, typeOfValues }) {
  const classes = useStyles();
  const { isEditMode } = row;
  console.log(row, name, onChange, typeOfValues);
  // console.log('typeOfValues:', typeOfValues);
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        typeOfValues.type === 'select' ? (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={row[name]}
            name={name}
            label="Task type"
            onChange={(e) => onChange(e, row)}
          >
            {typeOfValues.values.map((tex, index) => (
              <MenuItem key={index} value={tex}>
                {tex}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Input
            value={row[name]}
            name={name}
            onChange={(e) => onChange(e, row)}
            className={classes.input}
          />
        )
      ) : (
        row[name].toString()
      )}
    </TableCell>
  );
}

function EditableTable(props) {
  const [rows, setRows] = React.useState([]);
  // console.log('PROPS:', props);

  useEffect(() => {
    // console.log(
    //   props.defaultValues,
    //   props.defaultValues
    //     ? props.defaultValues.map((pair) => {
    //         return createData(pair);
    //       })
    //     : []
    // );
    setRows(
      props.defaultValues
        ? props.defaultValues.map((pair) => {
            return createData(pair);
          })
        : []
    );
  }, [props.defaultValues]);

  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();

  const onToggleEditMode = (id) => {
    // console.log(id, props.defaultValues);
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            id: row.name.replace(' ', '_'),
            isEditMode: !row.isEditMode,
          };
        }
        return row;
      });
    });
    // console.log(rows);
    props.valuesChanged(rows);
  };

  const onChange = (e, row) => {
    // console.log(e.target.value, e.target.name, row, rows);

    const { value } = e.target;
    const { name } = e.target;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, id: row.name.replace(' ', '_'), [name]: value };
      }
      return row;
    });
    // console.log(newRows);
    setRows(newRows);
  };

  const onRevert = (id) => {
    if (id === '') {
      return;
    }
    const newRows = rows.filter((row) => {
      return row.id !== id; // row;
    });
    // console.log(newRows);
    setRows(newRows);
    props.valuesChanged(newRows);
  };

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell style={{ padding: '1px' }} align="left">
              {props.headers[0]}
            </TableCell>
            <TableCell style={{ padding: '1px' }} align="left">
              {props.headers[1]}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <CustomTableCell
                {...{
                  row,
                  name: 'name',
                  onChange,
                  typeOfValues: props.typeOfValues && props.typeOfValues[0],
                }}
              />
              <CustomTableCell
                {...{
                  row,
                  name: 'value',
                  onChange,
                  typeOfValues: props.typeOfValues && props.typeOfValues[1],
                }}
              />
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
                  <span>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="delete"
                      onClick={() => onToggleEditMode(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </span>
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
