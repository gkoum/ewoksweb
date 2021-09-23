import React from 'react';
// import { createStyles, makeStyles } from '@material-ui/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import MoodIcon from '@mui/icons-material/Mood';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import Typography from '@mui/material/Typography';
import orange2 from '../images/orange2.png';

const useStyles = () => {
  return {};
}; // makeStyles((theme: Theme) =>
//   root: {
//     maxWidth: 300,
//     width: 120,
//     height: 180,
//   },
//   header: {
//     padding: '1px',
//   },
//   action: {
//     padding: '0px',
//     justifyContent: 'center',
//     marginRight: '14px',
//   },
//   large: {
//     width: theme.spacing(10),
//     height: theme.spacing(10),
//     display: 'inline-flex',
//     backgroundColor: '#1d428a',
//   },
//   icons: {
//     marginLeft: 0,
//     marginTop: 0,
//   },
// }));

export default function CustomNode(props) {
  console.log(props);
  const classes = useStyles();
  const [id, setId] = React.useState(props.id);
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedC: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <Card className={classes.root}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '100%', textAlign: 'center' }}>
          {/* <Avatar
            className={classes.large}
            src={props.image}
            aria-label="recipe"
          /> */}
          <img src={orange2} alt="orangeImage" />
          <span style={{ 'word-wrap': 'break-word' }}>
            Some comments about the graph that I need to remember
          </span>
          <Typography gutterBottom component="h2">
            {props.name}
          </Typography>
        </div>
        {/* <FormGroup style={{ justifyContent: 'center' }}>
          <FormControlLabel
            className={classes.icons}
            control={
              <Checkbox
                icon={<MoodIcon color="primary" />}
                checkedIcon={
                  <MoodBadIcon style={{ color: 'rgb(200, 16, 46)' }} />
                }
                name="checkedA"
              />
            }
          />
          <FormControlLabel
            className={classes.icons}
            control={
              <Checkbox
                color="primary"
                icon={<PersonPinCircleIcon />}
                checkedIcon={<PersonPinCircleIcon />}
                name="checkedA"
              />
            }
          />
          <FormControlLabel
            className={classes.icons}
            control={
              <Checkbox
                color="primary"
                icon={<ContactPhoneIcon />}
                checkedIcon={<ContactPhoneIcon />}
                name="checkedB"
              />
            }
          />
        </FormGroup> */}
      </div>
      <CardActions className={classes.action}>
        <IconButton
          // onClick={(event) => props.openContactDetails(id)}
          aria-label="add to favorites"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={(event) => props.removeNode(id)}
          aria-label="share"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
