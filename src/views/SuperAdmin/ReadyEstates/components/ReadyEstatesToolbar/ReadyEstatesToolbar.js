/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, Button } from '@material-ui/core';
import { SearchInput } from '../../../../../components';

const useStyles = makeStyles((theme) => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4)
  },
  spacer: {
    flexGrow: 1
  },
  FloatButton: {
    marginRight: theme.spacing(1)
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const ReadyEstatesToolbar = (props) => {
  const { searchParam, setSearchParam, setSearchUserName, className, ...rest } =
    props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
          className={classes.FloatButton}
          color="primary"
          component={RouterLink}
          to="/super-admin/ready-estates/upload-single"
          variant="contained">
          Single Upload
        </Button>
        <Button
          className={classes.FloatButton}
          color="primary"
          component={RouterLink}
          to="/super-admin/ready-estates/upload-multiple"
          variant="contained">
          Upload Multiple
        </Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search estate by name"
          onChange={(e) => {
            setSearchParam(e.target.value);
          }}
          onSearch={() => {
            setSearchUserName(searchParam);
          }}
        />
      </div>
    </div>
  );
};

ReadyEstatesToolbar.propTypes = {
  className: PropTypes.string
};

export default ReadyEstatesToolbar;
