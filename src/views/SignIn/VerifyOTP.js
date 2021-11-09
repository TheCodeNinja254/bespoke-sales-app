import React from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import VerifyOTPForm from './forms/VerifyOTPForm';

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
    marginTop: theme.spacing(2),
    textAlign: 'center'
  },
  formContainer: {
    width: 400,
    height: 361,
    borderRadius: 10,
    paddingTop: 0,
    display: 'flex',
    marginTop: theme.spacing(6)
  },
  contentBody: {
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  formWrapper: {
    paddingLeft: 50,
    paddingRight: 50,
    margin: theme.spacing(0),
    width: '100%'
  }
}));

const VerifyOTP = () => {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>Sign In - OTP Verification</title>
      </Helmet>
      <div className={classes.root}>
        <div className={classes.image}>
          <Grid className={classes.grid} container>
            <CssBaseline />
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
                    <VerifyOTPForm />
                    <Grid container>
                      <Grid item xs>
                        <Link href="/sign-in" variant="body2">
                          Get another OTP?
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

export default React.memo(VerifyOTP);
