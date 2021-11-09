/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import isEmpty from 'lodash.isempty';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import trimNonNumbers from '../../../../utils/trimNonNumbers';
import { Dialog, StatusIcon } from '../../../../components';
import ErrorHandler from '../../../../utils/errorHandler';
import { encrypt } from '../../../../utils/encryptDecrypt';
import { GET_AGENCIES } from '../../../../queries/Agencies/GetAgenciesQuery';
import { CREATE_AGENCY } from '../../../../mutations/Agencies';

const AddDealerSchema = Yup.object().shape({
  agencyName: Yup.string()
    .min(4, 'Agency name must be atleast 4 characters')
    .max(32, 'Agency name must not be more than 32 characters')
    .required('Please enter the Agency name'),
  agencyType: Yup.string().required('Please select a valid agency type'),
  dealerCode: Yup.string()
    .min(3, 'The dealer code must be atleast 3 characters')
    .max(32, 'The dealer code must not exceed 32 characters')
    .required('Please enter a valid dealer code'),
  payBill: Yup.number()
    .max(9999999, 'Invalid paybill number')
    .min(1000, 'Invalid paybill number')
    .required('Please enter a paybill number'),
  msisdn: Yup.string()
    .min(9, 'Invalid phone number')
    .required('Please select a valid mobile number'),
  bankName: Yup.string()
    .min(4, 'The bank name must be atleast 4 characters')
    .max(32, 'The bank name must not exceed 32 characters')
    .required('please enter a valid bank name'),
  bankAccountNumber: Yup.number()
    .max(9999999999999999, 'Invalid account number')
    .min(1000, 'Invalid account number')
    .required('Please select a valid bank account number')
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

const AddDealerForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (
      isEmpty(errors) &&
      values.agencyName !== '' &&
      values.agencyType !== '' &&
      values.dealerCode !== '' &&
      values.payBill !== '' &&
      values.msisdn !== '' &&
      values.bankName !== '' &&
      values.bankAccountNumber !== '' &&
      loading === false
    ) {
      buttonStatus = false;
    }
    return buttonStatus;
  };

  const [addDealerDetails, setAddDealerDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const [CreateDealerMutation, { loading }] = useMutation(CREATE_AGENCY);

  const { open, status, message } = addDealerDetails;
  const closeDialog = () => {
    setAddDealerDetails({ open: false, status: true, message: '' });
  };

  return (
    <Formik
      initialValues={{
        agencyName: '',
        agencyType: '1',
        dealerCode: '',
        msisdn: '',
        payBill: '',
        bankName: '',
        bankAccountNumber: ''
      }}
      validationSchema={AddDealerSchema}
      onSubmit={(values, actions) => {
        CreateDealerMutation({
          variables: {
            input: {
              agencyName: values.agencyName,
              agencyType: values.agencyType,
              dealerCode: encrypt(values.dealerCode), // Encrypted
              payBill: encrypt(values.payBill), // Encrypted
              msisdn: encrypt(values.msisdn), // Encrypted
              bankName: encrypt(values.bankName), // Encrypted
              bankAccountNumber: encrypt(values.bankAccountNumber) // Encrypted
            }
          },
          refetchQueries: [
            { query: GET_AGENCIES, variables: { awaitRefetchQueries: true } }
          ]
        })
          .then((response) => {
            const {
              data: {
                createAgency: { status: userStatus, message: userMessage }
              }
            } = response;
            if (userStatus) {
              actions.resetForm();
              history.push('/super-admin/manage-dealers');
            } else {
              // registration error
              setAddDealerDetails({
                open: true,
                status: userStatus,
                message: userMessage
              });
            }
          })
          .catch((res) => {
            setAddDealerDetails({
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
                error={!!errors.agencyName}
                fullWidth
                autoFocus
                helperText={errors.agencyName || null}
                label="Agency/Shop Name"
                name="agencyName"
                onChange={(e) => {
                  setFieldValue('agencyName', e.target.value, true);
                }}
                type="text"
                value={values.agencyName}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                fullWidth
                label="Select Agency Type"
                error={!!errors.agencyType}
                helperText={errors.agencyType || null}
                name="agencyType"
                onChange={(e) => {
                  setFieldValue('agencyType', e.target.value, true);
                }}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.agencyType}
                variant="outlined">
                <option value="1"> Agency</option>
                <option value="2"> Reseller</option>
                <option value="3"> Retail</option>
              </TextField>
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.dealerCode}
                fullWidth
                helperText={errors.dealerCode || null}
                label="Dealer Code"
                name="dealerCode"
                onChange={(e) => {
                  setFieldValue('dealerCode', e.target.value, true);
                }}
                type="text"
                value={values.dealerCode}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.payBill}
                fullWidth
                helperText={errors.payBill || null}
                onChange={(e) => {
                  setFieldValue('payBill', e.target.value, true);
                }}
                label="Paybill Number"
                name="payBill"
                type="number"
                value={values.payBill}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.msisdn}
                fullWidth
                helperText={errors.msisdn || null}
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
                name="msisdn"
                inputProps={{ maxLength: 13, min: 0 }}
                onChange={(e) => {
                  const clean = trimNonNumbers(e.target.value);
                  setFieldValue('msisdn', clean, true);
                }}
                type="tel"
                value={values.msisdn}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.bankName}
                fullWidth
                helperText={errors.bankName || null}
                label="Bank Name"
                name="bankName"
                onChange={(e) => {
                  setFieldValue('bankName', e.target.value, true);
                }}
                type="text"
                value={values.bankName}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                className={classes.textField}
                error={!!errors.bankAccountNumber}
                fullWidth
                required
                helperText={errors.bankAccountNumber || null}
                label="Bank Account Number"
                name="bankAccountNumber"
                onChange={(e) => {
                  setFieldValue('bankAccountNumber', e.target.value, true);
                }}
                type="text"
                value={values.bankAccountNumber}
                variant="outlined"
              />
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
                {loading ? 'Please wait...' : 'Add Agency/Shop'}
              </Button>
            </Grid>
          </Grid>
        </FormikForm>
      )}
    </Formik>
  );
};

export default AddDealerForm;
