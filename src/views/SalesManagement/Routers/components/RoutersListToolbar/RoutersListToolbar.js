import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import makeStyles from '@material-ui/styles/makeStyles';
import { Button } from '@material-ui/core';

import AttachmentIcon from '@material-ui/icons/Attachment';
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
  FloatButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const RoutersListToolbar = (props) => {
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
          to="/super-admin/routers/upload"
          variant="contained">
          <AttachmentIcon />
          Upload Routers
        </Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search router by serial number"
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

RoutersListToolbar.propTypes = {
  className: PropTypes.string
};

export default RoutersListToolbar;
