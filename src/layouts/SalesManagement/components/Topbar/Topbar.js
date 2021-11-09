import React from 'react';
// import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useMutation } from '@apollo/client';
import InputIcon from '@material-ui/icons/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { GET_SIGNED_IN_USER } from '../../../../queries/Account/GetSignedInUser';
import { SIGNOUT } from '../../../../mutations/Account/Account';

const useStyles = makeStyles((theme) => ({
  root: {},
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  logo: {
    height: 20,
    marginLeft: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(0),
    color: theme.palette.white
  }
}));

const Topbar = (props) => {
  const { className, onSidebarOpen, titleLayout, ...rest } = props;
  // const history = useHistory();

  const classes = useStyles();
  const [SignOutMutation] = useMutation(SIGNOUT);

  // Todo find a better way to handle redirect without throwing an error on in-app pages
  const redirectToSignIn = () => {
    window.location.reload();
  };

  const signOut = () => {
    SignOutMutation({
      refetchQueries: [
        { query: GET_SIGNED_IN_USER, variables: { awaitRefetchQueries: true } }
      ]
    })
      .then((response) => {
        if (response) {
          redirectToSignIn();
          // localStorage.clear();
        }
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.log('an error occurred');
      });
  };

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
      elevation={1}
      position="fixed">
      <Toolbar>
        <Hidden lgUp>
          <Tooltip title="Menu">
            <IconButton color="inherit" onClick={onSidebarOpen}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography
                variant="button"
                display="block"
                className={classes.title}>
                PRODUCT
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          {/* <Tooltip title="Edit Profile"> */}
          {/*  <IconButton */}
          {/*    className={classes.signOutButton} */}
          {/*    href="/management/profile" */}
          {/*    color="inherit"> */}
          {/*    <AccountCircleIcon /> */}
          {/*  </IconButton> */}
          {/* </Tooltip> */}
          <Tooltip title="Sign Out">
            <IconButton
              className={classes.signOutButton}
              onClick={() => signOut()}
              color="inherit">
              <InputIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
        <Hidden lgUp>
          {/* <Tooltip title="Edit Profile"> */}
          {/*  <IconButton */}
          {/*    className={classes.signOutButton} */}
          {/*    href="/management/profile" */}
          {/*    color="inherit"> */}
          {/*    <AccountCircleIcon /> */}
          {/*  </IconButton> */}
          {/* </Tooltip> */}
          <Tooltip title="Sign Out">
            <IconButton
              className={classes.signOutButton}
              onClick={() => signOut()}
              color="inherit">
              <InputIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default React.memo(Topbar);
