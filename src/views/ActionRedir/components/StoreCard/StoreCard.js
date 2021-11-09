import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import getInitials from '../../../../utils/getInitials';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
    minHeight: 135
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: '40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    '& h2': {
      color: theme.palette.white,
      fontSize: 60
    }
  },
  actions: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '& button': {
      borderRadius: 10
    }
  },
  playIcon: {
    height: 38,
    width: 38
  }
}));

const StoreCard = ({ title, description, link, store }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" noWrap>
            {description}
          </Typography>
        </CardContent>
        <div className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={RouterLink}
            to={{
              pathname: link,
              state: {
                store
              }
            }}>
            View
          </Button>
        </div>
      </div>
      <Box className={classes.cover}>
        <Typography variant="h2">{getInitials(title)}</Typography>
      </Box>
    </Card>
  );
};

StoreCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  store: PropTypes.object
};

export default React.memo(StoreCard);
