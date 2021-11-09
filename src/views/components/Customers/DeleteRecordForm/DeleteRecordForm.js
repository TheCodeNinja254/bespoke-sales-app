import React from 'react';
import {
  Box,
  Button,
  FormControl,
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
import DeleteIcon from '@material-ui/icons/Delete';
import { random } from 'underscore';
import ErrorHandler from '../../../../utils/errorHandler';
import Dialog from '../../../../components/Dialog';
import StatusIcon from '../../../../components/StatusIcon';
import { DELETE_CUSTOMER_RECORD } from '../../../../mutations/Customers/Customers';
import { GET_MY_CUSTOMERS } from '../../../../queries/Customers/GetCustomersQuery';
import { GET_ROUTERS } from '../../../../queries/Routers/GetRouters';

const DeleteRegistrationSchema = Yup.object().shape({
  reason: Yup.string()
    .required('Please enter a valid reason for deletion')
    .min(3)
    .max(32)
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
    color: theme.palette.error.main
  },
  actionText: {
    marginTop: theme.spacing(3)
  }
}));

const DeleteRecordForm = (props) => {
  const classes = useStyles();
  const { customerDetails, confirmModalOpen, setDeleteModal } = props;
  const { registrationId } = customerDetails;

  const buttonDisabledStatus = (errors, values, loading) => {
    let buttonStatus = true;
    if (isEmpty(errors) && values.reason !== '' && loading === false) {
      buttonStatus = false;
    }
    return buttonStatus;
  };

  const [DeleteRegRecordMutation, { loading }] = useMutation(
    DELETE_CUSTOMER_RECORD
  );

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
    setDeleteModal({
      open: false,
      customerDetails: {
        registrationId: 0
      }
    });
  };

  return (
    <Dialog
      open={confirmModalOpen}
      modalContent={
        <Formik
          initialValues={{
            reason: ''
          }}
          validationSchema={DeleteRegistrationSchema}
          onSubmit={(values) => {
            DeleteRegRecordMutation({
              variables: {
                reason: values.reason,
                registrationId
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
                    deleteRegRecord: {
                      status: updateStatus,
                      message: customerMessage
                    }
                  }
                } = response;
                if (updateStatus) {
                  // setDeleteModal({
                  //   open: false,
                  //   customerDetails: {
                  //     registrationId: 0
                  //   }
                  // });
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
                Delete customer record
              </Typography>
              <Typography variant="body2" align="center" gutterBottom>
                Deleting a record will return the router to the on-sale queue.
                Only records that have failed to generate a router mobile number
                are eligible for deletion
              </Typography>
              <Typography
                variant="h6"
                className={classes.actionText}
                gutterBottom>
                Provide justification for deleting this record
              </Typography>
              <FormControl
                className={classes.textFieldWithLable}
                fullWidth
                label="Reason for deletion"
                type="text"
                placeholder="I am deleting because..."
                variant="outlined"
                name="reason"
                error={!!errors.reason}
                onChange={(e) => {
                  setFieldValue('reason', e.target.value, true);
                }}
                value={values.reason}>
                <OutlinedInput
                  id="outlined-adornment-msisdn"
                  placeholder="Enter a justification to delete."
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
                            <DeleteIcon />
                            <Typography>Delete</Typography>
                          </>
                        )}
                      </Button>
                    </InputAdornment>
                  }
                />
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

DeleteRecordForm.propTypes = {
  customerDetails: PropTypes.object.isRequired
};

export default React.memo(DeleteRecordForm);
