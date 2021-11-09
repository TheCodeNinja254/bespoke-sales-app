import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 10,
    backgroundColor: (props) => props.bgColor || theme.palette.primary.main,
    color: (props) => props.color || theme.palette.white.main,
    textAlign: 'center',
    padding: 2,
    fontSize: 12
  }
}));

const StatusBadge = (props) => {
  const { children } = props;
  const classes = useStyles(props);
  return <Box className={classes.root}>{children}</Box>;
};

export default React.memo(StatusBadge);
