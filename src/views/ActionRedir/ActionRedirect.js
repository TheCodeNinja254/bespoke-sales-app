import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';

const actionRedirect = ({ userDetails }) => {
  const {
    user: { role }
  } = userDetails;
  return (
    <>
      <Helmet>
        <title>Home 4G</title>
      </Helmet>
      <div>
        <div>
          <Grid container spacing={3}>
            {role === 'Admin' && (
              <>
                <Redirect
                  to={{
                    pathname: '/super-admin'
                  }}
                />
              </>
            )}
            <Grid item lg={1} />
          </Grid>
          <Grid container spacing={3}>
            {role === 'SalesManagement' && (
              <>
                <Redirect
                  to={{
                    pathname: '/management'
                  }}
                />
              </>
            )}
            <Grid item lg={1} />
          </Grid>
          <Grid container spacing={3}>
            {role === 'Sales' && (
              <>
                <Redirect
                  to={{
                    pathname: '/sales'
                  }}
                />
              </>
            )}
            <Grid item lg={1} />
          </Grid>
          <Grid container spacing={3}>
            {(role === null || role === '' || role === undefined) && (
              <>
                <Redirect
                  to={{
                    pathname: '/sign-in'
                  }}
                />
              </>
            )}
            <Grid item lg={1} />
          </Grid>
        </div>
      </div>
    </>
  );
};

export default actionRedirect;
