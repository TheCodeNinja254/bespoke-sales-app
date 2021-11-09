import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import makeStyles from '@material-ui/core';

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

const RoutersToolbar = (props) => {
  const {
    className,
    searchParam,
    setSearchParam,
    setSearchCategoryName,
    ...rest
  } = props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        {/* Add Routers to be added in a later sprint */}
        {/* <Button */}
        {/*  color="primary" */}
        {/*  component={RouterLink} */}
        {/*  to="/ssales/routers/add-routers" */}
        {/*  variant="contained" */}
        {/*  startIcon={<AddIcon />} */}
        {/* > */}
        {/*   Add Routers */}
        {/* </Button> */}
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search Routers"
          onChange={(e) => {
            setSearchParam(e.target.value);
          }}
          onSearch={() => {
            setSearchCategoryName(searchParam);
          }}
        />
      </div>
    </div>
  );
};

RoutersToolbar.propTypes = {
  className: PropTypes.string
};

export default RoutersToolbar;
