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
import Autocomplete from '@material-ui/lab/Autocomplete';
import CardHeader from '@material-ui/core/CardHeader';
import { random } from 'underscore';
import GetRoutersQuery from '../../../queries/Routers/GetRouters';
import { Alert, Dialog, StatusIcon } from '../../../components';
import { GET_MY_CUSTOMERS } from '../../../queries/Customers/GetCustomersQuery';
import { UPDATE_SIMEX_ROUTER_SN } from '../../../mutations/Routers/Routers';
import ErrorHandler from '../../../utils/errorHandler';

const UpdateSimexAndSerialSchema = Yup.object().shape({
  routerSerialNumber: Yup.string().required(
    'Please select a router from the collection'
  ),
  simexSerialNumber: Yup.string()
    .max(20, 'Maximum of 20 Characters allowed, otherwise the SIMEX is invalid')
    .min(20, 'Minimum of 20 Characters allowed, otherwise the SIMEX is invalid')
    .required('Please enter a preferred router phone number')
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

const UploadSimexForm = (props) => {
  const { className, customerDetails } = props;
  const { registrationId } = customerDetails;
  const classes = useStyles();

  const buttonDisabledStatus = (errors, values, loading) => {
    let status = true;
    if (
      isEmpty(errors) &&
      values.routerSerialNumber &&
      values.simexSerialNumber &&
      loading === false
    ) {
      status = false;
    }
    return status;
  };
  const [uploadSimexDetails, setUploadSimexDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const [roundValue, setRoundValue] = React.useState(23);

  const { open, status, message } = uploadSimexDetails;
  const closeDialog = () => {
    setUploadSimexDetails({ open: false, status: false, message: '' });
  };

  const [UpdateSimexMutation, { loading }] = useMutation(
    UPDATE_SIMEX_ROUTER_SN
  );

  return (
    <Card className={clsx(classes.root, className)}>
      <CardHeader
        subheader="Update the router and sim serial number below to start the activation process"
        title="Upload Simex and Router Serial Numbers"
      />
      <Divider />
      <CardContent>
        <div className={classes.details}>
          <div>
            <Formik
              initialValues={{
                registrationId: '',
                routerSerialNumber: '',
                simexSerialNumber: ''
              }}
              validationSchema={UpdateSimexAndSerialSchema}
              onSubmit={(values) => {
                UpdateSimexMutation({
                  variables: {
                    input: {
                      registrationId: Number(registrationId),
                      routerSerialNumber: values.routerSerialNumber,
                      simexSerialNumber: values.simexSerialNumber
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
                        updateSimex: {
                          status: uploadSimexStatus,
                          message: uploadSimexMessage
                        }
                      }
                    } = response;
                    if (uploadSimexStatus) {
                      setRoundValue(random(0, 255));
                      setUploadSimexDetails({
                        open: true,
                        status: true,
                        message: uploadSimexMessage
                      });
                    } else {
                      // login error
                      setUploadSimexDetails({
                        open: true,
                        status: false,
                        message: uploadSimexMessage
                      });
                    }
                  })
                  .catch((res) => {
                    setUploadSimexDetails({
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
                      <GetRoutersQuery variables={{ roundTime: roundValue }}>
                        {({ getRouters }) => (
                          <>
                            {getRouters.routers.length > 0 ? (
                              <Autocomplete
                                freeSolo
                                id="free-solo-demo"
                                onChange={(event, selectedValue) =>
                                  setFieldValue(
                                    'routerSerialNumber',
                                    selectedValue,
                                    true
                                  )
                                }
                                options={getRouters.routers.map(
                                  (routers) => routers.routerSerialNumber
                                )}
                                openOnFocus
                                noOptionsText="No router serial number to match your search"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Search/Enter router serial number"
                                    required
                                    name="routerSerialNumber"
                                    helperText={
                                      errors.routerSerialNumber || null
                                    }
                                    variant="outlined"
                                    value={values.routerSerialNumber}
                                  />
                                )}
                              />
                            ) : (
                              <Alert severity="warning">
                                You do not have any routers. Please load some
                                more via your admin
                              </Alert>
                            )}
                          </>
                        )}
                      </GetRoutersQuery>
                    </Grid>
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.simexSerialNumber}
                        fullWidth
                        required
                        helperText={errors.simexSerialNumber || null}
                        label="SIM Serial Number (Simex)"
                        name="simexSerialNumber"
                        onChange={(e) => {
                          setFieldValue(
                            'simexSerialNumber',
                            e.target.value,
                            true
                          );
                        }}
                        type="text"
                        value={values.simexSerialNumber}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <Button
                        className={classes.signInButton}
                        color="primary"
                        disabled={buttonDisabledStatus(errors, values, loading)}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained">
                        {loading ? 'Please wait...' : 'Update Info'}
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

UploadSimexForm.propTypes = {
  className: PropTypes.string
};

export default React.memo(UploadSimexForm);
