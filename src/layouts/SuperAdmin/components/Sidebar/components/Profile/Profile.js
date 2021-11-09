import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import GetSignedInUserQuery from '../../../../../../queries/Account/GetSignedInUser';
import getInitials from '../../../../../../utils/getInitials';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60,
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = (props) => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <GetSignedInUserQuery>
        {({
          getSignedInUser: {
            user: { fullname }
          }
        }) => (
          <>
            <Avatar className={classes.avatar}>{getInitials(fullname)}</Avatar>
            <Typography className={classes.name} variant="h4">
              {fullname}
            </Typography>
            <Typography variant="body2">Admin</Typography>
          </>
        )}
      </GetSignedInUserQuery>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default React.memo(Profile);
