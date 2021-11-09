import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import isEmpty from 'lodash.isempty';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { Divider } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { random } from 'underscore';
import trimNonNumbers from '../../../utils/trimNonNumbers';
import { Alert, Dialog, StatusIcon } from '../../../components';
import ErrorHandler from '../../../utils/errorHandler';
import { encrypt } from '../../../utils/encryptDecrypt';
import { configs } from '../../../Configs';
import GetRegionsQuery from '../../../queries/Locations/GetRegionsQuery';
import GetZonesQuery from '../../../queries/Locations/GetZones';
import GetEstatesQuery from '../../../queries/Locations/GetEstates';
import GetRoutersQuery, {
  GET_ROUTERS
} from '../../../queries/Routers/GetRouters';
import { CREATE_CUSTOMER } from '../../../mutations/Customers/Customers';
import { GET_MY_CUSTOMERS } from '../../../queries/Customers/GetCustomersQuery';
import GetSignedInUserQuery from '../../../queries/Account/GetSignedInUser';

const RegisterCustomerSchema = Yup.object().shape({
  firstName: Yup.string().required("Please enter customer's first name"),
  lastName: Yup.string().nullable(),
  // .required('Please enter customer\'s last name'),
  middleName: Yup.string().nullable(),
  // .required('Please enter customer\'s middle name'),
  emailAddress: Yup.string()
    .required("Please enter customer's email address")
    .email('Please enter a valid email address'),
  sponsorMsisdn: Yup.string()
    .min(9)
    .max(12)
    .required('Please enter the customer mobile number'),
  documentNumber: Yup.string().required('please enter a valid document number'),
  docTypeId: Yup.string().required('Please select a document type'),
  houseNumber: Yup.string().required(
    "Please enter the customer's house number"
  ),
  productId: Yup.string().required('Please select a service plan'),
  estateId: Yup.string().required('Please select an estate'),
  dateOfBirth: Yup.date().required(
    "Please enter the customer's date of birth (format: dd/mm/yyyy"
  ),
  routerSerialNumber: Yup.string().required(
    'Please select a router serial number'
  ),
  simexCheckConfirmation: Yup.string().required('Confirmation is required.'),
  simexSerialNumber: Yup.string()
    .max(20, 'Maximum of 20 Characters allowed, otherwise the SIMEX is invalid')
    .min(20, 'Minimum of 20 Characters allowed, otherwise the SIMEX is invalid')
    .required('Please enter DSA Simex Serial Number')
    .matches(/^[0-9]+$/, 'Must be digits only')
});

const useStyles = makeStyles((theme) => ({
  textField: {
    marginTop: theme.spacing(2)
  },
  cardHeaderTitle: {
    color: '#43b02a'
  },
  cardDivider: {
    color: theme.palette.primary.main
  },
  locationAvatar: {
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main
  },
  customerInfoAvatar: {
    color: theme.palette.white,
    backgroundColor: '#c62828'
  },
  productInfoAvatar: {
    color: theme.palette.white,
    backgroundColor: '#7b1fa2'
  },
  addCustomerButton: {
    margin: theme.spacing(2, 0)
  },
  checkedButton: {
    color: '#43b02a',
    '&$checked': {
      color: '#43b02a'
    }
  },
  dialogContent: {
    textAlign: 'center'
  }
}));

// Roles allowed to do full registration
const fullRegRoles = configs.fullRegistrationAllowedRoles.split('|');

const RegisterCustomerForm = () => {
  const classes = useStyles();

  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (
      isEmpty(errors) &&
      values.firstName !== '' &&
      values.sponsorMsisdn !== '' &&
      values.documentNumber !== '' &&
      values.docTypeId !== '' &&
      values.emailAddress !== '' &&
      values.houseNumber !== '' &&
      values.productId !== '' &&
      values.estateId !== '' &&
      values.simexSerialNumber !== '' &&
      values.routerSerialNumber !== '' &&
      values.dateOfBirth !== null &&
      values.simexCheckConfirmation !== '' &&
      loading === false
    ) {
      buttonStatus = false;
    }
    return buttonStatus;
  };
  const defaultRegionId = {
    value: configs.defaultRegion,
    retrieveBy: 'region'
  };
  const [{ value, retrieveBy }, setValue] = React.useState(defaultRegionId);
  const defaultZoneId = {
    zoneValue: configs.defaultZone,
    retrieveByZone: 'zone'
  };
  const [{ zoneValue, retrieveByZone }, setZoneValue] =
    React.useState(defaultZoneId);
  const [addUserDetails, setAddUserDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const [CreateCustomerMutation, { loading }] = useMutation(CREATE_CUSTOMER);

  const { open, status, message } = addUserDetails;
  const closeDialog = () => {
    setAddUserDetails({ open: false, status: false, message: '' });
  };

  return (
    <Formik
      initialValues={{
        firstName: '',
        middleName: '',
        lastName: '',
        sponsorMsisdn: '',
        docTypeId: '',
        documentNumber: '',
        emailAddress: '',
        estate: '',
        zone: '',
        houseNumber: '',
        productId: '',
        estateId: '',
        dateOfBirth: null,
        routerSerialNumber: '',
        simexSerialNumber: ''
      }}
      validationSchema={RegisterCustomerSchema}
      onSubmit={(values, actions) => {
        CreateCustomerMutation({
          variables: {
            input: {
              firstName: values.firstName,
              middleName: values.middleName,
              lastName: values.lastName,
              sponsorMsisdn: encrypt(values.sponsorMsisdn),
              documentNumber: encrypt(values.documentNumber),
              docTypeId: Number(values.docTypeId),
              emailAddress: values.emailAddress,
              benMsisdnSerialNumber: values.simexSerialNumber,
              houseNumber: values.houseNumber,
              productId: values.productId,
              estateId: Number(values.estateId),
              routerSerial: values.routerSerialNumber,
              dateOfBirth: values.dateOfBirth
            }
          },
          refetchQueries: [
            {
              query: GET_MY_CUSTOMERS,
              variables: {
                pageSize: 20,
                page: 0,
                userName: '',
                awaitRefetchQueries: true
              }
            },
            {
              query: GET_ROUTERS,
              variables: {
                roundTime: random(12123, 9300233),
                awaitRefetchQueries: true
              }
            }
          ]
        })
          .then((response) => {
            const {
              data: {
                createCustomer: {
                  status: customerStatus,
                  message: customerMessage
                }
              }
            } = response;
            if (customerStatus) {
              actions.resetForm();
              // registration success message
              setAddUserDetails({
                open: true,
                status: customerStatus,
                message: customerMessage
              });
              // history.push('/sales/customers');
            } else {
              // registration error
              setAddUserDetails({
                open: true,
                status: customerStatus,
                message: customerMessage
              });
            }
          })
          .catch((res) => {
            // error
            setAddUserDetails({
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
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <Card spacing={3}>
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="location"
                      className={classes.locationAvatar}>
                      L
                    </Avatar>
                  }
                  title={
                    <Typography className={classes.cardHeaderTitle}>
                      <b>Customer Location Details</b>
                    </Typography>
                  }
                  subheader="Select Region, Zone and Estate from the provided lists"
                />
                <Divider className={classes.cardDivider} />
                <CardContent>
                  <Grid container spacing={3}>
                    {/* region */}
                    <Grid item lg={6} xs={12} className={classes.textField}>
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
                                  setFieldValue(
                                    'regionId',
                                    e.target.value,
                                    true
                                  );
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
                    {/* zone */}
                    <Grid item lg={6} xs={12} className={classes.textField}>
                      <GetZonesQuery
                        variables={{ regionId: value, retrieveBy }}>
                        {({ getZones }) => (
                          <>
                            {getZones.getZonesStatus ? (
                              <TextField
                                fullWidth
                                label="Select Zone"
                                name="zone"
                                helperText={errors.zone || null}
                                onChange={(e) => {
                                  setZoneValue({
                                    zoneValue: Number(e.target.value),
                                    retrieveByZone: 'zone'
                                  });
                                  setFieldValue('zone', e.target.value, true);
                                }}
                                select
                                // eslint-disable-next-line react/jsx-sort-props
                                SelectProps={{ native: true }}
                                value={values.zone}
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
                                The selected region does not have zones mapped
                                to it.
                              </Alert>
                            )}
                          </>
                        )}
                      </GetZonesQuery>
                    </Grid>
                    {/* estate */}
                    <Grid item lg={6} xs={12} className={classes.textField}>
                      <GetEstatesQuery
                        variables={{
                          zoneId: zoneValue,
                          retrieveByZone,
                          pageSize: 10000,
                          pageNo: 1
                        }}>
                        {({ getEstates }) => (
                          <>
                            {getEstates.getEstatesStatus > 0 ? (
                              <TextField
                                fullWidth
                                label="Select Estate"
                                name="estateId"
                                error={!!errors.estateId}
                                helperText={errors.estateId || null}
                                onChange={(e) => {
                                  setFieldValue(
                                    'estateId',
                                    e.target.value,
                                    true
                                  );
                                }}
                                required
                                select
                                // eslint-disable-next-line react/jsx-sort-props
                                SelectProps={{ native: true }}
                                value={values.estateId}
                                variant="outlined">
                                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                                <option value="" />
                                {getEstates.estates.map((estates) => (
                                  <option
                                    key={estates.estateId}
                                    value={estates.estateId}>
                                    {estates.estateName}
                                  </option>
                                ))}
                              </TextField>
                            ) : (
                              <Alert severity="warning">
                                The selected zone does not have estates mapped
                                to it.
                              </Alert>
                            )}
                          </>
                        )}
                      </GetEstatesQuery>
                    </Grid>
                    {/* house number */}
                    <Grid item lg={6} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.houseNumber}
                        fullWidth
                        required
                        helperText={errors.houseNumber || null}
                        label="House Number"
                        name="houseNumber"
                        onChange={(e) => {
                          setFieldValue('houseNumber', e.target.value, true);
                        }}
                        type="text"
                        value={values.houseNumber}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <Card spacing={3}>
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="customerInfo"
                      className={classes.customerInfoAvatar}>
                      C
                    </Avatar>
                  }
                  title={
                    <Typography className={classes.cardHeaderTitle}>
                      <b>Customer Information</b>
                    </Typography>
                  }
                  subheader="Provide valid customer data"
                />
                <Divider className={classes.cardDivider} />
                <CardContent>
                  <Grid container spacing={3}>
                    {/* document type */}
                    <Grid item lg={6} xs={12}>
                      <TextField
                        className={classes.textField}
                        fullWidth
                        label="Select Document Type"
                        error={!!errors.docTypeId}
                        helperText={errors.docTypeId || null}
                        name="docTypeId"
                        onChange={(e) => {
                          setFieldValue('docTypeId', e.target.value, true);
                        }}
                        required
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        value={values.docTypeId}
                        variant="outlined">
                        {configs.documentTypes.map((document) => (
                          <option
                            key={document.documentType}
                            value={document.documentType}>
                            {document.documentName}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    {/* document id number */}
                    <Grid item lg={6} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.documentNumber}
                        fullWidth
                        required
                        helperText={errors.documentNumber || null}
                        label="Document Number"
                        name="documentNumber"
                        onChange={(e) => {
                          setFieldValue('documentNumber', e.target.value, true);
                        }}
                        type="text"
                        value={values.documentNumber}
                        variant="outlined"
                      />
                    </Grid>
                    {/* first name */}
                    <Grid item lg={6} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.firstName}
                        fullWidth
                        helperText={errors.firstName || null}
                        label="First Name"
                        name="firstName"
                        onChange={(e) => {
                          setFieldValue('firstName', e.target.value, true);
                        }}
                        required
                        type="text"
                        value={values.firstName}
                        variant="outlined"
                      />
                    </Grid>
                    {/* middle name */}
                    <Grid item lg={6} xs={12}>
                      <TextField
                        className={classes.textField}
                        fullWidth
                        error={!!errors.middleName}
                        helperText={errors.middleName || null}
                        label="Middle Name"
                        name="middleName"
                        onChange={(e) => {
                          setFieldValue('middleName', e.target.value, true);
                        }}
                        type="text"
                        value={values.middleName}
                        variant="outlined"
                      />
                    </Grid>
                    {/* last name */}
                    <Grid item lg={6} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.lastName}
                        fullWidth
                        helperText={errors.lastName || null}
                        label="Last Name"
                        name="lastName"
                        onChange={(e) => {
                          setFieldValue('lastName', e.target.value, true);
                        }}
                        type="text"
                        value={values.lastName}
                        variant="outlined"
                      />
                    </Grid>
                    {/* Date Picker */}
                    <Grid item lg={6} xs={12}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          error={!!errors.dateOfBirth}
                          helperText={errors.dateOfBirth || null}
                          margin="normal"
                          id="date-picker-dialog"
                          label="Date of Birth (format: dd/mm/yyyy)"
                          name="dateOfBirth"
                          required
                          format="dd/MM/yyyy"
                          inputVariant="outlined"
                          value={values.dateOfBirth}
                          onChange={(dateValue) =>
                            setFieldValue('dateOfBirth', dateValue)
                          }
                          KeyboardButtonProps={{
                            'aria-label': 'change date'
                          }}
                          fullWidth
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <Card spacing={3}>
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="customerInfo"
                      className={classes.productInfoAvatar}>
                      P
                    </Avatar>
                  }
                  title={
                    <Typography className={classes.cardHeaderTitle}>
                      <b>Contact and Product Info.</b>
                    </Typography>
                  }
                  subheader="Provide valid customer contact information"
                />
                <Divider className={classes.cardDivider} />
                <CardContent>
                  <Grid container spacing={3}>
                    {/* email address */}
                    <Grid item lg={6} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.emailAddress}
                        fullWidth
                        helperText={errors.emailAddress || null}
                        onChange={(e) => {
                          setFieldValue('emailAddress', e.target.value, true);
                        }}
                        label="Email Address"
                        name="emailAddress"
                        type="email"
                        required
                        value={values.emailAddress}
                        variant="outlined"
                      />
                    </Grid>
                    {/* sponsor mobile number */}
                    <Grid item lg={6} xs={12}>
                      <TextField
                        className={classes.textField}
                        error={!!errors.sponsorMsisdn}
                        fullWidth
                        helperText={errors.sponsorMsisdn || null}
                        onKeyDown={(e) => {
                          if (
                            e.key === '-' ||
                            e.key === 'e' ||
                            e.key === 'Unidentified'
                          ) {
                            e.preventDefault();
                          }
                        }}
                        label="Customer Mobile Number"
                        name="sponsorMsisdn"
                        inputProps={{ maxLength: 13, min: 9 }}
                        onChange={(e) => {
                          const clean = trimNonNumbers(e.target.value);
                          setFieldValue('sponsorMsisdn', clean, true);
                        }}
                        required
                        type="tel"
                        value={values.sponsorMsisdn}
                        variant="outlined"
                      />
                    </Grid>
                    {/* service  plan: Service plans are hardcoded to be changed upon creation of the respective API */}
                    <Grid item lg={6} xs={12}>
                      <TextField
                        className={classes.textField}
                        fullWidth
                        label="Select Service Plan"
                        name="status"
                        error={!!errors.productId}
                        helperText={errors.productId || null}
                        onChange={(e) => {
                          setFieldValue('productId', e.target.value, true);
                        }}
                        required
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        value={values.productId}
                        variant="outlined">
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        <option value="" />
                        {configs.products.map((product) => (
                          <option
                            key={product.productId}
                            value={product.productId}>
                            {product.productName}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <GetSignedInUserQuery>
                      {({
                        getSignedInUser: {
                          user: { userCategory }
                        }
                      }) => (
                        <>
                          {fullRegRoles.includes(userCategory) && (
                            <>
                              <Grid item lg={6} xs={12}>
                                <GetRoutersQuery
                                  fetchPolicy="network-only"
                                  variables={{ roundTime: 23 }}>
                                  {({ getRouters }) => (
                                    <>
                                      {getRouters.routers.length > 0 ? (
                                        <Autocomplete
                                          id="free-solo-demo"
                                          onChange={(event, selectedValue) =>
                                            setFieldValue(
                                              'routerSerialNumber',
                                              selectedValue,
                                              true
                                            )
                                          }
                                          options={getRouters.routers.map(
                                            (routers) =>
                                              routers.routerSerialNumber
                                          )}
                                          openOnFocus
                                          className={classes.textField}
                                          error={!!errors.routerSerialNumber}
                                          noOptionsText="No router serial number to match your search"
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Search router serial number"
                                              required
                                              error={
                                                !!errors.routerSerialNumber
                                              }
                                              name="routerSerialNumber"
                                              helperText={
                                                errors.routerSerialNumber ||
                                                null
                                              }
                                              variant="outlined"
                                              value={values.routerSerialNumber}
                                            />
                                          )}
                                        />
                                      ) : (
                                        <Alert severity="warning">
                                          You do not have any routers uploaded.
                                          Please load some more via your admin
                                        </Alert>
                                      )}
                                    </>
                                  )}
                                </GetRoutersQuery>
                              </Grid>
                              <Grid item lg={6} xs={12}>
                                <TextField
                                  className={classes.textField}
                                  error={!!errors.simexSerialNumber}
                                  fullWidth
                                  required
                                  helperText={errors.simexSerialNumber || null}
                                  label="SIM Serial Number (DSA Simex)"
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
                            </>
                          )}
                        </>
                      )}
                    </GetSignedInUserQuery>
                    <Grid item lg={6} xs={12}>
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom>
                        USABILITY: Sim must be a DSA SIMEX and NOT PAIRED to
                        another number
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            className={classes.checkedButton}
                            onChange={() => {
                              setFieldValue(
                                'simexCheckConfirmation',
                                'confirmationChecked',
                                true
                              );
                            }}
                            value={values.simexCheckConfirmation}
                            name="simexCheckConfirmation"
                          />
                        }
                        label="I confirm to have verified the DSA Simex usability."
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* Form Submit Button */}
          <Grid item xs={12}>
            <Button
              className={classes.addCustomerButton}
              color="primary"
              disabled={buttonDisabledStatus(errors, values, loading)}
              fullWidth
              size="large"
              type="submit"
              variant="contained">
              {loading ? 'Please wait...' : 'Register Customer'}
            </Button>
          </Grid>
        </FormikForm>
      )}
    </Formik>
  );
};

export default RegisterCustomerForm;
