import React from 'react';
import { Link as RouterLink, Redirect, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import AccountProfile from './components/AccountProfile/AccountProfile';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { EditUserForm } from './forms';
import ActivateDeactivateUserForm from './forms/ActivateDeactivateUserForm';
import GetSignedInUserQuery from '../../../queries/Account/GetSignedInUser';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  passwordWrapper: {
    marginTop: theme.spacing(2)
  }
}));

const EditUser = () => {
  const classes = useStyles();
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const { isset } = userDetails.user;

  return (
    <>
      <Helmet>
        <title>Edit User Details</title>
      </Helmet>
      <div className={classes.root}>
        <Breadcrumbs>
          <Link
            color="inherit"
            component={RouterLink}
            to="/super-admin/manage-users">
            Users
          </Link>
          <Typography color="textPrimary">Edit User</Typography>
        </Breadcrumbs>
        <div className={classes.content}>
          <>
            {isset ? (
              <Grid container spacing={4}>
                <Grid item lg={4} md={6} xl={4} xs={12}>
                  <Grid container spacing={4}>
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <AccountProfile
                        userDetails={JSON.parse(
                          localStorage.getItem('userDetails')
                        )}
                      />
                    </Grid>

                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <Card>
                        <CardHeader
                          subheader="Select a user status to update"
                          title="Activate/Deactivate"
                        />
                        <Divider />
                        <CardContent>
                          <GetSignedInUserQuery>
                            {({
                              getSignedInUser: {
                                user: { agencyId }
                              }
                            }) => (
                              <ActivateDeactivateUserForm agencyId={agencyId} />
                            )}
                          </GetSignedInUserQuery>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={8} md={6} xl={8} xs={12}>
                  <Card>
                    <CardHeader
                      subheader="This information may not be edited"
                      title="User Details"
                    />
                    <Divider />
                    <CardContent>
                      <EditUserForm usersDetails={userDetails} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Redirect
                to={{
                  pathname: '/not-found'
                }}
              />
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default withRouter(EditUser);
