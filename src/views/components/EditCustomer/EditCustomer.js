import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import React from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { EditCustomerMsisdnForm, EditCustomerRouterForm } from './forms';
import CollapsibleAlerts from '../../../components/CollapsibleAlerts';
import DeleteRecordForm from '../Customers/DeleteRecordForm/DeleteRecordForm';

const useStyles = makeStyles((theme) => ({
  root: {},
  deleteButton: {
    color: theme.palette.error.main,
    margin: theme.spacing(1)
  }
}));

const EditCustomer = (props) => {
  const { customerDetails } = props;
  const {
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
  } = customerDetails;

  const styles = useStyles();

  const [deleteModal, setDeleteModal] = React.useState({
    open: false,
    customerDetails: {
      registrationId: 0
    }
  });

  const { open } = deleteModal;

  return (
    <Card>
      <Grid container spacing={3}>
        <Grid item lg={9} xs={12}>
          <CardHeader
            subheader="Complete router delivery to start the activation process"
            title="Customer Activation Details"
          />
        </Grid>
        <Grid item lg={3} xs={12}>
          <DeleteRecordForm
            confirmModalOpen={open}
            customerDetails={customerDetails}
            setDeleteModal={setDeleteModal}
          />
          <Button
            variant="outlined"
            className={styles.deleteButton}
            disabled={beneficiaryMsisdn !== null}
            onClick={() =>
              setDeleteModal({
                open: true,
                customerDetails: {
                  registrationId: registrationId || 0
                }
              })
            }>
            <DeleteIcon />
            Delete record
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <CollapsibleAlerts alertMessage="Change the customer mobile number or router serial using below fields with an update button" />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item lg={6} xs={12}>
            <TextField
              fullWidth
              label="PAYMENT DATE"
              type="text"
              readOnly
              value={
                paymmentDate === null || paymmentDate === 'Pending'
                  ? 'Pending'
                  : moment(paymmentDate).format('DD/MM/YYYY h:mm:ss a')
              }
              variant="outlined"
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              fullWidth
              label="ACTIVATION DATE"
              type="text"
              readOnly
              value={
                activationDate === null || activationDate === 'Pending'
                  ? 'Pending'
                  : moment(activationDate).format('DD/MM/YYYY h:mm:ss a')
              }
              variant="outlined"
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <EditCustomerMsisdnForm
              customerDetails={{ sponsorMsisdn, registrationId }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              fullWidth
              label="ROUTER MOBILE NUMBER"
              type="text"
              readOnly
              value={
                beneficiaryMsisdn === null ? 'Unavailable' : beneficiaryMsisdn
              }
              variant="outlined"
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              fullWidth
              label="SERVICE PLAN"
              type="text"
              readOnly
              value={productName}
              variant="outlined"
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              fullWidth
              label="ESTATE"
              type="text"
              readOnly
              value={estateName}
              variant="outlined"
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              fullWidth
              label="HOUSE NUMBER"
              type="text"
              readOnly
              value={houseNumber === null ? 'Unavailable' : houseNumber}
              variant="outlined"
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <EditCustomerRouterForm
              customerDetails={{ routerSerialNumber, registrationId }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              fullWidth
              label="SALE BY"
              type="text"
              readOnly
              value={createdBy}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

EditCustomer.propTypes = {
  customerDetails: PropTypes.object.isRequired
};

export default React.memo(EditCustomer);
