import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import useTheme from '@material-ui/core/styles/useTheme';
import { StatusBadge } from '../../../../../components';

const useStyles = makeStyles((theme) => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 100,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const AccountProfile = (props) => {
  const theme = useTheme();
  const { className, userDetails } = props;

  const classes = useStyles();
  const {
    user: { fullname, status, createdOn }
  } = userDetails;

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography gutterBottom variant="h2">
              {fullname}
            </Typography>
            <StatusBadge
              bgColor={
                status === 1
                  ? theme.palette.success.main
                  : theme.palette.error.main
              }>
              {status === 1 ? 'Active' : 'Inactive'}
            </StatusBadge>
            <Typography color="textSecondary" variant="body1">
              Created On: {moment(createdOn).format('DD/MM/YYYY')}
            </Typography>
          </div>
          <Avatar className={classes.avatar} />
        </div>
      </CardContent>
      <Divider />
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default React.memo(AccountProfile);
