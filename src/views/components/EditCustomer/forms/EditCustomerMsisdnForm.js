import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography
} from '@material-ui/core';
import { Form as FormikForm, Formik } from 'formik';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import isEmpty from 'lodash.isempty';
import { useMutation } from '@apollo/client';
import ErrorHandler from '../../../../utils/errorHandler';
import Dialog from '../../../../components/Dialog';
import StatusIcon from '../../../../components/StatusIcon';
import { UPDATE_CUSTOMER_MSISDN } from '../../../../mutations/Customers/Customers';
import trimNonNumbers from '../../../../utils/trimNonNumbers';
import { encrypt } from '../../../../utils/encryptDecrypt';

const LeadStatusSchema = Yup.object().shape({
  sponsorMsisdn: Yup.string()
    .required('Please enter a valid customer mobile number')
    .min(
      9,
      'The number entered is too short. Please enter a valid mobile number'
    )
    .max(
      12,
      'The number entered is too long. Please enter a valid mobile number'
    )
});

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
    paddingTop: theme.spacing(2),
    height: '100%',
    backgroundColor: '#E5E5E5',
    opacity: '90%'
  },
  formHeader: {
    fontWeight: 500,
    marginBottom: theme.spacing(2),
    textDecoration: 'bold'
  },
  textFieldWithLable: {
    marginTop: theme.spacing(0),
    backgroundColor: theme.palette.white.main
  },
  currentValueText: {
    color: theme.palette.primary.main
  },
  margin: {
    margin: theme.spacing(1)
  },
  dialogContent: {
    textAlign: 'center'
  },
  helperText: {
    color: theme.palette.error.main
  }
}));

const EditCustomerMsisdnForm = (props) => {
  const classes = useStyles();
  const { customerDetails } = props;
  const { sponsorMsisdn, registrationId } = customerDetails;

  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (isEmpty(errors) && values.sponsorMsisdn !== '' && loading === false) {
      buttonStatus = false;
    }
    return buttonStatus;
  };

  const [UpdateCustomerMsisdnMutation, { loading }] = useMutation(
    UPDATE_CUSTOMER_MSISDN
  );

  const [updateMsisdnDetails, setUpdateMsisdnDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });

  const { open, status, message } = updateMsisdnDetails;
  const closeDialog = () => {
    setUpdateMsisdnDetails({ open: false, status: false, message: '' });
  };

  return (
    <Formik
      initialValues={{
        sponsorMsisdn
      }}
      validationSchema={LeadStatusSchema}
      onSubmit={(values) => {
        UpdateCustomerMsisdnMutation({
          variables: {
            input: {
              sponsorMsisdn: encrypt(values.sponsorMsisdn),
              registrationId
            }
          }
        })
          .then((response) => {
            const {
              data: {
                updateCustomerMsisdn: {
                  status: updateStatus,
                  message: customerMessage
                }
              }
            } = response;
            if (updateStatus) {
              setUpdateMsisdnDetails({
                open: true,
                status: updateStatus,
                message: customerMessage
              });
            } else {
              setUpdateMsisdnDetails({
                open: true,
                status: updateStatus,
                message: customerMessage
              });
            }
          })
          .catch((res) => {
            setUpdateMsisdnDetails({
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
          <FormControl
            className={classes.textFieldWithLable}
            fullWidth
            type="text"
            variant="outlined"
            name="sponsorMsisdn"
            onChange={(e) => {
              const clean = trimNonNumbers(e.target.value);
              setFieldValue('sponsorMsisdn', clean, true);
            }}
            value={values.sponsorMsisdn}>
            <OutlinedInput
              id="outlined-adornment-msisdn"
              defaultValue={sponsorMsisdn}
              error={!!errors.sponsorMsisdn}
              label="CUSTOMER MOBILE NUMBER"
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    color="primary"
                    type="submit"
                    disabled={buttonDisabledStatus(errors, values, loading)}
                    variant="contained">
                    {loading ? 'Please wait...' : 'Update'}
                  </Button>
                </InputAdornment>
              }
            />
            <FormHelperText className={classes.helperText}>
              {errors.sponsorMsisdn}
            </FormHelperText>
            <InputLabel variant="outlined">CUSTOMER MOBILE NUMBER</InputLabel>
          </FormControl>
        </FormikForm>
      )}
    </Formik>
  );
};

EditCustomerMsisdnForm.propTypes = {
  customerDetails: PropTypes.object.isRequired
};

export default React.memo(EditCustomerMsisdnForm);
