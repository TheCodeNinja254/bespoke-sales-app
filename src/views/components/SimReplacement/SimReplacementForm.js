import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Form as FormikForm, Formik } from 'formik';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import isEmpty from 'lodash.isempty';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import { Dialog, StatusIcon } from '../../../components';
import { GET_MY_CUSTOMERS } from '../../../queries/Customers/GetCustomersQuery';
import { SIM_REPLACEMENT } from '../../../mutations/Routers/Routers';
import ErrorHandler from '../../../utils/errorHandler';
import { encrypt } from '../../../utils/encryptDecrypt';

const SimReplacementSchema = Yup.object().shape({
  iccid: Yup.string()
    .max(20, 'Maximum of 20 Characters allowed, otherwise the SIMEX is invalid')
    .min(20, 'Minimum of 20 Characters allowed, otherwise the SIMEX is invalid')
    .required('Please enter a SIMEX Serial')
    .matches(/^[0-9]+$/, 'Must be digits only')
});

const useStyles = makeStyles((theme) => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 75,
    width: 75,
    flexShrink: 0,
    flexGrow: 0,
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const SimReplacementForm = (props) => {
  const { className, customerDetails } = props;
  const { beneficiaryMsisdn } = customerDetails;
  const classes = useStyles();

  const buttonDisabledStatus = (errors, values, loading) => {
    let status = true;
    if (
      isEmpty(errors) &&
      values.iccid &&
      beneficiaryMsisdn &&
      loading === false
    ) {
      status = false;
    }
    return status;
  };
  const [simSwapDetails, setSimSwapDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });

  const { open, status, message } = simSwapDetails;
  const closeDialog = () => {
    setSimSwapDetails({ open: false, status: false, message: '' });
  };

  const [SimSwapMutation, { loading }] = useMutation(SIM_REPLACEMENT);

  return (
    <Card className={clsx(classes.root, className)}>
      <CardHeader
        subheader="Provide a new Simex Serial below to replace the customer's 4G SIM"
        title="Replace SIM Card"
      />
      <Divider />
      <CardContent>
        <div className={classes.details}>
          <div>
            <Formik
              initialValues={{
                iccid: ''
              }}
              validationSchema={SimReplacementSchema}
              onSubmit={(values) => {
                SimSwapMutation({
                  variables: {
                    input: {
                      msisdn: encrypt(beneficiaryMsisdn),
                      iccid: encrypt(values.iccid)
                    }
                  },
                  refetchQueries: [
                    {
                      query: GET_MY_CUSTOMERS,
                      variables: {
                        pageSize: 100,
                        page: 1,
                        userName: '',
                        awaitRefetchQueries: true,
                        fetchPolicy: 'network-only'
                      }
                    }
                  ]
                })
                  .then((response) => {
                    const {
                      data: {
                        simReplacement: {
                          status: simReplacementStatus,
                          message: simReplacementMessage
                        }
                      }
                    } = response;
                    if (simReplacementStatus) {
                      setSimSwapDetails({
                        open: true,
                        status: true,
                        message: simReplacementMessage
                      });
                    } else {
                      // login error
                      setSimSwapDetails({
                        open: true,
                        status: false,
                        message: simReplacementMessage
                      });
                    }
                  })
                  .catch((res) => {
                    setSimSwapDetails({
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
                  <Grid container spacing={4}>
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <TextField
                        error={!!errors.iccid}
                        fullWidth
                        required
                        helperText={errors.iccid || null}
                        label="SIM Serial Number (Simex)"
                        name="iccid"
                        onChange={(e) => {
                          setFieldValue('iccid', e.target.value, true);
                        }}
                        type="text"
                        value={values.iccid}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <Button
                        color="primary"
                        disabled={buttonDisabledStatus(errors, values, loading)}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained">
                        {loading ? 'Please wait...' : 'Replace SIM'}
                      </Button>
                    </Grid>
                  </Grid>
                </FormikForm>
              )}
            </Formik>
          </div>
        </div>
      </CardContent>
      <Divider />
    </Card>
  );
};

SimReplacementForm.propTypes = {
  className: PropTypes.string,
  customerDetails: PropTypes.object.isRequired
};

export default React.memo(SimReplacementForm);
