import React from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import { SignInForm } from './forms';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  gridDesktopContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  image: {
    backgroundImage: 'url(/images/bg_big.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    height: '100%',
    backgroundPosition: 'center'
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
    textAlign: 'center'
  },
  formContainer: {
    width: 400,
    height: 450,
    borderRadius: 10,
    paddingTop: 0,
    display: 'flex',
    marginTop: theme.spacing(6)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  formWrapper: {
    paddingLeft: 50,
    paddingRight: 50,
    flexBasis: 700
  }
}));

const SignIn = () => {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div className={classes.root}>
        <div className={classes.image}>
          <Grid className={classes.grid} container>
            <CssBaseline />
            {/* className={classes.image} */}
            <Grid item xs={false} sm={4} md={4} />
            <Grid
              className={classes.formContainer}
              item
              xs={12}
              sm={4}
              md={4}
              component={Paper}
              elevation={3}
              square={false}>
              <div className={classes.content}>
                <div className={classes.contentBody}>
                  <div className={classes.formWrapper}>
                    <SignInForm />
                    <Grid container>
                      <Grid item xs>
                        <Link href="/forgot-password" variant="body1">
                          Forgot password?
                        </Link>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid className={classes.gridDesktopContainer} item lg={3} />
          </Grid>
        </div>
      </div>
    </>
  );
};

export default React.memo(SignIn);
