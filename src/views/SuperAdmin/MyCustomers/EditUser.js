/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

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
import { GetUserQuery } from '../../../queries/Account/GetUserQuery';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';

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

const EditUser = ({ match, history }) => {
  const classes = useStyles();
  const {
    params: { id }
  } = match;
  if (!Number(id)) {
    history.push('/not-found');
    return null;
  }

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
            to="/dealer-portal/users">
            Users
          </Link>
          <Typography color="textPrimary">Edit User</Typography>
        </Breadcrumbs>
        <div className={classes.content}>
          <GetUserQuery variables={{ id: Number(id) }}>
            {({ getUser }) => (
              <>
                {getUser ? (
                  <Grid container spacing={4}>
                    <Grid item lg={4} md={6} xl={4} xs={12}>
                      <AccountProfile userDetails={getUser} />
                    </Grid>
                    <Grid item lg={8} md={6} xl={8} xs={12}>
                      <Card>
                        <CardHeader
                          subheader="This information can be edited"
                          title="User Details"
                        />
                        <Divider />
                        <CardContent>
                          <EditUserForm usersDetails={getUser} />
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
