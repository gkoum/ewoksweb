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
        type: typeof pair.value,
      };
};

function CustomTableCell({ index, row, name, onChange, type, typeOfValues }) {
  const classes = useStyles();
  const { isEditMode } = row;
  console.log(index, row, name, onChange, type, typeOfValues);
  // TODO: handle objects arrays in dialog window
  const emptyObject = {};
  const emptyArray = [];

  const [boolVal, setBoolVal] = React.useState(true);

  useEffect(() => {
    console.log(row.value);
    setBoolVal(row.value.toString());
  }, [row.value]);

  const onChangeBool = (e, row, index) => {
    console.log(e.target.value, e.target.name, row, index);
    const event = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: e.target.value === 'true',
      },
    };
    console.log(event.target.value);
    onChange(event, row, index);
  };

  return (
    <TableCell align="left" className={classes.tableCell}>
      {/* In edit mode the type comes from sidebar in data-mapping and
      from the selected type here for conditions and default-values */}
      {isEditMode ? (
        type === 'dict' || type === 'list' ? (
          <ReactJson
            src={type === 'dict' ? emptyObject : emptyArray}
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
        ) : type === 'select' ? (
          <Select
            name={name}
            value={row[name]}
            label="type"
            onChange={(e) => onChange(e, row, index)}
          >
            {typeOfValues.values.map((tex, index) => (
              <MenuItem key={index} value={tex}>
                {tex}
              </MenuItem>
            ))}
          </Select>
        ) : type === 'bool' ? (
          <RadioGroup
            aria-label="gender"
            name="value"
            value={boolVal} // {row[name]}
            onChange={(e) => onChangeBool(e, row, index)}
          >
            <FormControlLabel value="true" control={<Radio />} label="true" />
            <FormControlLabel value="false" control={<Radio />} label="false" />
          </RadioGroup>
        ) : type === 'number' ? (
          <Input
            value={row[name]}
            type="number"
            name={name}
            onChange={(e) => onChange(e, row, index)}
            className={classes.input}
          />
        ) : (
          <Input
            value={row[name] || ''}
            name={name}
            onChange={(e) => onChange(e, row, index)}
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
  const [typeOfInputs, setTypeOfInputs] = React.useState([]);

  const { defaultValues } = props;

  const typesOfInputs = ['bool', 'number', 'string', 'list', 'dict', 'null'];
  console.log(rows, props, typeOfInputs);

  useEffect(() => {
    console.log(defaultValues);
    const tOfIn = defaultValues.map((val) => typeof val.value);
    setTypeOfInputs(tOfIn);
    setRows(
      defaultValues
        ? defaultValues.map((pair) => {
            console.log(pair);
            return createData(pair);
          })
        : []
    );
  }, [defaultValues]);

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
      console.log(rows);
      props.valuesChanged(rows);
    }
  };

  const onChange = (e, row, index) => {
    let { value } = e.target;
    const { name } = e.target;
    const inType = typeOfInputs[index];
    const type =
      inType === 'number' ? Number(value) : inType === 'bool' ? !!value : value;
    console.log(type, typeOfInputs, e.target.value, e.target.name, row, index);

    if (name === 'value') {
      value =
        typeOfInputs[index] === 'number'
          ? Number(value)
          : typeOfInputs[index] === 'bool'
          ? !!value
          : value;
      console.log(typeof value, value);
    }

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
    // let newRows = [];

    const newRows = rows.filter((row) => {
      return row.id !== id;
    });

    console.log(newRows);
    setRows(newRows);
    props.valuesChanged(newRows);
  };

  const changedTypeOfInputs = (e, row, index) => {
    console.log(e.target.value, row, props, index);
    const tOfI = [...typeOfInputs];
    tOfI[index] = e.target.value;
    setTypeOfInputs(tOfI);
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
          {rows.map((row, index) => (
            <React.Fragment key={`${row.id}-type`}>
              {props.headers[0] !== 'Source' && props.headers[1] !== 'Node_Id' && (
                <TableRow key={`${row.id}-type`}>
                  <TableCell align="left" className={classes.tableCell}>
                    Change type
                  </TableCell>
                  <TableCell align="left" className={classes.tableCell}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={
                        typeOfInputs[index] !== 'boolean'
                          ? typeOfInputs[index]
                          : 'bool'
                      }
                      label="Task type"
                      onChange={(e) => changedTypeOfInputs(e, row, index)}
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
                    index,
                    row,
                    name: 'name',
                    onChange,
                    type: '',
                    typeOfValues: props.typeOfValues && props.typeOfValues[0],
                  }}
                />
                <CustomTableCell
                  {...{
                    index,
                    row,
                    name: 'value',
                    onChange,
                    type: typeOfInputs[index],
                    typeOfValues: {
                      type:
                        props.headers[0] === 'Source' ||
                        props.headers[1] === 'Node_Id'
                          ? props.typeOfValues && props.typeOfValues[1].type
                          : typeOfInputs,
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
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default EditableTable;
