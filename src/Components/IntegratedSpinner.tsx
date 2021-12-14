import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import { TramRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  top: {
    animationDuration: '550ms',
    // animation: 'animation-61bdi0 1.4s linear infinite',
    position: 'absolute',
    left: 0,
  },
}));

export default function IntegratedSpinner({ children, getting }) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<number>();
  const classes = useStyles();

  // TODO: synd with the real time the call makes using getting
  // React.useEffect(() => {
  //   console.log(getting);
  //   setLoading(getting);

  //   // return () => {
  //   //   clearTimeout(timer.current);
  //   // };
  // }, [getting]);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 3000);
      timer.current = window.setTimeout(() => {
        setSuccess(false);
        setLoading(false);
      }, 5000);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Fab
          color="primary"
          size="small"
          onClick={handleButtonClick}
          component="span"
          aria-label="add"
          style={{
            backgroundColor: '#96a5f9',
          }}
        >
          {success ? <CheckIcon /> : loading ? '...' : children}
        </Fab>
        {loading && (
          <CircularProgress
            size={46}
            className={classes.top}
            thickness={4}
            // {...props}
            value={100}
            style={{
              color: 'white',
              position: 'absolute',
              top: -4,
              left: -4,
              zIndex: 1,
            }}
          />
        )}
      </Box>
      {/* <Box sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          disabled={loading}
          onClick={handleButtonClick}
          style={{ backgroundColor: '#96a5f9' }}
        >
          Save
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            style={{
              color: 'white',
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box> */}
    </Box>
  );
}
