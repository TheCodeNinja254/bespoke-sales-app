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
import { Dialog, StatusIcon } from '../../../components';
import { GENERATE_OTP } from '../../../mutations/Account/Account';
import ErrorHandler from '../../../utils/errorHandler';
import { encrypt } from '../../../utils/encryptDecrypt';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email address')
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
  errorMessage: {
    marginTop: theme.spacing(1),
    color: theme.palette.error.main,
    textAlign: 'center'
  },
  logo: {
    marginTop: theme.spacing(0),
    width: 173.1,
    height: 38.3
  },
  signInButton: {
    margin: theme.spacing(2, 0),
    marginBottom: theme.spacing(2)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const ForgotPasswordForm = () => {
  const history = useHistory();
  const classes = useStyles();
  const buttonDisabledStatus = (errors, values, loading) => {
    let status = true;
    if (isEmpty(errors) && values.email !== '' && loading === false) {
      status = false;
    }
    return status;
  };
  const [generateOTPDetails, setGenerateOTPDetails] = React.useState({
    open: false,
    status: false,
    message: '',
    body: ''
  });

  const { open, status, message, body } = generateOTPDetails;
  const closeDialog = () => {
    setGenerateOTPDetails({ open: false, status: false, message: '', body });
  };

  const [GenerateOTPMutation, { loading }] = useMutation(GENERATE_OTP);

  return (
    <Formik
      initialValues={{
        otp: ''
      }}
      validationSchema={ForgotPasswordSchema}
      onSubmit={(values, actions) => {
        GenerateOTPMutation({
          variables: {
            email: encrypt(values.email)
          }
        })
          .then((response) => {
            const {
              data: {
                generateOTP: {
                  status: generateOTPStatus,
                  message: generateOTPMessage
                }
              }
            } = response;
            if (generateOTPStatus) {
              actions.resetForm();
              history.push('/password-reset');
            } else {
              // login error
              setGenerateOTPDetails({
                open: true,
                status: false,
                message: generateOTPMessage,
                body
              });
            }
          })
          .catch((res) => {
            setGenerateOTPDetails({
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
            <Typography className={classes.title} variant="h3">
              Forgot Password?
            </Typography>
            <br />
          </div>
          <Typography variant="body2">
            A reset code will be sent to your registered number. Enter a valid
            email address below to reset your password.
          </Typography>
          <TextField
            className={classes.textField}
            error={!!errors.email}
            fullWidth
            autoFocus
            helperText={errors.email || null}
            label="Provide your email address"
            name="otp"
            onChange={(e) => {
              setFieldValue('email', e.target.value, true);
            }}
            type="email"
            value={values.email}
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
            {loading ? 'Please wait...' : 'SEND RESET CODE'}
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
};
export default withRouter(ForgotPasswordForm);
