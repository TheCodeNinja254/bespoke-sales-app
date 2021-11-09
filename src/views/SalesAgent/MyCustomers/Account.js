import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import AccountProfile from './AccountProfile';
import { Dialog, StatusIcon } from '../../../components';
import { UploadSimexForm } from '../../components/UploadSimexForm';
import EditCustomerForm from '../../components/EditCustomer/EditCustomer';
import SimReplacementForm from '../../components/SimReplacement';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    details: {
      display: 'flex'
    }
  },
  content: {
    marginTop: theme.spacing(2)
  },
  passwordWrapper: {
    marginTop: theme.spacing(2)
  },
  dialogContent: {
    textAlign: 'center'
  }
}));
const EditUser = (props) => {
  const classes = useStyles();
  const {
    state: {
      sale: {
        routerSerialNumber,
        estateName,
        houseNumber,
        sponsorMsisdn,
        productName,
        paymmentDate,
        activationDate,
        beneficiaryMsisdn,
        createdBy,
        paymentStatus,
        isset,
        fullName,
        saleDate,
        registrationId
      }
    }
  } = props.location;

  const [updateRouterDeliveryDetails, setUpdateRouterDetails] = React.useState({
    open: false,
    status: false,
    message: ''
  });
  const { open, status, message } = updateRouterDeliveryDetails;

  const closeDialog = () => {
    setUpdateRouterDetails({ open: false, status: false, message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Customer Details</title>
      </Helmet>
      <div className={classes.root}>
        <div className={classes.content}>
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
          <>
            {isset ? (
              <Grid container spacing={4}>
                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <AccountProfile
                    customerDetails={{ fullName, paymentStatus, saleDate }}
                  />
                </Grid>
                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <SimReplacementForm customerDetails={{ beneficiaryMsisdn }} />
                </Grid>
                <>
                  {paymentStatus !== 1 &&
                  routerSerialNumber === 'Unavailable' ? (
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <UploadSimexForm customerDetails={{ registrationId }} />
                    </Grid>
                  ) : (
                    <></>
                  )}
                </>
                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <EditCustomerForm
                    customerDetails={{
                      paymmentDate,
                      productName,
                      activationDate,
                      beneficiaryMsisdn,
                      createdBy,
                      estateName,
                      houseNumber,
                      routerSerialNumber,
                      sponsorMsisdn,
                      registrationId
                    }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Redirect
                to={{
                  pathname: '/not-found'
                }}
              />
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default withRouter(EditUser);
