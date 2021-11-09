import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: '#6cc04a'
  },
  primary: {
    backgroundColor: '#6cc04a'
  },
  danger: {
    backgroundColor: '#ff6b6b'
  },
  info: {
    backgroundColor: '#48dbfb'
  },
  warning: {
    backgroundColor: '#ffaa31'
  },
  snackbarContent: {
    backgroundColor: '#ffffff',
    padding: '3px 15px',
    flexWrap: 'inherit'
  },
  icon: {
    fontSize: 20
  },
  closeIcon: {
    color: theme.palette.success.main
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  },
  textSize: {
    fontSize: theme.typography.pxToRem(15)
  },
  iconWrapper: {
    marginRight: '5px',
    marginLeft: '-15px',
    marginTop: '-12px',
    marginBottom: '-12px',
    height: '50px',
    padding: '15px'
  },
  successText: {
    color: '#4ce2a7'
  },
  primaryText: {
    color: '#2d4ef5'
  },
  dangerText: {
    color: '#ff6b6b'
  },
  infoText: {
    color: '#48dbfb'
  },
  warningText: {
    color: '#ffaa31'
  }
}));

const MySnackbarContentWrapper = (props) => {
  const classes = useStyles();
  const { className, message, onClose, variant, variantText, ...other } = props;

  return (
    <SnackbarContent
      className={clsx(classes.snackbarContent, className)}
      aria-describedby="client-snackbar"
      elevation={1}
      message={
        // eslint-disable-next-line
        <Box id="client-snackbar" className={classes.message}>
          <Typography className={clsx(classes[variantText], classes.textSize)}>
            {message}
          </Typography>
        </Box>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
};

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['danger', 'info', 'success', 'warning', 'primary'])
    .isRequired
};

export default MySnackbarContentWrapper;
