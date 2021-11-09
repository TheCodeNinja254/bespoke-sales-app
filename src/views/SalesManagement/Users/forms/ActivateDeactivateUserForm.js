import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useMutation } from '@apollo/client';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Form as FormikForm, Formik } from 'formik';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Dialog, StatusIcon } from '../../../../components';
import { GET_USERS } from '../../../../queries/Account/UsersQuery';
import { UPDATE_USER_STATUS } from '../../../../mutations/Account/Account';
import ErrorHandler from '../../../../utils/errorHandler';

const useStyles = makeStyles((theme) => ({
  textField: {
    marginTop: theme.spacing(2)
  },
  activateRadio: {
    color: '#43b02a'
  },
  addUserButton: {
    margin: theme.spacing(2, 0)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const AcivateDeactivateUserForm = (props) => {
  const { agencyId } = props;
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const { userName, msisdn } = userDetails.user;

  const classes = useStyles();
  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (values.status !== '' && loading === false) {
      buttonStatus = false;
    }
    return buttonStatus;
  };

  const [updateUserDetails, setUpdateUserDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const [UpdateUserStatusMutation, { loading }] =
    useMutation(UPDATE_USER_STATUS);

  const { open, status, message } = updateUserDetails;
  const closeDialog = () => {
    setUpdateUserDetails({ open: false, status: false, message: '' });
  };

  return (
    <Formik
      initialValues={{
        status: ''
      }}
      onSubmit={(values) => {
        UpdateUserStatusMutation({
          variables: {
            status: values.status,
            msisdn,
            userName,
            emailAddress: ''
          },
          refetchQueries: [
            {
              query: GET_USERS,
              variables: { agencyId, awaitRefetchQueries: true }
            }
          ]
        })
          .then((response) => {
            const {
              data: {
                updateUserStatus: { status: userStatus, message: userMessage }
              }
            } = response;
            if (userStatus) {
              // Success Message
              setUpdateUserDetails({
                open: true,
                status: userStatus,
                message: userMessage
              });
            } else {
              // update error
              setUpdateUserDetails({
                open: true,
                status: userStatus,
                message: userMessage
              });
            }
          })
          .catch((res) => {
            setUpdateUserDetails({
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
              <RadioGroup
                className={classes.activateRadio}
                value={values.status}
                onChange={(e) => {
                  setFieldValue('status', e.target.value, true);
                }}>
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="Disabled"
                />
              </RadioGroup>
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
                {loading ? 'Please wait...' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </FormikForm>
      )}
    </Formik>
  );
};

export default AcivateDeactivateUserForm;
