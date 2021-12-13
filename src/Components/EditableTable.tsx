import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
import { MenuItem, Select } from '@material-ui/core';
import CustomTableCell from './CustomTableCell';
import useStore from '../store';
import DraggableDialog from './DraggableDialog';

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
        type:
          pair.value === 'true' || pair.value === 'false'
            ? 'boolean'
            : typeof pair.value,
      };
};

function EditableTable(props) {
  const [rows, setRows] = React.useState([]);
  // console.log('PROPS:', props);
  const [typeOfInputs, setTypeOfInputs] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [dialogContent, setDialogContent] = React.useState<GraphEwoks>({});

  const { defaultValues } = props;
  const { headers } = props;

  // TODO: only the first one???
  const val = defaultValues[0].value;

  const typesOfInputs = ['bool', 'number', 'string', 'list', 'dict', 'null'];
  console.log(defaultValues, val, rows, props, typeOfInputs);

  useEffect(() => {
    console.log(defaultValues);
    const tOfIn = defaultValues.map((val) =>
      val.value === 'true' || val.value === 'false'
        ? 'boolean'
        : Array.isArray(val.value)
        ? 'list'
        : val.value === 'null' || val.value === null
        ? 'null'
        : typeof val.value === 'object'
        ? 'dict'
        : typeof val.value
    );
    console.log(tOfIn);
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

  const showEditableDialog = ({ title, graph, callbackProps }) => {
    console.log(title, graph, callbackProps);
    setOpenDialog(true);
    setDialogContent({
      title,
      object: graph,
      callbackProps,
    });
  };

  const onToggleEditMode = (id, index, command) => {
    console.log(props, id, rows, props.defaultValues, command, typeOfInputs);
    if (command === 'edit' && ['list', 'dict'].includes(typeOfInputs[index])) {
      let initialValue = '';

      if (typeOfInputs[index] === 'list') {
        if (Array.isArray(rows[index].value)) {
          initialValue = rows[index].value;
        } else {
          initialValue = [];
        }
      } else if (typeOfInputs[index] === 'dict') {
        if (
          typeof rows[index].value === 'object' &&
          !Array.isArray(rows[index].value)
        ) {
          initialValue = rows[index].value;
        } else {
          initialValue = {};
        }
      }
      console.log(initialValue);

      showEditableDialog({
        title: typeOfInputs[index] === 'list' ? 'Edit list' : 'Edit dict',
        graph: initialValue,
        callbackProps: { rows, id },
      });
    }
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            id: row.name.replace(' ', '_'),
            // value: row.value,
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
    console.log(typeOfInputs, e, row, index);
    if (
      ['string', 'bool', 'number', 'boolean', 'null'].includes(typeOfInputs[0])
    ) {
      let { value } = e.target;
      const { name } = e.target;
      const inType = typeOfInputs[index];
      console.log(value, name, inType);

      if (name === 'value') {
        value =
          typeOfInputs[index] === 'number'
            ? Number(value)
            : // : typeOfInputs[index] === 'bool'
              // ? !!value
              value;
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
    } else {
      const { updated_src } = e;
      const { id } = row;
      const name =
        e.target && e.target.name === 'name' ? e.target.name : 'value';
      console.log(updated_src, id, name);

      const newRows = rows.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            [name]:
              e.target && e.target.name === 'name'
                ? e.target.value
                : updated_src,
          };
        }
        return row;
      });
      console.log(newRows);
      setRows(newRows);
    }
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
    if (e.target.value === 'null') {
      const newRows = rows.map((rowe) => {
        if (rowe.id === row.id) {
          return { ...rowe, value: e.target.value };
        }
        return rowe;
      });
      console.log(newRows);
      setRows(newRows);
      props.valuesChanged(newRows);
    }
    const tOfI = [...typeOfInputs];
    tOfI[index] = e.target.value;
    setTypeOfInputs(tOfI);
  };

  const setRowValue = (val, callbackProps) => {
    console.log(val, callbackProps);
    const newRows = callbackProps.rows.map((row) => {
      if (row.id === callbackProps.id) {
        return { ...row, value: val };
      }
      return row;
    });
    props.valuesChanged(newRows);
    setRows(newRows);
  };

  return (
    <Paper className={classes.root}>
      <DraggableDialog
        open={openDialog}
        content={dialogContent}
        setValue={setRowValue}
      />
      <Table className={classes.table} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="left" className={classes.tableCell}>
              <b>{headers[0]}</b>
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              <b>{headers[1]}</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <React.Fragment key={`${row.id}-type`}>
              {headers[0] !== 'Source' && headers[1] !== 'Node_Id' && (
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
                        headers[0] === 'Source' || headers[1] === 'Node_Id'
                          ? props.typeOfValues && props.typeOfValues[1].type
                          : typeOfInputs,
                      values:
                        headers[0] === 'Source' || headers[1] === 'Node_Id'
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
                        onClick={() => onToggleEditMode(row.id, index, 'done')}
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
                        onClick={() => onToggleEditMode(row.id, index, 'edit')}
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
