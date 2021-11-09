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
import { Alert, Dialog, StatusIcon } from '../../../../components';
import { CREATEUSER } from '../../../../mutations/Account/Account';
import ErrorHandler from '../../../../utils/errorHandler';
import { encrypt } from '../../../../utils/encryptDecrypt';
import GetAgenciesQuery from '../../../../queries/Agencies/GetAgenciesQuery';
import { GET_ALL_USERS } from '../../../../queries/Account/GetAllUsersQuery';
import { configs } from '../../../../Configs';

const AddUserSchema = Yup.object().shape({
  firstName: Yup.string().required('Please enter the first name'),
  lastName: Yup.string().required('Please enter the last name'),
  emailAddress: Yup.string()
    .required('Please enter the email')
    .email('Please enter a valid email'),
  userMsisdn: Yup.string().required('Please enter mobile number'),
  docType: Yup.string().required('Please select a document type'),
  docNumber: Yup.string().required('please enter a valid document number'),
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

const AddUserForm = () => {
  const classes = useStyles();
  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (
      isEmpty(errors) &&
      values.firstName !== '' &&
      values.lastName !== '' &&
      values.emailAddress !== '' &&
      values.userMsisdn !== '' &&
      values.docType !== '' &&
      values.docNumber !== '' &&
      values.userRole !== '' &&
      values.agencyId !== '' &&
      loading === false
    ) {
      buttonStatus = false;
    }
    return buttonStatus;
  };

  const [addUserDetails, setAddUserDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const [CreateUserMutation, { loading }] = useMutation(CREATEUSER);

  const { open, status, message } = addUserDetails;
  const closeDialog = () => {
    setAddUserDetails({ open: false, status: true, message: '' });
  };

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        emailAddress: '',
        userMsisdn: '',
        docType: 'National ID',
        docNumber: '',
        userRole: '9',
        agencyId: '1'
      }}
      validationSchema={AddUserSchema}
      onSubmit={(values, actions) => {
        CreateUserMutation({
          variables: {
            input: {
              firstName: values.firstName,
              lastName: values.lastName,
              emailAddress: encrypt(values.emailAddress), // Encrypted
              userMsisdn: encrypt(values.userMsisdn), // Encrypted
              docType: values.docType,
              docNumber: encrypt(values.docNumber), // Encrypted
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
                createUser: { status: userStatus, message: userMessage }
              }
            } = response;
            if (userStatus) {
              actions.resetForm();
              setAddUserDetails({
                open: true,
                status: userStatus,
                message: userMessage
              });
              // history.push('/super-admin/manage-users');
            } else {
              // registration error
              setAddUserDetails({
                open: true,
                status: userStatus,
                message: userMessage
              });
            }
          })
          .catch((res) => {
            setAddUserDetails({
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
                error={!!errors.emailAddress}
                fullWidth
                helperText={errors.emailAddress || null}
                onChange={(e) => {
                  setFieldValue('emailAddress', e.target.value, true);
                }}
                label="Email"
                name="emailAddress"
                type="email"
                value={values.emailAddress}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.userMsisdn}
                fullWidth
                helperText={errors.userMsisdn || null}
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
                name="userMsisdn"
                inputProps={{ maxLength: 13, min: 0 }}
                onChange={(e) => {
                  const clean = trimNonNumbers(e.target.value);
                  setFieldValue('userMsisdn', clean, true);
                }}
                type="tel"
                value={values.userMsisdn}
                variant="outlined"
              />
            </Grid>
            {/* document type */}
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                fullWidth
                label="Select Document Type"
                error={!!errors.docType}
                helperText={errors.docType || null}
                name="docType"
                onChange={(e) => {
                  setFieldValue('docType', e.target.value, true);
                }}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.docType}
                variant="outlined">
                <option value="">Select Document Type</option>
                <option value="National ID">National ID</option>
                <option value="Passport">Passport</option>
                <option value="Alien ID">Alien ID</option>
              </TextField>
            </Grid>
            {/* document id number */}
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.docNumber}
                fullWidth
                required
                helperText={errors.docNumber || null}
                label="Document Number"
                name="docNumber"
                onChange={(e) => {
                  setFieldValue('docNumber', e.target.value, true);
                }}
                type="text"
                value={values.docNumber}
                variant="outlined"
              />
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
                {configs.adminManageableUserRoles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </TextField>
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
                {loading ? 'Please wait...' : 'Add User'}
              </Button>
            </Grid>
          </Grid>
        </FormikForm>
      )}
    </Formik>
  );
};

export default AddUserForm;
