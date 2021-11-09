/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */
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
  FormHelperText,
  Grid,
  makeStyles,
  TextField,
  Typography
} from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { Alert, Dialog, StatusIcon } from '../../../../components';
import ErrorHandler from '../../../../utils/errorHandler';
import GetRegionsQuery from '../../../../queries/Locations/GetRegionsQuery';
import GetZonesQuery from '../../../../queries/Locations/GetZones';
import { ADD_ESTATE } from '../../../../mutations/Locations';
import { GET_ESTATES } from '../../../../queries/Locations/GetEstates';

const useStyles = makeStyles((theme) => ({
  root: {},
  textField: {
    marginTop: theme.spacing(2)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const UploadSingleEstateForm = ({ className, store, setLoader, ...rest }) => {
  const classes = useStyles();

  const [CreateReleaseMutation, { loading }] = useMutation(ADD_ESTATE);
  const [addEstateDetails, setAddEstateDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const defaultRegionId = { value: '8', retrieveBy: 'region' };
  const [{ value, retrieveBy }, setValue] = React.useState(defaultRegionId);

  const closeDialog = () => {
    setAddEstateDetails({ open: false, status: false, message: '' });
  };

  const { open, status, message } = addEstateDetails;

  return (
    <Formik
      initialValues={{
        estateName: '',
        regionId: '',
        status: '',
        contractorAgencyId: '3',
        oltName: '',
        noOfHouses: '',
        occupancy: '',
        latitude: '0',
        longitude: '34',
        houseNumbers: '',
        zoneId: '',
        tierNumber: '0'
      }}
      validationSchema={Yup.object().shape({
        estateName: Yup.string().max(255).required('Please enter estate name'),
        regionId: Yup.string().max(255).required('Please select a region'),
        noOfHouses: Yup.number()
          .max(5000)
          .min(0)
          .required('Please enter number of homes'),
        occupancy: Yup.number()
          .max(5000)
          .min(0)
          .required('Please enter number of homes occupied'),
        latitude: Yup.number().min(-4.7109547).max(5.2551303),
        longitude: Yup.number().max(38.8969273).min(33.6908543),
        zoneId: Yup.string().max(255).required('Please select a zone'),
        status: Yup.string().max(255).required('Please select status')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setLoader(true);
        // eslint-disable-next-line no-console
        CreateReleaseMutation({
          variables: {
            input: {
              estateName: values.estateName,
              regionId: values.regionId,
              status: values.status,
              contractorAgencyId: '3',
              oltName: '0',
              noOfHouses: values.noOfHouses,
              occupancy: values.occupancy,
              coordinates: `${values.latitude}, ${values.longitude}`,
              houseNumbers: '0',
              zoneId: values.zoneId,
              tierNumber: '0'
            }
          },
          refetchQueries: [
            {
              query: GET_ESTATES,
              variables: {
                perPage: 20,
                page: 1,
                userName: '',
                awaitRefetchQueries: true
              }
            }
          ]
        })
          .then((response) => {
            const {
              data: {
                addEstate: {
                  status: addEstateStatus,
                  message: addEstateMessage
                }
              }
            } = response;
            setSubmitting(false);
            setLoader(false);
            if (addEstateStatus) {
              setAddEstateDetails({
                open: true,
                status: addEstateStatus,
                message: addEstateMessage
              });
            } else {
              setAddEstateDetails({
                open: true,
                status: addEstateStatus,
                message: addEstateMessage
              });
            }
          })
          .catch((res) => {
            setSubmitting(false);
            setLoader(false);
            setAddEstateDetails({
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
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardHeader title="Select Region and Zone" />
                <Divider />
                <CardContent>
                  <Grid item lg={12} xs={12} className={classes.textField}>
                    <GetRegionsQuery>
                      {({ getRegions }) => (
                        <>
                          {getRegions.getRegionsStatus ? (
                            <TextField
                              fullWidth
                              label="Select Region"
                              name="regionId"
                              helperText={errors.regionId || null}
                              onChange={(e) => {
                                setValue({
                                  value: e.target.value,
                                  retrieveBy: 'region'
                                });
                                setFieldValue('regionId', e.target.value, true);
                              }}
                              select
                              // eslint-disable-next-line react/jsx-sort-props
                              SelectProps={{ native: true }}
                              value={values.regionId}
                              variant="outlined">
                              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                              <option value="" />
                              {getRegions.regions.map((regions) => (
                                <option
                                  key={regions.regionId}
                                  value={regions.regionId}>
                                  {regions.regionName}
                                </option>
                              ))}
                            </TextField>
                          ) : (
                            <Alert severity="warning">
                              An error was encountered trying to load the list
                              of available regions
                            </Alert>
                          )}
                        </>
                      )}
                    </GetRegionsQuery>
                  </Grid>
                  <Grid item lg={12} xs={12} className={classes.textField}>
                    <GetZonesQuery variables={{ regionId: value, retrieveBy }}>
                      {({ getZones }) => (
                        <>
                          {getZones.getZonesStatus ? (
                            <TextField
                              fullWidth
                              label="Select Zone"
                              name="zoneId"
                              helperText={errors.zoneId || null}
                              onChange={(e) => {
                                setFieldValue('zoneId', e.target.value, true);
                              }}
                              select
                              // eslint-disable-next-line react/jsx-sort-props
                              SelectProps={{ native: true }}
                              value={values.zoneId}
                              variant="outlined">
                              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                              <option value="" />
                              {getZones.zones.map((zones) => (
                                <option key={zones.id} value={zones.id}>
                                  {zones.zoneName}
                                </option>
                              ))}
                            </TextField>
                          ) : (
                            <Alert severity="warning">
                              The selected region does not have zones mapped to
                              it.
                            </Alert>
                          )}
                        </>
                      )}
                    </GetZonesQuery>
                  </Grid>
                </CardContent>
              </Card>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Estates Metadata" />
                  <Divider />
                  <CardContent>
                    <Grid item lg={12} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.estateName}
                        fullWidth
                        required
                        helperText={errors.estateName || null}
                        label="Estate Name"
                        name="estateName"
                        onChange={(e) => {
                          setFieldValue('estateName', e.target.value, true);
                        }}
                        type="text"
                        value={values.estateName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item lg={12} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.noOfHouses}
                        fullWidth
                        required
                        helperText={errors.noOfHouses || null}
                        label="Number of Houses"
                        name="noOfHouses"
                        onChange={(e) => {
                          setFieldValue('noOfHouses', e.target.value, true);
                        }}
                        type="number"
                        value={values.noOfHouses}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item lg={12} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.occupancy}
                        fullWidth
                        required
                        helperText={errors.occupancy || null}
                        label="Occupancy"
                        name="occupancy"
                        onChange={(e) => {
                          setFieldValue('occupancy', e.target.value, true);
                        }}
                        type="number"
                        value={values.occupancy}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item lg={12} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.latitude}
                        fullWidth
                        helperText={errors.latitude || null}
                        label="Latitude"
                        name="latitude"
                        onChange={(e) => {
                          setFieldValue('latitude', e.target.value, true);
                        }}
                        type="number"
                        value={values.latitude}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item lg={12} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.longitude}
                        fullWidth
                        helperText={errors.longitude || null}
                        label="Longitude"
                        name="longitude"
                        onChange={(e) => {
                          setFieldValue('longitude', e.target.value, true);
                        }}
                        type="number"
                        value={values.longitude}
                        variant="outlined"
                      />
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box mt={2}>
                <TextField
                  className={classes.textField}
                  fullWidth
                  label="Select Status"
                  name="status"
                  error={!!errors.status}
                  helperText={errors.status || null}
                  onChange={(e) => {
                    setFieldValue('status', e.target.value, true);
                  }}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.status}
                  variant="outlined">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </TextField>
              </Box>
              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}
              <Box mt={2}>
                <Button
                  color="primary"
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}>
                  {loading ? 'Please wait...' : 'Upload Estate'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

UploadSingleEstateForm.propTypes = {
  className: PropTypes.string
};

export default UploadSingleEstateForm;
