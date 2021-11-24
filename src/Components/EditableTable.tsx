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
import {
  FormControlLabel,
  Icon,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@material-ui/core';
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
  console.log(pair, typeof pair.value);
  return pair.id && pair.value
    ? { ...pair, isEditMode: false }
    : {
        id: Object.values(pair)[0],
        name: Object.values(pair)[0],
        value: Object.values(pair)[1],
        isEditMode: false,
        exists: true,
        type: typeof pair.value,
      };
};

function CustomTableCell({ row, name, onChange, typeOfValues }) {
  const classes = useStyles();
  const { isEditMode } = row;
  console.log(row); // , name, onChange, typeOfValues);
  // console.log('typeOfValues:', typeOfValues);
  // TODO: fix for boolean to have drop-down with false-true
  // let selectValues = [];
  // if (typeOfValues.type === 'bool') selectValues = [true, false];
  const emptyObject = {};
  const emptyArray = [];

  return (
    <TableCell align="left" className={classes.tableCell}>
      {/* In edit mode the type comes from sidebar in data-mapping and
      from the selected type here for conditions and default-values */}
      {isEditMode ? (
        typeOfValues.type === 'dict' || typeOfValues.type === 'list' ? (
          <ReactJson
            src={typeOfValues.type === 'dict' ? emptyObject : emptyArray}
            name="value"
            theme="monokai"
            collapsed
            collapseStringsAfterLength={30}
            groupArraysAfterLength={15}
            onEdit={(edit) => true}
            onAdd={(add) => true}
            defaultValue="object"
            onDelete={(del) => true}
            onSelect={(sel) => true}
            quotesOnKeys={false}
            style={{ 'background-color': 'rgb(59, 77, 172)' }}
            displayDataTypes
            // defaultValue={object}
          />
        ) : typeOfValues.type === 'select' ? (
          <Select
            name={name}
            value={row[name]}
            label="type"
            onChange={(e) => onChange(e, row)}
          >
            {typeOfValues.values.map((tex, index) => (
              <MenuItem key={index} value={tex}>
                {tex}
              </MenuItem>
            ))}
          </Select>
        ) : typeOfValues.type === 'bool' ? (
          <RadioGroup
            aria-label="gender"
            name="controlled-radio-buttons-group"
            value={row[name]}
            onChange={(e) => onChange(e, row)}
          >
            <FormControlLabel value="true" control={<Radio />} label="true" />
            <FormControlLabel value="false" control={<Radio />} label="false" />
          </RadioGroup>
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
  const [typeOfInput, setTypeOfInput] = React.useState('string');

  const typesOfInputs = ['bool', 'number', 'string', 'list', 'dict', 'null'];

  useEffect(() => {
    console.log(props.defaultValues);
    // setTypeOfValuesExists(props.typeOfValues[1].exists);
    // TODO: set type of input through the createData
    // TODO: number is saved as string
    // setTypeOfInput(e.target.value);
    setRows(
      props.defaultValues
        ? props.defaultValues.map((pair) => {
            return createData(pair);
          })
        : []
    );
  }, [props.defaultValues]);

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
    if (command === 'done') {
      props.valuesChanged(rows);
    }
  };

  const onChange = (e, row) => {
    console.log(e.target.value, e.target.name, row.id, row, rows);

    const { value } = e.target;
    const { name } = e.target;
    const { id } = row;
    const newRows = rows.map((rowe) => {
      if (rowe.id === id) {
        return { ...rowe, [name]: value };
      }
      return rowe;
    });
    console.log(newRows);
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
              <b>{props.headers[0]}</b>
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              <b>{props.headers[1]}</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <>
              {props.headers[0] !== 'Source' && props.headers[1] !== 'Node_Id' && (
                <TableRow key={`${row.id}-type`}>
                  <TableCell align="left" className={classes.tableCell}>
                    Change type
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
                </TableRow>
              )}
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
                    typeOfValues: {
                      type:
                        props.headers[0] === 'Source' ||
                        props.headers[1] === 'Node_Id'
                          ? props.typeOfValues && props.typeOfValues[1].type
                          : typeOfInput,
                      exists: typeOfInput != undefined,
                      values:
                        props.headers[0] === 'Source' ||
                        props.headers[1] === 'Node_Id'
                          ? props.typeOfValues && props.typeOfValues[1].values
                          : '',
                    }, //
                  }}
                />

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
            </>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default EditableTable;
