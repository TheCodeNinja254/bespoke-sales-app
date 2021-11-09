import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import useTheme from '@material-ui/core/styles/useTheme';
import PropTypes from 'prop-types';
import { StatusBadge } from '../../../components';

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

const AccountProfile = ({ customerDetails }) => {
  const theme = useTheme();
  const classes = useStyles();
  const { fullName, paymentStatus, saleDate } = customerDetails;

  return (
    <Card className={classes.root}>
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography gutterBottom variant="h2">
              {fullName}
            </Typography>
            <Typography color="textSecondary" variant="body1">
              Sale Date: {moment(saleDate).format('DD/MM/YYYY h:mm:ss a')}
            </Typography>
            <Typography color="textSecondary" variant="body1">
              Payment Status:
            </Typography>
            <StatusBadge
              bgColor={
                paymentStatus === 1
                  ? theme.palette.success.main
                  : theme.palette.warning.main
              }>
              {paymentStatus === 1 ? 'Paid' : 'Pending Payment'}
            </StatusBadge>
          </div>
          <Avatar className={classes.avatar} />
        </div>
      </CardContent>
      <Divider />
    </Card>
  );
};

AccountProfile.propTypes = {
  customerDetails: PropTypes.object.isRequired
};

export default React.memo(AccountProfile);
