import React from 'react';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { useHistory, withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import { Form as FormikForm, Formik } from 'formik';
import isEmpty from 'lodash.isempty';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { passwordRegex } from '../../../utils/constants';
import { Dialog, StatusIcon } from '../../../components';
import { CHANGE_PASSWORD } from '../../../mutations/Account/Account';
import { GET_SIGNED_IN_USER } from '../../../queries/Account/GetSignedInUser';
import ErrorHandler from '../../../utils/errorHandler';
import { encrypt } from '../../../utils/encryptDecrypt';

const ChangePasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Please enter password')
    .min(8, 'Password is too short - should be 8 characters minimum.')
    .matches(
      passwordRegex,
      'Please ensure the password has uppercase and lowercase letters, digits and special characters'
    ),
  currentPassword: Yup.string().required('Please enter current password'),
  username: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter username'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
    .required('Password confirmation is required')
});

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(0)
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
  arrowBack: {
    marginTop: theme.spacing(0),
    color: '#616161',
    marginLeft: theme.spacing(0)
  },
  logo: {
    marginTop: theme.spacing(0),
    paddingTop: theme.spacing(0),
    width: 173.1,
    height: 38.3
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const ChangePasswordForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const buttonDisabledStatus = (errors, values, loading) => {
    let status = true;
    if (
      isEmpty(errors) &&
      values.username !== '' &&
      values.currentPassword !== '' &&
      values.newPassword !== '' &&
      values.confirmPassword !== '' &&
      loading === false
    ) {
      status = false;
    }
    return status;
  };

  const redirectToSignIn = () => {
    history.push('/sign-in');
  };

  const [changePasswordDetails, setChangePasswordDetails] = React.useState({
    open: false,
    status: false,
    message: '',
    body: ''
  });

  const { open, status, message, body } = changePasswordDetails;
  const closeDialog = () => {
    setChangePasswordDetails({ open: false, status: true, message: '', body });
  };

  const [ChangePasswordMutation, { loading }] = useMutation(CHANGE_PASSWORD);

  return (
    <Formik
      initialValues={{
        otp: ''
      }}
      validationSchema={ChangePasswordSchema}
      onSubmit={(values, actions) => {
        ChangePasswordMutation({
          variables: {
            username: encrypt(values.username),
            newPassword: encrypt(values.newPassword),
            currentPassword: encrypt(values.currentPassword)
          },
          refetchQueries: [
            {
              query: GET_SIGNED_IN_USER,
              variables: { awaitRefetchQueries: true }
            }
          ]
        })
          .then((response) => {
            const {
              data: {
                changePassword: {
                  status: changePasswordStatus,
                  message: changePasswordMessage
                }
              }
            } = response;
            if (changePasswordStatus) {
              actions.resetForm();
              setChangePasswordDetails({
                open: true,
                status: true,
                message: changePasswordMessage,
                body
              });
              // history.push('/sign-in');
            } else {
              // change password error
              setChangePasswordDetails({
                open: true,
                status: false,
                message: changePasswordMessage,
                body
              });
            }
          })
          .catch((res) => {
            setChangePasswordDetails({
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
              <>
                {status ? (
                  <Button
                    variant="contained"
                    onClick={() => redirectToSignIn()}
                    color="default"
                    autoFocus>
                    SIGN IN
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => closeDialog()}
                    color="primary">
                    Close
                  </Button>
                )}
              </>
            }
            handleClose={closeDialog}
          />

          <div className={classes.FormTitleText}>
            <Typography className={classes.mainTitle} variant="h4">
              Password Change
            </Typography>
          </div>
          <TextField
            className={classes.textField}
            error={!!errors.username}
            fullWidth
            helperText={errors.username || null}
            label="Username"
            name="username"
            autoFocus
            onChange={(e) => {
              setFieldValue('username', e.target.value, true);
            }}
            type="text"
            value={values.username}
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            error={!!errors.currentPassword}
            fullWidth
            helperText={errors.currentPassword || null}
            label="Current Password"
            name="currentPassword"
            autoFocus
            onChange={(e) => {
              setFieldValue('currentPassword', e.target.value, true);
            }}
            type="password"
            value={values.currentPassword}
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            error={!!errors.newPassword}
            fullWidth
            helperText={errors.newPassword || null}
            label="Enter new password"
            name="newPassword"
            autoFocus
            onChange={(e) => {
              setFieldValue('newPassword', e.target.value, true);
            }}
            type="password"
            value={values.newPassword}
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            error={!!errors.confirmPassword}
            fullWidth
            helperText={errors.confirmPassword || null}
            label="Confirm new password"
            name="confirmPassword"
            autoFocus
            onChange={(e) => {
              setFieldValue('confirmPassword', e.target.value, true);
            }}
            type="password"
            value={values.confirmPassword}
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
            {loading ? 'Please wait...' : 'CHANGE PASSWORD'}
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
};

export default withRouter(ChangePasswordForm);
