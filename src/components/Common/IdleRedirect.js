import React from 'react';
import { Redirect } from 'react-router-dom';
import { withApollo } from '@apollo/client/react/hoc';
import IdleTimer from 'react-idle-timer';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '../Dialog';
import { SIGNOUT } from '../../mutations/Account/Account';

const redirectToSignIn = (mounted) => {
  return (
    <>
      {mounted && (
        <Redirect
          to={{
            pathname: '/sign-in'
          }}
        />
      )}
    </>
  );
};

class IdleRedirect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeout: 1000 * Number(process.env.REACT_APP_T || 900),
      showModal: false,
      isTimedOut: false
    };

    this._isMounted = false;
    this.idleTimer = null;
    this.onAction = this._onAction.bind(this);
    this.onActive = this._onActive.bind(this);
    this.onIdle = this._onIdle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleLogout() {
    if (this._isMounted) {
      this.setState({ showModal: false });
    }
    this.signOut();
  }

  handleClose() {
    this.setState({ showModal: false });
  }

  signOut() {
    if (this._isMounted) {
      const { client } = this.props;
      client
        .mutate({
          mutation: SIGNOUT,
          refetchQueries: ['GetSignedInUser'],
          awaitRefetchQueries: true
        })
        .then((response) => {
          if (response) {
            redirectToSignIn(this._isMounted);
          }
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.log('an error occurred');
        });
    }
  }

  _onIdle() {
    const { isTimedOut } = this.state;
    if (this._isMounted) {
      if (isTimedOut) {
        this.signOut();
      } else {
        this.setState({ showModal: false });
        this.signOut();

        // Enable below two to handle session extension as per user's request.
        // this.idleTimer.reset();
        // this.setState({isTimedOut: true})
      }
    }
  }

  _onActive() {
    if (this._isMounted) {
      this.setState({ isTimedOut: false });
    }
  }

  _onAction() {
    if (this._isMounted) {
      this.setState({ isTimedOut: false });
    }
  }

  render() {
    const { timeout, showModal } = this.state;
    const timeoutMinutes = process.env.REACT_APP_T
      ? Number(process.env.REACT_APP_T) / 60
      : 15;
    return (
      <>
        <IdleTimer
          ref={(ref) => {
            this.idleTimer = ref;
          }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={timeout}
        />

        <Dialog
          modalHeader={`You have been idle for more than ${timeoutMinutes} minutes`}
          modalContent={
            <Box>
              <Typography variant="body1">
                You will get timed out. Do you wish to stay logged in?
              </Typography>
            </Box>
          }
          modalActions={
            <Grid container direction="row" justify="space-evenly">
              <Grid item>
                <Button
                  variant="contained"
                  color="default"
                  onClick={() => this.handleLogout()}>
                  Logout
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.handleClose()}>
                  Stay
                </Button>
              </Grid>
            </Grid>
          }
          handleClose={this.handleClose}
          open={showModal}
        />
      </>
    );
  }
}

export default withApollo(IdleRedirect);
