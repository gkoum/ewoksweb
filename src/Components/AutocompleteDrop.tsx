import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getWorkflows } from '../utils';
import useStore from '../store';
import type { GraphEwoks } from '../types';

function AutocompleteDrop(props) {
  const [options, setOptions] = useState<readonly GraphEwoks[]>([]);
  const [value] = React.useState<string | null>(options[0]);
  const [open, setOpen] = useState(false);
  const allWorkflows = useStore((state) => state.allWorkflows);
  const setAllWorkflows = useStore((state) => state.setAllWorkflows);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }
    // if (allWorkflows.length === 0) { // TODO: not get all the time...
    (async () => {
      const workF: GraphEwoks[] = await getWorkflows()
      // .catch((error) => {
      //   console.log(error);
      // });
      if (workF && workF.length > 0) {
        setAllWorkflows(workF);
        if (active) { setOptions([...workF]) };
      }
    })();
    // } else {
    //   setOptions(allWorkflows);
    // }

    return () => {
      active = false;
    };
  }, [loading, allWorkflows, setAllWorkflows]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const setInputValue = (newInputValue) => {
    props.setInputValue(newInputValue);
  };

  return (
    <Autocomplete
      id="async-autocomplete-drop"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      // isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={options}
      loading={loading}
      value={value}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Workflows"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default AutocompleteDrop;
