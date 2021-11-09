import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 0,
    height: '100%'
  },
  content: {
    height: '100%'
  }
}));

const Minimal = (props) => {
  const { children = false } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.content}>{children}</main>
    </div>
  );
};

Minimal.propTypes = {
  children: PropTypes.node
};

export default Minimal;
