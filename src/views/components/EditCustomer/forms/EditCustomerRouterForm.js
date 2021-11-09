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
import { UPDATE_CUSTOMER_ROUTER } from '../../../../mutations/Customers/Customers';
import trimNonNumbers from '../../../../utils/trimNonNumbers';
import { encrypt } from '../../../../utils/encryptDecrypt';

const LeadStatusSchema = Yup.object().shape({
  serialNumber: Yup.string()
    .required('Please enter a router serial number')
    .matches(/^[0-9]+$/, 'Must be digits only!')
    .max(
      15,
      'Maximum of 15 Characters allowed, otherwise the Serial is invalid'
    )
    .min(
      15,
      'Minimum of 15 Characters allowed, otherwise the Serial is invalid'
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
  const { routerSerialNumber, registrationId } = customerDetails;

  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (isEmpty(errors) && values.serialNumber !== '' && loading === false) {
      buttonStatus = false;
    }
    return buttonStatus;
  };

  const [UpdateCustomerRouterMutation, { loading }] = useMutation(
    UPDATE_CUSTOMER_ROUTER
  );

  const [updateRouterDetails, setUpdateRouterDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });

  const { open, status, message } = updateRouterDetails;
  const closeDialog = () => {
    setUpdateRouterDetails({ open: false, status: false, message: '' });
  };

  return (
    <Formik
      initialValues={{
        serialNumber: routerSerialNumber
      }}
      validationSchema={LeadStatusSchema}
      onSubmit={(values) => {
        UpdateCustomerRouterMutation({
          variables: {
            input: {
              serialNumber: encrypt(values.serialNumber),
              registrationId: Number(registrationId)
            }
          }
        })
          .then((response) => {
            const {
              data: {
                updateCustomerRouter: {
                  status: updateStatus,
                  message: customerMessage
                }
              }
            } = response;
            if (updateStatus) {
              setUpdateRouterDetails({
                open: true,
                status: updateStatus,
                message: customerMessage
              });
            } else {
              setUpdateRouterDetails({
                open: true,
                status: updateStatus,
                message: customerMessage
              });
            }
          })
          .catch((res) => {
            setUpdateRouterDetails({
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
            label="Router Serial Number"
            type="text"
            variant="outlined"
            name="serialNumber"
            error={!!errors.serialNumber}
            onChange={(e) => {
              const clean = trimNonNumbers(e.target.value);
              setFieldValue('serialNumber', clean, true);
            }}
            value={values.serialNumber}>
            <OutlinedInput
              id="outlined-adornment-password"
              defaultValue={routerSerialNumber}
              label="ROUTER SERIAL NUMBER"
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
            <InputLabel variant="outlined">ROUTER SERIAL NUMBER</InputLabel>
            <FormHelperText className={classes.helperText}>
              {errors.serialNumber}
            </FormHelperText>
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
