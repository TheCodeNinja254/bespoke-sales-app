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
  Typography,
  TextField
} from '@material-ui/core';
import { useMutation } from '@apollo/client';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Alert,
  Dialog,
  FilesDropzone,
  StatusIcon
} from '../../../../components';
import ErrorHandler from '../../../../utils/errorHandler';
import GetRegionsQuery from '../../../../queries/Locations/GetRegionsQuery';
import GetZonesQuery from '../../../../queries/Locations/GetZones';
import { UPLOAD_ESTATES } from '../../../../mutations/Locations';

const useStyles = makeStyles((theme) => ({
  root: {},
  textField: {
    marginTop: theme.spacing(2)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

const UploadMultipleEstatesForm = ({
  className,
  store,
  setLoader,
  ...rest
}) => {
  const classes = useStyles();

  const [UploadEstatesMutation, { loading }] = useMutation(UPLOAD_ESTATES);
  const [uploadEstatesDetails, setUploadEstatesDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const defaultRegionId = { value: '8', retrieveBy: 'region' };
  const [{ value, retrieveBy }, setValue] = React.useState(defaultRegionId);

  const closeDialog = () => {
    setUploadEstatesDetails({ open: false, status: false, message: '' });
  };

  const { open, status, message } = uploadEstatesDetails;

  return (
    <Formik
      initialValues={{
        status: 'active',
        fileDetails: [],
        regionId: '',
        zoneId: ''
      }}
      validationSchema={Yup.object().shape({
        fileDetails: Yup.array()
          .min(1, 'Please select one document')
          .max(1, 'You are only allowed to select one document')
          .required('Please select a document'),
        status: Yup.string().required('Please select status'),
        regionId: Yup.string().required('Please select a region'),
        zoneId: Yup.string().required('Please select a zone')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setLoader(true);
        // eslint-disable-next-line no-console
        UploadEstatesMutation({
          variables: {
            input: {
              estatesFile: values.fileDetails,
              status: values.status,
              regionId: values.regionId,
              zoneId: values.zoneId
            }
          }
        })
          .then((response) => {
            const {
              data: {
                uploadEstates: { status: uploadStatus, message: uploadMessage }
              }
            } = response;
            setSubmitting(false);
            setLoader(false);
            if (uploadStatus) {
              // actions.resetForm();
              setUploadEstatesDetails({
                open: true,
                status: uploadStatus,
                message: uploadMessage
              });
            } else {
              setUploadEstatesDetails({
                open: true,
                status: uploadStatus,
                message: uploadMessage
              });
            }
          })
          .catch((res) => {
            setSubmitting(false);
            setLoader(false);
            setUploadEstatesDetails({
              open: true,
              status: false,
              message: ErrorHandler(res.message || res.graphQLErrors[0].message)
            });
          });
      }}>
      {({
        errors,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
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
                  <CardHeader title="Estates CSV file" />
                  <Divider />
                  <CardContent>
                    <Typography variant="body1">CSV Contents</Typography>
                    <Typography variant="body2">
                      Please include below named fields only. Note the fields
                      naming and casing
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <ArrowForwardIosIcon />
                        </ListItemIcon>
                        <ListItemText primary="estateName" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ArrowForwardIosIcon />
                        </ListItemIcon>
                        <ListItemText primary="noOfHouses" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ArrowForwardIosIcon />
                        </ListItemIcon>
                        <ListItemText primary="occupancy" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ArrowForwardIosIcon />
                        </ListItemIcon>
                        <ListItemText primary="coordinates" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ArrowForwardIosIcon />
                        </ListItemIcon>
                        <ListItemText primary="tierNumber" />
                      </ListItem>
                    </List>
                    <FilesDropzone
                      acceptedFileTypes=".csv"
                      setFieldValue={setFieldValue}
                    />
                    {touched.fileDetails && errors.fileDetails && (
                      <Box mt={2}>
                        <FormHelperText error>
                          {errors.fileDetails}
                        </FormHelperText>
                      </Box>
                    )}
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
                  <option value="0">Active</option>
                  <option value="1">Inactive</option>
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
                  {loading ? 'Please wait...' : 'Upload Estates'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

UploadMultipleEstatesForm.propTypes = {
  className: PropTypes.string
};

export default UploadMultipleEstatesForm;
