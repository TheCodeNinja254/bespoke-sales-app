import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import isEmpty from 'lodash.isempty';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useMutation } from '@apollo/client';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { decrypt, encrypt } from '../../../../utils/encryptDecrypt';
import GetAgenciesQuery from '../../../../queries/Agencies/GetAgenciesQuery';
import { Alert, Dialog, StatusIcon } from '../../../../components';
import { GET_ALL_USERS } from '../../../../queries/Account/GetAllUsersQuery';
import ErrorHandler from '../../../../utils/errorHandler';
import { EDITUSER } from '../../../../mutations/Account/Account';
import { configs } from '../../../../Configs';
import CollapsibleAlerts from '../../../../components/CollapsibleAlerts';

const EditUserSchema = Yup.object().shape({
  firstName: Yup.string().required('Please enter the first name'),
  lastName: Yup.string().required('Please enter the last name'),
  msisdn: Yup.string().required('Please enter mobile number'),
  userRole: Yup.string().required('Please select a user role'),
  agencyId: Yup.string().required('Please select an agency')
});

const useStyles = makeStyles((theme) => ({
  textField: {
    marginTop: theme.spacing(2)
  },
  addUserButton: {
    margin: theme.spacing(2, 0)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const EditUserForm = () => {
  const classes = useStyles();
  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (
      isEmpty(errors) &&
      values.firstName !== '' &&
      values.lastName !== '' &&
      values.msisdn !== '' &&
      values.userRole !== '' &&
      values.agencyId !== '' &&
      loading === false
    ) {
      buttonStatus = false;
    }
    return buttonStatus;
  };

  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const {
    firstName,
    lastName,
    docNumber,
    msisdn,
    createdBy,
    agencyId,
    role,
    userName
  } = userDetails.user;

  const [editUserDetails, setEditUserDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const [EditUserMutation, { loading }] = useMutation(EDITUSER);

  const { open, status, message } = editUserDetails;
  const closeDialog = () => {
    setEditUserDetails({ open: false, status: true, message: '' });
  };

  return (
    <Formik
      initialValues={{
        firstName,
        lastName,
        emailAddress: '',
        msisdn: decrypt(msisdn),
        docType: 'National ID',
        docNumber: decrypt(docNumber),
        userRole: role,
        agencyId
      }}
      validationSchema={EditUserSchema}
      onSubmit={(values) => {
        EditUserMutation({
          variables: {
            input: {
              firstName: values.firstName,
              lastName: values.lastName,
              userName, // Encrypted
              userMsisdn: encrypt(values.msisdn), // Encrypted
              userRole: values.userRole,
              passedAgencyId: values.agencyId
            }
          },
          refetchQueries: [
            {
              query: GET_ALL_USERS,
              variables: {
                agencyId: values.agencyId,
                awaitRefetchQueries: true
              }
            }
          ]
        })
          .then((response) => {
            const {
              data: {
                editUser: { status: userStatus, message: userMessage }
              }
            } = response;
            if (userStatus) {
              setEditUserDetails({
                open: true,
                status: userStatus,
                message: userMessage
              });
            } else {
              // registration error
              setEditUserDetails({
                open: true,
                status: userStatus,
                message: userMessage
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
            <CollapsibleAlerts alertMessage="You can now edit users info below. Fields that cannot be changed are marked as read-only." />
            <Grid item lg={6} xs={12}>
              <FormControl
                className={classes.textField}
                fullWidth
                variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  FIRST NAME
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type="text"
                  label="FIRST NAME"
                  value={values.firstName}
                  name="firstName"
                  error={!!errors.firstName}
                  helperText={errors.firstName || null}
                  onChange={(e) => {
                    setFieldValue('firstName', e.target.value, true);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
            </Grid>
            <Grid item lg={6} xs={12}>
              <FormControl
                className={classes.textField}
                fullWidth
                variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  LAST NAME
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type="text"
                  label="LAST NAME"
                  name="lastName"
                  value={values.lastName}
                  error={!!errors.lastName}
                  helperText={errors.lastName || null}
                  onChange={(e) => {
                    setFieldValue('lastName', e.target.value, true);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                fullWidth
                label="USERNAME (Read-Only)"
                type="text"
                readOnly
                value={userName ? decrypt(userName) : 'Unavailable'}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <FormControl
                className={classes.textField}
                fullWidth
                variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  MOBILE NUMBER
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type="text"
                  label="MOBILE NUMBER"
                  name="msisdn"
                  value={values.msisdn}
                  error={!!errors.msisdn}
                  helperText={errors.msisdn || null}
                  onChange={(e) => {
                    setFieldValue('msisdn', e.target.value, true);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                fullWidth
                label="DOCUMENT NUMBER (Read-Only)"
                type="text"
                readOnly
                name="docNumber"
                value={decrypt(docNumber)}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                fullWidth
                label="CREATED BY (Read-Only)"
                type="text"
                readOnly
                value={createdBy ? decrypt(createdBy) : 'Unavailable'}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                fullWidth
                label="Select Role"
                error={!!errors.userRole}
                helperText={errors.userRole || null}
                name="userRole"
                onChange={(e) => {
                  setFieldValue('userRole', e.target.value, true);
                }}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.userRole}
                variant="outlined">
                {configs.adminManageableUserRoles.map((roleItem) => (
                  <option key={roleItem.roleId} value={roleItem.roleId}>
                    {roleItem.roleName}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item lg={6} xs={12}>
              <GetAgenciesQuery>
                {({ getAgencies }) => (
                  <>
                    {getAgencies.getAgenciesStatus ? (
                      <TextField
                        fullWidth
                        className={classes.textField}
                        label="Select Agency"
                        name="agencyId"
                        error={!!errors.agencyId}
                        helperText={errors.agencyId || null}
                        onChange={(e) => {
                          setFieldValue('agencyId', e.target.value, true);
                        }}
                        select
                        value={values.agencyId}
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        variant="outlined">
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        <option value="">Select Agency</option>
                        {getAgencies.agencies.map((agency) => (
                          <option key={agency.agencyId} value={agency.agencyId}>
                            {agency.agencyName}
                          </option>
                        ))}
                      </TextField>
                    ) : (
                      <Alert severity="warning">
                        An error was encountered trying to load the list of
                        agencies regions
                      </Alert>
                    )}
                  </>
                )}
              </GetAgenciesQuery>
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.addUserButton}
                color="primary"
                disabled={buttonDisabledStatus(errors, values, loading)}
                fullWidth
                size="large"
                type="submit"
                variant="contained">
                {loading ? 'Please wait...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </FormikForm>
      )}
    </Formik>
  );
};

EditUserForm.propTypes = {};

export default React.memo(EditUserForm);
