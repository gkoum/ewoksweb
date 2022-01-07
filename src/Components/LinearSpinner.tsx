import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function LinearSpinner({ getting }) {
  return (
    <>
      {getting && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )}
    </>
  );
}
