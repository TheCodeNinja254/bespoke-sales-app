import React from 'react';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { useHistory, withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Form as FormikForm, Formik } from 'formik';
import isEmpty from 'lodash.isempty';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Dialog, StatusIcon } from '../../../components';
import { SIGNIN } from '../../../mutations/Account/Account';
import ErrorHandler from '../../../utils/errorHandler';
import { encrypt } from '../../../utils/encryptDecrypt';

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email address'),
  password: Yup.string().required('Please enter your password')
});

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(0),
    color: theme.palette.primary.light
  },
  mainTitle: {
    marginTop: theme.spacing(0),
    color: theme.palette.primary.main
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  FormTitleText: {
    // width: 204,
    height: 50,
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#43b02a'
  },
  signInButton: {
    margin: theme.spacing(2, 0),
    marginBottom: theme.spacing(2)
  },
  errorMessage: {
    marginTop: theme.spacing(1),
    color: theme.palette.error.main,
    textAlign: 'center'
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const SignInForm = () => {
  const history = useHistory();
  const classes = useStyles();
  const buttonDisabledStatus = (errors, values, loading) => {
    let status = true;
    if (
      isEmpty(errors) &&
      values.email !== '' &&
      values.password !== '' &&
      loading === false
    ) {
      status = false;
    }
    return status;
  };
  const [signInDetails, setSignInDetails] = React.useState({
    open: false,
    status: false,
    message: '',
    body: ''
  });

  const { open, status, message, body } = signInDetails;
  const closeDialog = () => {
    setSignInDetails({ open: false, status: false, message: '', body });
  };

  const [SignInMutation, { loading }] = useMutation(SIGNIN);

  return (
    <Formik
      initialValues={{
        email: '',
        password: ''
      }}
      validationSchema={SignInSchema}
      onSubmit={(values, actions) => {
        SignInMutation({
          variables: {
            email: encrypt(values.email),
            password: encrypt(values.password)
          }
        })
          .then((response) => {
            const {
              data: {
                signIn: { status: signInStatus, message: signInMessage }
              }
            } = response;
            if (signInStatus) {
              actions.resetForm();
              history.push('/verify-otp');
            } else {
              // login error
              setSignInDetails({
                open: true,
                status: false,
                message: signInMessage,
                body
              });
            }
          })
          .catch((res) => {
            setSignInDetails({
              open: true,
              status: false,
              message: ErrorHandler(
                res.message || res.graphQLErrors[0].message
              ),
              body
            });
          });
      }}>
      {({ errors, setFieldValue, values }) => (
        <FormikForm>
          <Dialog
            open={open}
            modalContent={
              <Box className={classes.dialogContent}>
                <StatusIcon status={status ? 'success' : 'error'} />
                <Typography variant="body1"> {message}</Typography>
              </Box>
            }
            modalActions={
              <Button
                variant="contained"
                onClick={() => closeDialog()}
                color="primary"
                autoFocus>
                Close
              </Button>
            }
            handleClose={closeDialog}
          />
          <div className={classes.FormTitleText}>
            <Typography className={classes.title} variant="h5">
              Welcome to
            </Typography>
            <Typography className={classes.mainTitle} variant="h4">
              Name of Your Choice
            </Typography>
          </div>
          <TextField
            className={classes.textField}
            error={!!errors.email}
            fullWidth
            autoFocus
            helperText={errors.email || null}
            label="Email Address"
            name="email"
            onChange={(e) => {
              setFieldValue('email', e.target.value, true);
            }}
            type="text"
            value={values.email}
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            error={!!errors.password}
            fullWidth
            helperText={errors.password || null}
            label="Password"
            name="password"
            onChange={(e) => {
              setFieldValue('password', e.target.value, true);
            }}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <Button
            className={classes.signInButton}
            color="primary"
            disabled={buttonDisabledStatus(errors, values, loading)}
            fullWidth
            size="large"
            type="submit"
            variant="contained">
            {loading ? 'Please wait...' : 'Login'}
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
};

export default withRouter(SignInForm);
