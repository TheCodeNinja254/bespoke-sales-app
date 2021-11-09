import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2)
      }
    }
  })
);

export default function CollapsibleAlerts({ alertMessage, className }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  return (
    <div className={clsx(classes.root, className)}>
      <Collapse in={open}>
        <Alert
          // variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
          {alertMessage}
        </Alert>
      </Collapse>
    </div>
  );
}
