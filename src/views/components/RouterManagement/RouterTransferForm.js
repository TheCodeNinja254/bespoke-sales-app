import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Typography
} from '@material-ui/core';
import { Form as FormikForm, Formik } from 'formik';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import isEmpty from 'lodash.isempty';
import { useMutation } from '@apollo/client';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import TextField from '@material-ui/core/TextField';
import ErrorHandler from '../../../utils/errorHandler';
import Dialog from '../../../components/Dialog';
import StatusIcon from '../../../components/StatusIcon';
import { ROUTER_TRANSFER } from '../../../mutations/Routers/Routers';
import GetAgenciesQuery from '../../../queries/Agencies/GetAgenciesQuery';
import { Alert } from '../../../components';
import GetSignedInUserQuery from '../../../queries/Account/GetSignedInUser';
import { configs } from '../../../Configs';

const ValidationSchema = Yup.object().shape({
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
  deleteButton: {
    color: theme.palette.primary.main
  },
  textField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  actionText: {
    marginTop: theme.spacing(3)
  },
  helperText: {
    color: theme.palette.error.main
  }
}));

const RouterTransferForm = (props) => {
  const classes = useStyles();
  const { modalState, setModalState } = props;

  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (isEmpty(errors) && values.serialNumber !== '' && loading === false) {
      buttonStatus = false;
    }
    return buttonStatus;
  };

  const [RouterTransferMutation, { loading }] = useMutation(ROUTER_TRANSFER);

  const [deleteDetails, setDeleteDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });

  const { open, status, message } = deleteDetails;
  const closeDialog = () => {
    setDeleteDetails({ open: false, status: false, message: '' });
  };

  const closeFormModal = () => {
    setModalState(false);
  };

  const fullRouterMgr = configs.fullRouterMgr.split('|');

  return (
    <Dialog
      open={modalState}
      modalContent={
        <Formik
          initialValues={{
            serialNumber: '',
            agencyId: -1
          }}
          validationSchema={ValidationSchema}
          onSubmit={(values) => {
            RouterTransferMutation({
              variables: {
                serialNumber: values.serialNumber,
                agencyId: Number(values.agencyId) || -1
              }
            })
              .then((response) => {
                const {
                  data: {
                    routerTransfer: {
                      status: updateStatus,
                      message: customerMessage
                    }
                  }
                } = response;
                if (updateStatus) {
                  setDeleteDetails({
                    open: true,
                    status: updateStatus,
                    message: customerMessage
                  });
                } else {
                  setDeleteDetails({
                    open: true,
                    status: updateStatus,
                    message: customerMessage
                  });
                }
              })
              .catch((res) => {
                setDeleteDetails({
                  open: true,
                  status: false,
                  message: ErrorHandler(
                    res.message || res.graphQLErrors[0].message
                  )
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
              <Typography variant="h3" align="center" gutterBottom>
                Router Transfer
              </Typography>
              <Typography variant="body2" align="center" gutterBottom>
                Router transfer works for routers already uploaded to a
                different shop/agency and not already sold
              </Typography>
              <GetSignedInUserQuery>
                {({
                  getSignedInUser: {
                    user: { userCategory }
                  }
                }) => (
                  <>
                    {fullRouterMgr.includes(userCategory) && (
                      <GetAgenciesQuery>
                        {({ getAgencies }) => (
                          <>
                            {getAgencies.getAgenciesStatus ? (
                              <TextField
                                fullWidth
                                className={classes.textField}
                                label="Select agency/shop"
                                name="agencyId"
                                error={!!errors.agencyId}
                                helperText={errors.agencyId || null}
                                onChange={(e) => {
                                  setFieldValue(
                                    'agencyId',
                                    Number(e.target.value),
                                    true
                                  );
                                }}
                                select
                                value={values.agencyId}
                                // eslint-disable-next-line react/jsx-sort-props
                                SelectProps={{ native: true }}
                                variant="outlined">
                                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                                <option value="" />
                                {getAgencies.agencies.map((agency) => (
                                  <option
                                    key={agency.agencyId}
                                    value={Number(agency.agencyId)}>
                                    {agency.agencyName}
                                  </option>
                                ))}
                              </TextField>
                            ) : (
                              <Alert severity="warning">
                                An error was encountered trying to load the list
                                of agencies regions
                              </Alert>
                            )}
                          </>
                        )}
                      </GetAgenciesQuery>
                    )}
                  </>
                )}
              </GetSignedInUserQuery>
              <FormControl
                className={classes.textFieldWithLable}
                fullWidth
                label="serialNumber for deletion"
                type="text"
                variant="outlined"
                name="serialNumber"
                error={!!errors.serialNumber}
                onChange={(e) => {
                  setFieldValue('serialNumber', e.target.value, true);
                }}
                // value={values.serialNumber}>
                value="Transfer now">
                <OutlinedInput
                  id="outlined-adornment-msisdn"
                  placeholder="Enter router serial no. to transfer"
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        className={classes.deleteButton}
                        type="submit"
                        disabled={buttonDisabledStatus(errors, values, loading)}
                        variant="contained">
                        {loading ? (
                          'Please wait...'
                        ) : (
                          <>
                            <MoveToInboxIcon />
                            <Typography>Transfer now</Typography>
                          </>
                        )}
                      </Button>
                    </InputAdornment>
                  }
                />
                <FormHelperText className={classes.helperText}>
                  {errors.serialNumber}
                </FormHelperText>
              </FormControl>
            </FormikForm>
          )}
        </Formik>
      }
      modalActions={
        <Button
          variant="contained"
          onClick={() => closeFormModal()}
          color="primary"
          autoFocus>
          Close
        </Button>
      }
      handleClose={closeFormModal}
    />
  );
};

RouterTransferForm.propTypes = {
  modalState: PropTypes.bool.isRequired,
  setModalState: PropTypes.func.isRequired
};

export default React.memo(RouterTransferForm);
