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
import ReactJson from 'react-json-view';
import useStore from '../store';
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
    minWidth: 160,
    maxWidth: 270,
  },
  selectTableCell: {
    width: 28,
    padding: '1px',
  },
  tableCell: {
    // padding: '1px',
    width: 120,
    height: 20,
    padding: '1px',
  },
  input: {
    width: 90,
    height: 20,
    padding: '1px',
  },
}));

const createData = (pair) => {
  return pair.id && pair.value
    ? { ...pair, isEditMode: false }
    : {
        id: Object.values(pair)[0],
        name: Object.values(pair)[0],
        value: Object.values(pair)[1],
        isEditMode: false,
        exists: true,
      };
};

function CustomTableCell({ row, name, onChange, typeOfValues }) {
  const classes = useStyles();
  const { isEditMode } = row;
  console.log(row, name, onChange, typeOfValues);
  // console.log('typeOfValues:', typeOfValues);

  const graphRF = useStore((state) => state.graphRF);

  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        typeOfValues.type === 'dict' ? (
          <ReactJson
            src={graphRF}
            name={'graph'}
            theme={'monokai'}
            collapsed
            collapseStringsAfterLength={30}
            groupArraysAfterLength={15}
            onEdit={(edit) => true}
            onAdd={(add) => true}
            defaultValue={'string'}
            onDelete={(del) => true}
            onSelect={(sel) => true}
            quotesOnKeys={false}
            style={{ 'background-color': 'rgb(59, 77, 172)' }}
          />
        ) : typeOfValues.type === 'list' || typeOfValues.type === 'bool' ? (
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
  const [typeOfValuesExists, setTypeOfValuesExists] = React.useState(false);
  // console.log('PROPS:', props);
  const [typeOfInput, setTypeOfInput] = React.useState();

  const typesOfInputs = ['bool', 'number', 'string', 'list', 'dict', 'null'];

  useEffect(() => {
    console.log(props);
    setTypeOfValuesExists(props.typeOfValues[1].exists);
    setRows(
      props.defaultValues
        ? props.defaultValues.map((pair) => {
            return createData(pair);
          })
        : []
    );
  }, [props, props.defaultValues]);

  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();

  const onToggleEditMode = (id, command) => {
    console.log(id, rows, props.defaultValues, command);
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
    if (command === 'done') props.valuesChanged(rows);
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

  const changedTypeOfInput = (e, row) => {
    console.log(e.target.value, row, typeOfValuesExists, props);
    setTypeOfValuesExists(!typeOfValuesExists);
    setTypeOfInput(e.target.value);
  };

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="left" className={classes.tableCell}>
              {props.headers[0]}
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              {props.headers[1]}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {typeOfValuesExists ? (
                <>
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
                      typeOfValues: {
                        type: typeOfInput,
                        exists: typeOfInput != undefined,
                      }, // props.typeOfValues && props.typeOfValues[1],
                    }}
                  />
                </>
              ) : (
                <>
                  <TableCell align="left" className={classes.tableCell}>
                    Select value-type
                  </TableCell>
                  <TableCell align="left" className={classes.tableCell}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={typeOfInput}
                      label="Task type"
                      onChange={(e) => changedTypeOfInput(e, row)}
                    >
                      {typesOfInputs.map((tex, index) => (
                        <MenuItem key={index} value={tex}>
                          {tex}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </>
              )}

              <TableCell className={classes.selectTableCell}>
                {row.isEditMode ? (
                  <>
                    <IconButton
                      style={{ padding: '1px' }}
                      aria-label="done"
                      onClick={() => onToggleEditMode(row.id, 'done')}
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
                      aria-label="edit"
                      onClick={() => onToggleEditMode(row.id, 'edit')}
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
