import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import { Form as FormikForm } from 'formik';
import { Typography } from '@material-ui/core';

const useSyles = makeStyles((theme) => ({
  dialog: {
    paddingBottom: 16
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#ffffff',
    padding: '16px 24px',
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.16)'
  },
  dialogHeading: {
    fontSize: 16,
    color: theme.palette.primary.main,
    textTransform: 'capitalize'
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalChildren = ({
  classes,
  modalHeader,
  modalContent,
  modalActions
}) => {
  return (
    <>
      {modalHeader && (
        <AppBar className={classes.appBar}>
          <Typography variant="h4" className={classes.dialogHeading}>
            {modalHeader}
          </Typography>
        </AppBar>
      )}

      <DialogContent>{modalContent}</DialogContent>
      {modalActions && (
        <DialogActions className={classes.dialogActions}>
          {modalActions}
        </DialogActions>
      )}
    </>
  );
};

const Modal = ({
  open,
  responsive = false,
  fullScreen = false,
  maxWidth = 'sm',
  fullWidth = false,
  modalHeader = null,
  modalContent,
  modalActions = null,
  form = false,
  handleClose,
  disableBackdropClose = false
}) => {
  const theme = useTheme();
  const classes = useSyles();
  const fullScreenValue = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog
      TransitionComponent={Transition}
      fullScreen={responsive ? fullScreenValue : fullScreen}
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={() => {
        // if disableBackdropClose is passed then dont close on clicking the backdrop
        if (!disableBackdropClose) {
          handleClose();
        }
      }}
      aria-labelledby="responsive-dialog-title">
      <Box className={classes.dialog}>
        {form ? (
          <FormikForm className={classes.form}>
            <ModalChildren
              classes={classes}
              modalHeader={modalHeader}
              modalContent={modalContent}
              modalActions={modalActions}
            />
          </FormikForm>
        ) : (
          <ModalChildren
            classes={classes}
            modalHeader={modalHeader}
            modalContent={modalContent}
            modalActions={modalActions}
          />
        )}
      </Box>
    </Dialog>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  modalContent: PropTypes.element.isRequired
};

export default Modal;
