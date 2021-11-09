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
  Typography
} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useMutation } from '@apollo/client';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import { UPLOAD_ROUTERS } from '../../../../mutations/Routers/Routers';
import ErrorHandler from '../../../../utils/errorHandler';
import { Dialog, FilesDropzone, StatusIcon } from '../../../../components';
import { GET_ROUTERS } from '../../../../queries/Routers/GetRouters';
import { configs } from '../../../../Configs';

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

  const [UploadRoutersMutation, { loading }] = useMutation(UPLOAD_ROUTERS);
  const [uploadRouterDetails, setUploadRouterDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });

  const closeDialog = () => {
    setUploadRouterDetails({ open: false, status: false, message: '' });
  };

  const { open, status, message } = uploadRouterDetails;

  return (
    <Formik
      initialValues={{
        fileDetails: [],
        agencyId: '',
        routerPrice: configs.routerPrice
      }}
      validationSchema={Yup.object().shape({
        fileDetails: Yup.array()
          .min(1, 'Please select one document')
          .max(1, 'You are only allowed to select one document')
          .required('Please select a document'),
        routerPrice: Yup.string()
          .required('Please select an agency')
          .matches(/^[0-9]+$/, 'Must be digits only!')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setLoader(true);
        // eslint-disable-next-line no-console
        UploadRoutersMutation({
          variables: {
            input: {
              routersFile: values.fileDetails,
              agencyId: 0,
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
                uploadRouters: { status: uploadStatus, message: uploadMessage }
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
              <Box mt={3}>
                <Card>
                  <CardHeader title="Routers CSV file" />
                  <Divider />
                  <CardContent>
                    <Box mb={3} mt={2}>
                      {/* <Typography variant={"body1"}>Select an Agency</Typography> */}
                      <Grid item lg={12} xs={12}>
                        <TextField
                          className={classes.textField}
                          error={!!errors.routerPrice}
                          fullWidth
                          readOnly
                          helperText={errors.routerPrice || null}
                          label="Router Price"
                          name="routerPrice"
                          // onChange={(e) => {
                          //   setFieldValue('routerPrice', e.target.value, true);
                          // }}
                          type="text"
                          value={values.routerPrice}
                          variant="outlined"
                        />
                      </Grid>
                    </Box>
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
                        <ListItemText primary="routerSerialNumber" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ArrowForwardIosIcon />
                        </ListItemIcon>
                        <ListItemText primary="routerModel" />
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
                  <CardActions>
                    <Button
                      color="primary"
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}>
                      {loading ? 'Please wait...' : 'Upload Routers'}
                    </Button>
                  </CardActions>
                </Card>
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
