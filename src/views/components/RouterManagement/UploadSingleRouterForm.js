import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { useMutation } from '@apollo/client';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { Alert, Dialog, StatusIcon } from '../../../components';
import ErrorHandler from '../../../utils/errorHandler';
import { UPLOAD_SINGLE_ROUTER } from '../../../mutations/Routers/Routers';
import { GET_ROUTERS } from '../../../queries/Routers/GetRouters';
import GetAgenciesQuery from '../../../queries/Agencies/GetAgenciesQuery';
import { configs } from '../../../Configs';
import GetSignedInUserQuery from '../../../queries/Account/GetSignedInUser';
import { RouterTransferForm } from './index';
import CollapsibleAlerts from '../../../components/CollapsibleAlerts';

const ValidationSchema = Yup.object().shape({
  routerPrice: Yup.string()
    .required('Please enter router price')
    .matches(/^[0-9]+$/, 'Must be digits only!'),
  routerSerialNumber: Yup.string()
    .required('Please enter a router serial number')
    .matches(/^[0-9]+$/, 'Must be digits only!')
    .max(
      15,
      'Maximum of 15 Characters allowed, otherwise the Serial is invalid'
    )
    .min(
      15,
      'Minimum of 15 Characters allowed, otherwise the Serial is invalid'
    ),
  routerModel: Yup.string()
    .required('Please enter a valid model number')
    .max(20, 'Maximum of 20 Characters allowed, otherwise the Model is invalid')
    .min(3, 'Minimum of 3 Characters allowed, otherwise the Model is invalid')
});

const useStyles = makeStyles((theme) => ({
  root: {},
  textField: {
    marginTop: theme.spacing(2)
  },
  dialogContent: {
    textAlign: 'center'
  },
  tipText: {
    margin: theme.spacing(3)
  },
  transferButton: {
    color: theme.palette.white.main,
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.light
    }
  },
  infoText: {
    marginTop: theme.spacing(2)
  }
}));

const fullRouterMgr = configs.fullRouterMgr.split('|');

const UploadSingleRouterForm = ({ className, store, setLoader, ...rest }) => {
  const classes = useStyles();

  const [UploadRoutersMutation, { loading }] =
    useMutation(UPLOAD_SINGLE_ROUTER);

  const [uploadRouterDetails, setUploadRouterDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });

  const [modalState, setModalstate] = React.useState(false);

  const closeDialog = () => {
    setUploadRouterDetails({ open: false, status: false, message: '' });
  };

  const { open, status, message } = uploadRouterDetails;

  return (
    <Formik
      initialValues={{
        agencyId: -1,
        routerPrice: configs.routerPrice
      }}
      validationSchema={ValidationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setLoader(true);
        UploadRoutersMutation({
          variables: {
            input: {
              routerSerialNumber: values.routerSerialNumber,
              routerModel: values.routerModel,
              agencyId: Number(values.agencyId) || -1,
              routerPrice: values.routerPrice
            }
          },
          refetchQueries: [
            {
              query: GET_ROUTERS,
              variables: { roundTime: 20, awaitRefetchQueries: true }
            }
          ]
        })
          .then((response) => {
            const {
              data: {
                uploadSingleRouter: {
                  status: uploadStatus,
                  message: uploadMessage
                }
              }
            } = response;
            setSubmitting(false);
            setLoader(false);
            if (uploadStatus) {
              setUploadRouterDetails({
                open: true,
                status: uploadStatus,
                message: uploadMessage
              });
            } else {
              setUploadRouterDetails({
                open: true,
                status: uploadStatus,
                message: uploadMessage
              });
            }
          })
          .catch((res) => {
            setSubmitting(false);
            setLoader(false);
            setUploadRouterDetails({
              open: true,
              status: false,
              message: ErrorHandler(res.message || res.graphQLErrors[0].message)
            });
          });
      }}>
      {({ errors, handleSubmit, isSubmitting, setFieldValue, values }) => (
        <form
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}>
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
          <RouterTransferForm
            modalState={modalState}
            setModalState={setModalstate}
          />
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Upload Single Router" />
                  <Divider />
                  <CardContent>
                    <Box mb={3} mt={2}>
                      <Typography variant="body2">
                        Use below form to upload routers. Routers may not be
                        uploaded if they already exist within the system with a
                        different shop or agency. Use router transfer for such
                        cases.
                      </Typography>
                      <Grid item lg={12} xs={12}>
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
                                          label="Filter by agency"
                                          name="agencyId"
                                          error={!!errors.agencyId}
                                          helperText={errors.agencyId || null}
                                          onChange={(e) => {
                                            setFieldValue(
                                              'agencyId',
                                              e.target.value,
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
                                          {getAgencies.agencies.map(
                                            (agency) => (
                                              <option
                                                key={agency.agencyId}
                                                value={agency.agencyId}>
                                                {agency.agencyName}
                                              </option>
                                            )
                                          )}
                                        </TextField>
                                      ) : (
                                        <Alert severity="warning">
                                          An error was encountered trying to
                                          load the list of agencies regions
                                        </Alert>
                                      )}
                                    </>
                                  )}
                                </GetAgenciesQuery>
                              )}
                            </>
                          )}
                        </GetSignedInUserQuery>
                      </Grid>
                    </Box>
                    <Box mb={3} mt={2}>
                      <Grid item lg={12} xs={12}>
                        <TextField
                          className={classes.textField}
                          error={!!errors.routerSerialNumber}
                          fullWidth
                          readOnly
                          required
                          helperText={errors.routerSerialNumber || null}
                          label="Router Serial Number"
                          name="routerSerialNumber"
                          onChange={(e) => {
                            setFieldValue(
                              'routerSerialNumber',
                              e.target.value,
                              true
                            );
                          }}
                          type="text"
                          value={values.routerSerialNumber}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item lg={12} xs={12}>
                        <TextField
                          className={classes.textField}
                          error={!!errors.routerModel}
                          fullWidth
                          readOnly
                          required
                          helperText={errors.routerModel || null}
                          label="Router Model"
                          name="routerModel"
                          onChange={(e) => {
                            setFieldValue('routerModel', e.target.value, true);
                          }}
                          type="text"
                          value={values.routerModel}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item lg={12} xs={12}>
                        <TextField
                          className={classes.textField}
                          error={!!errors.routerPrice}
                          fullWidth
                          readOnly
                          helperText={errors.routerPrice || null}
                          label="Router Price"
                          name="routerPrice"
                          type="text"
                          value={values.routerPrice}
                          variant="outlined"
                        />
                      </Grid>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Grid container spacing={3}>
                      <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                        <Button
                          color="primary"
                          fullWidth
                          variant="contained"
                          type="submit"
                          disabled={isSubmitting}>
                          {loading ? 'Please wait...' : 'Upload Router'}
                        </Button>
                      </Grid>
                      <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                        <Button
                          variant="contained"
                          color="default"
                          className={classes.transferButton}
                          fullWidth
                          onClick={() =>
                            setModalstate({
                              open: true
                            })
                          }>
                          <MoveToInboxIcon />
                          Transfer 4G router to a different shop/agency?
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>

                <Divider />
                <Typography
                  variant="body2"
                  gutterBottom
                  className={classes.tipText}>
                  <InfoIcon />
                  {'  '}
                  Failed to upload? Borrowed routers? Try router transfer to
                  re-map the router to your shop or agency.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <CollapsibleAlerts
                alertMessage="Maintain a lean number of routers on the system. This way, router transfers will be minimal. Upload as you sell."
                className={classes.infoText}
              />
              <CollapsibleAlerts
                alertMessage="Refresh the 'Register Customer' page to see uploaded routers that fail to show immediately after upload"
                className={classes.infoText}
              />
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

UploadSingleRouterForm.propTypes = {
  className: PropTypes.string
};

export default UploadSingleRouterForm;
