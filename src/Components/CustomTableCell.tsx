import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Input from '@material-ui/core/Input';
import {
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@material-ui/core';
import ReactJson from 'react-json-view';

const useStyles = makeStyles((theme) => ({
  tableCell: {
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
        value: e.target.value, // === 'true',
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
            style={{ backgroundColor: 'rgb(59, 77, 172)' }}
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
        ) : type === 'bool' || type === 'boolean' ? (
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

export default CustomTableCell;
