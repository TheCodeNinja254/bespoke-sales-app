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
import trimNonNumbers from '../../../../utils/trimNonNumbers';
import { Dialog, StatusIcon } from '../../../../components';
import { GET_USERS } from '../../../../queries/Account/UsersQuery';
import { GET_USER } from '../../../../queries/Account/GetUserQuery';
import { EDITUSER } from '../../../../mutations/Account/Account';
import ErrorHandler from '../../../../utils/errorHandler';
import { encrypt } from '../../../../utils/encryptDecrypt';

const AddUserSchema = Yup.object().shape({
  firstName: Yup.string().required('Please enter the first name'),
  lastName: Yup.string().required('Please enter the last name'),
  email: Yup.string()
    .required('Please enter the email')
    .email('Please enter a valid email'),
  mobileNumber: Yup.string().required('Please enter the mobile number'),
  userRole: Yup.string().required('Please select the user role'),
  permissions: Yup.string().required('Please select the permissions'),
  status: Yup.string().required('Please select the status'),
  resource: Yup.string().required('Please select a resource'),
  store: Yup.string().required('Please select a store')
});

const useStyles = makeStyles((theme) => ({
  textField: {
    marginTop: theme.spacing(2)
  },
  editUserButton: {
    margin: theme.spacing(2, 0)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const EditUserForm = ({ usersDetails }) => {
  const classes = useStyles();
  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (
      isEmpty(errors) &&
      values.firstName !== '' &&
      values.lastName !== '' &&
      values.mobileNumber !== '' &&
      values.userRole !== '' &&
      values.userRole !== '' &&
      values.permissions !== '' &&
      values.status !== '' &&
      values.resource !== '' &&
      values.status !== '' &&
      values.store !== '' &&
      loading === false
    ) {
      buttonStatus = false;
    }
    return buttonStatus;
  };
  const {
    user,
    resource: { id: resourceId },
    store: { id: storeId }
  } = usersDetails;

  const [editUserDetails, setEditUserDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const [EditUserMutation, { loading }] = useMutation(EDITUSER);

  const { open, status, message } = editUserDetails;
  const closeDialog = () => {
    setEditUserDetails({ open: false, status: false, message: '' });
  };

  return (
    <Formik
      initialValues={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        jobTitle: user.jobTitle,
        userRole: user.userRole,
        permissions: user.permissions,
        status: user.status,
        resource: resourceId,
        store: storeId
      }}
      validationSchema={AddUserSchema}
      onSubmit={(values) => {
        EditUserMutation({
          variables: {
            input: {
              id: user.id,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              mobileNumber: encrypt(values.mobileNumber),
              jobTitle: values.jobTitle,
              userRole: user.userRole,
              status: user.status,
              permissions: user.permissions,
              resource: resourceId,
              store: storeId
            }
          },
          refetchQueries: [
            {
              query: GET_USERS,
              variables: {
                perPage: 10,
                page: 1,
                userName: '',
                awaitRefetchQueries: true
              }
            },
            {
              query: GET_USER,
              variables: { id: user.id, awaitRefetchQueries: true }
            }
          ]
        })
          .then((response) => {
            const {
              data: {
                updateUserAccountDetails: {
                  status: editStatus,
                  message: editMessage
                }
              }
            } = response;
            if (editStatus) {
              setEditUserDetails({
                open: true,
                status: editStatus,
                message: editMessage
              });
            } else {
              // update Error
              setEditUserDetails({
                open: true,
                status: editStatus,
                message: editMessage
              });
            }
          })
          .catch((res) => {
            setEditUserDetails({
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
                error={!!errors.firstName}
                fullWidth
                autoFocus
                helperText={errors.firstName || null}
                label="First Name"
                name="firstName"
                onChange={(e) => {
                  setFieldValue('firstName', e.target.value, true);
                }}
                type="text"
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.lastName}
                fullWidth
                helperText={errors.lastName || null}
                label="Last Name"
                name="lastName"
                onChange={(e) => {
                  setFieldValue('lastName', e.target.value, true);
                }}
                type="text"
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.email}
                fullWidth
                helperText={errors.email || null}
                onChange={(e) => {
                  setFieldValue('email', e.target.value, true);
                }}
                label="Email"
                name="email"
                type="email"
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.mobileNumber}
                fullWidth
                helperText={errors.mobileNumber || null}
                onKeyDown={(e) => {
                  if (
                    e.key === '-' ||
                    e.key === 'e' ||
                    e.key === 'Unidentified'
                  ) {
                    e.preventDefault();
                  }
                }}
                label="Mobile Number"
                name="mobileNumber"
                inputProps={{ maxLength: 13, min: 0 }}
                onChange={(e) => {
                  const clean = trimNonNumbers(e.target.value);
                  setFieldValue('mobileNumber', clean, true);
                }}
                type="tel"
                value={values.mobileNumber}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.jobTitle}
                fullWidth
                helperText={errors.jobTitle || null}
                label="Job Title"
                name="jobTitle"
                inputProps={{ maxLength: 13, min: 0 }}
                onChange={(e) => {
                  setFieldValue('jobTitle', e.target.value, true);
                }}
                type="text"
                value={values.jobTitle}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.editUserButton}
                color="primary"
                disabled={buttonDisabledStatus(errors, values, loading)}
                fullWidth
                size="large"
                type="submit"
                variant="contained">
                {loading ? 'Please wait...' : 'Update Account Details'}
              </Button>
            </Grid>
          </Grid>
        </FormikForm>
      )}
    </Formik>
  );
};

export default EditUserForm;
