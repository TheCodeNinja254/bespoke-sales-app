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
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import { SearchInput } from '../../../../../components';

const useStyles = makeStyles((theme) => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
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

const DealerToolbar = (props) => {
  const { searchParam, setSearchParam, setSearchUserName, className, ...rest } =
    props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
          color="primary"
          component={RouterLink}
          to="/super-admin/manage-dealers/add-terminal"
          variant="contained">
          Add Dealer/Shop
        </Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search dealer/shop"
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

DealerToolbar.propTypes = {
  className: PropTypes.string
};

export default DealerToolbar;
