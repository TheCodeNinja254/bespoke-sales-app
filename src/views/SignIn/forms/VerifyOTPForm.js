import React from 'react';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import { Form as FormikForm, Formik } from 'formik';
import isEmpty from 'lodash.isempty';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Dialog, StatusIcon } from '../../../components';
import { VALIDATE_OTP } from '../../../mutations/Account/Account';
import { GET_SIGNED_IN_USER } from '../../../queries/Account/GetSignedInUser';
import ErrorHandler from '../../../utils/errorHandler';
import { encrypt } from '../../../utils/encryptDecrypt';

const SignInSchema = Yup.object().shape({
  otp: Yup.string()
    .required('Please enter your one-time-password')
    .matches(/^[0-9]+$/, 'Must be digits only')
    .min(4, 'Must be exactly 4 digits')
    .max(4, 'Must be exactly 4 digits')
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
  formTitleText: {
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
  errorMessage: {
    marginTop: theme.spacing(1),
    color: theme.palette.error.main,
    textAlign: 'center'
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const VerifyOTPForm = () => {
  const styles = useStyles();
  const buttonDisabledStatus = (errors, values, loading) => {
    let status = true;
    if (isEmpty(errors) && values.otp !== '' && loading === false) {
      status = false;
    }
    return status;
  };
  const [validateOTPDetails, setValidateOTPDetails] = React.useState({
    open: false,
    status: false,
    message: '',
    body: ''
  });

  const { open, status, message, body } = validateOTPDetails;
  const closeDialog = () => {
    setValidateOTPDetails({ open: false, status: false, message: '', body });
  };

  const [ValidateOTPMutation, { loading }] = useMutation(VALIDATE_OTP);

  return (
    <Formik
      initialValues={{
        otp: ''
      }}
      validationSchema={SignInSchema}
      onSubmit={(values, actions) => {
        ValidateOTPMutation({
          variables: {
            otp: encrypt(values.otp)
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
                validateOTP: {
                  status: validateOTPStatus,
                  message: validateOTPMessage
                }
              }
            } = response;
            if (validateOTPStatus) {
              actions.resetForm();
            } else {
              // login error
              setValidateOTPDetails({
                open: true,
                status: false,
                message: validateOTPMessage,
                body
              });
            }
          })
          .catch((res) => {
            setValidateOTPDetails({
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
              <Box className={styles.dialogContent}>
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
          <div className={styles.formTitleText}>
            <Typography className={styles.mainTitle} variant="h4">
              OTP Verification
            </Typography>
          </div>
          <TextField
            className={styles.textField}
            error={!!errors.otp}
            fullWidth
            helperText={errors.otp || null}
            label="Please Enter OTP received on SMS"
            name="otp"
            autoFocus
            onChange={(e) => {
              setFieldValue('otp', e.target.value, true);
            }}
            type="password"
            value={values.otp}
            variant="outlined"
          />
          <Button
            className={styles.signInButton}
            color="primary"
            disabled={buttonDisabledStatus(errors, values, loading)}
            fullWidth
            size="large"
            type="submit"
            variant="contained">
            {loading ? 'Please wait...' : 'VERIFY OTP'}
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
};

export default withRouter(VerifyOTPForm);
