/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import AccountProfile from './AccountProfile';
import GetUserQuery from '../../../queries/Account/GetUserQuery';
import EditUserForm from './forms/EditUserForm';
import UpdatePasswordForm from './forms/UpdatePasswordForm';

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

const EditUser = ({ userDetails }) => {
  const classes = useStyles();
  const {
    user: { id }
  } = userDetails;
  return (
    <>
      <Helmet>
        <title>Account Details</title>
      </Helmet>
      <div className={classes.root}>
        <div className={classes.content}>
          <GetUserQuery variables={{ id: Number(id) }}>
            {({ getUser }) => (
              <>
                {getUser ? (
                  <Grid container spacing={4}>
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <AccountProfile userDetails={getUser} />
                    </Grid>
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <Card>
                        <CardHeader
                          subheader="This information can be edited"
                          title="Account Details"
                        />
                        <Divider />
                        <CardContent>
                          <EditUserForm usersDetails={getUser} />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <Card>
                        <CardHeader title="Change Password" />
                        <Divider />
                        <CardContent>
                          <UpdatePasswordForm />
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
            )}
          </GetUserQuery>
        </div>
      </div>
    </>
  );
};

export default withRouter(EditUser);
