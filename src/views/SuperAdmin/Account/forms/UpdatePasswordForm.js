/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useMutation } from '@apollo/client';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import isEmpty from 'lodash.isempty';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { passwordRegex } from '../../../../utils/constants';
import { Dialog, StatusIcon } from '../../../../components';
import { UPDATEPASSWORD } from '../../../../mutations/Account/Account';
import ErrorHandler from '../../../../utils/errorHandler';
import hashString from '../../../../utils/hashString';

const UpdatePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Please enter the password')
    .min(8, 'Password is too short - should be 8 characters minimum.')
    .matches(
      passwordRegex,
      'Please ensure the password has uppercase and lowercase letters, digits and special characters'
    ),
  currentPassword: Yup.string()
    .required('Please enter the password')
    .min(8, 'Password is too short - should be 8 characters minimum.')
});

const useStyles = makeStyles((theme) => ({
  textField: {
    marginTop: theme.spacing(2)
  },
  updatePasswordButton: {
    margin: theme.spacing(2, 0)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const UpdatePasswordForm = () => {
  const classes = useStyles();
  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (
      isEmpty(errors) &&
      values.password !== '' &&
      values.currentPassword !== '' &&
      loading === false
    ) {
      buttonStatus = false;
    }
    return buttonStatus;
  };

  const [updatePassword, setUpdatePassword] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const [UpdatePasswordMutation, { loading }] = useMutation(UPDATEPASSWORD);

  const { open, status, message } = updatePassword;
  const closeDialog = () => {
    setUpdatePassword({ open: false, status: false, message: '' });
  };

  return (
    <Formik
      initialValues={{
        password: '',
        currentPassword: ''
      }}
      validationSchema={UpdatePasswordSchema}
      onSubmit={(values, actions) => {
        UpdatePasswordMutation({
          variables: {
            currentPassword: hashString(values.currentPassword),
            password: hashString(values.password)
          },
          refetchQueries: []
        })
          .then((response) => {
            const {
              data: {
                updateAccountPassword: {
                  status: userStatus,
                  message: userMessage
                }
              }
            } = response;
            if (userStatus) {
              setUpdatePassword({
                open: true,
                status: userStatus,
                message: userMessage
              });
              actions.resetForm();
            } else {
              // registration error
              setUpdatePassword({
                open: true,
                status: userStatus,
                message: userMessage
              });
            }
          })
          .catch((res) => {
            setUpdatePassword({
              open: true,
              status: false,
              message: ErrorHandler(res.message || res.graphQLErrors[0].message)
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
          <Grid container spacing={3}>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.currentPassword}
                fullWidth
                helperText={errors.currentPassword || null}
                label="Current Password"
                name="currentPassword"
                onChange={(e) => {
                  setFieldValue('currentPassword', e.target.value, true);
                }}
                type="password"
                value={values.currentPassword}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.password}
                fullWidth
                helperText={errors.password || null}
                label="New Password"
                name="password"
                onChange={(e) => {
                  setFieldValue('password', e.target.value, true);
                }}
                type="password"
                value={values.password}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.updatePasswordButton}
                color="primary"
                disabled={buttonDisabledStatus(errors, values, loading)}
                fullWidth
                size="large"
                type="submit"
                variant="contained">
                Update Password
              </Button>
            </Grid>
          </Grid>
        </FormikForm>
      )}
    </Formik>
  );
};

export default UpdatePasswordForm;
