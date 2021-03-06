import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function LinearSpinner() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
}
