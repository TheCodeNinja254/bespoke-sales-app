import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import { Helmet } from 'react-helmet';
import { Grid } from '@material-ui/core';
import Breadcrumbs from '../Components/Breadcrumbs';
import GetSignedInUserQuery from '../../../queries/Account/GetSignedInUser';
import EditMyProfileForm from './forms/EditMyProfileForm';
import MyProfileSummary from './components/MyProfileSummary/MyProfileSummary';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  profileCard: {
    marginTop: theme.spacing(2)
  }
}));

const AddUser = () => {
  const classes = useStyles();
  return (
    <>
      <Helmet>
        <title>Add User</title>
      </Helmet>
      <div className={classes.root}>
        <Breadcrumbs>
          <Typography color="textPrimary">My Profile</Typography>
        </Breadcrumbs>
        <div className={classes.content}>
          <GetSignedInUserQuery>
            {({ getSignedInUser: { user } }) => (
              <Grid container spacing={3}>
                <Grid item lg={6} xs={12}>
                  <MyProfileSummary user={user} />
                  <Card className={classes.profileCard}>
                    <CardHeader title="Edit your account details" />
                    <Divider />
                    <CardContent>
                      <EditMyProfileForm />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item lg={6} xs={12} />
              </Grid>
            )}
          </GetSignedInUserQuery>
        </div>
      </div>
    </>
  );
};

export default AddUser;
