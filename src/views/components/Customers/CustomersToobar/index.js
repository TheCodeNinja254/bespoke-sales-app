import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import isEmpty from 'lodash.isempty';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  filterButton: {
    marginTop: theme.spacing(2),
    color: theme.palette.error.dark
  },
  searchButton: {
    marginTop: theme.spacing(2)
  },
  filteredText: {
    marginTop: theme.spacing(2),
    color: theme.palette.error.main
  },
  unfilteredText: {
    marginTop: theme.spacing(2)
  },
  filteredTextBold: {
    fontWeight: 500
  }
}));

const CustomersToolbar = (props) => {
  const {
    searchParam,
    setSearchParam,
    searchValue,
    setSearchValue,
    setPage,
    setRowsPerPage,
    searchParamFinal,
    searchValueFinal,
    setSearchIsClear,
    ...rest
  } = props;

  const classes = useStyles();

  // eslint-disable-next-line prefer-const
  let [filterParam, setFilterParam] = React.useState('');
  // eslint-disable-next-line prefer-const
  let [filterValue, setFilterValue] = React.useState('');

  const disabledStatus = (a, b) => {
    let status = true;

    if (a !== '' && b !== '') {
      status = false;
    }
    return status;
  };

  const clearButtonDisabledStatus = (a, b) => {
    let status = true;

    if (
      (a !== '' && b !== '') ||
      (searchParamFinal !== '' && searchValueFinal !== '')
    ) {
      status = false;
    }
    return status;
  };

  // Interactive input button
  let label;
  if (isEmpty(filterParam)) {
    label = 'Enter a value to filter by';
  } else if (filterParam === 'firstName') {
    label = 'Enter customer first name';
  } else if (filterParam === 'lastName') {
    label = 'Enter customer last name';
  } else if (filterParam === 'routerSerialNo') {
    label = 'Enter a router serial number';
  } else if (filterParam === 'sponsorMsisdn') {
    label = 'Enter customer mobile number';
  } else if (filterParam === 'beneficiaryMsisdn') {
    label = 'Enter router mobile number';
  }

  let fieldName;
  if (isEmpty(searchParam)) {
    fieldName = '';
  } else if (searchParam === 'firstName') {
    fieldName = 'First Name';
  } else if (searchParam === 'lastName') {
    fieldName = 'Last Name';
  } else if (searchParam === 'routerSerialNo') {
    fieldName = 'Router Serial Number';
  } else if (searchParam === 'sponsorMsisdn') {
    fieldName = 'Customer Mobile Number';
  } else if (searchParam === 'beneficiaryMsisdn') {
    fieldName = 'Router Mobile Number';
  }

  return (
    <Card {...rest} className={classes.root}>
      <CardContent>
        <Typography variant="overline" display="block" gutterBottom>
          filters
        </Typography>
        <Divider />
        <Grid container spacing={3}>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              variant="outlined"
              fullWidth
              className={classes.textField}>
              <InputLabel id="select-label">Select a filter</InputLabel>
              <Select
                labelId="select-label"
                id="select-label"
                defaultValue=""
                value={filterParam}
                label="Select a filter"
                onChange={(e) => {
                  setFilterParam(e.target.value);
                }}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="firstName">First Name</MenuItem>
                <MenuItem value="lastName">Last Name</MenuItem>
                <MenuItem value="routerSerialNo">Router Serial No.</MenuItem>
                <MenuItem value="sponsorMsisdn">Customer Contact</MenuItem>
                <MenuItem value="beneficiaryMsisdn">
                  Router Mobile Number
                </MenuItem>
              </Select>
              {/* <FormHelperText>With label + helper text</FormHelperText> */}
            </FormControl>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              className={classes.textField}
              fullWidth
              onChange={(e) => {
                setFilterValue(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  setSearchParam(filterParam);
                  setSearchValue(filterValue);
                }
              }}
              value={filterValue}
              variant="outlined"
              required
              id="outlined-required"
              label={label}
            />
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={6} xs={6}>
            <Button
              className={classes.searchButton}
              color="primary"
              disabled={disabledStatus(filterParam, filterValue)}
              fullWidth
              onClick={() => {
                localStorage.clear();
                setPage(0);
                setRowsPerPage(20);
                setSearchParam(filterParam);
                setSearchValue(filterValue);
              }}
              size="large"
              type="submit"
              variant="outlined">
              <FilterListIcon /> Filter
            </Button>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={6} xs={6}>
            <Button
              className={classes.filterButton}
              disabled={clearButtonDisabledStatus(filterParam, filterValue)}
              fullWidth
              onClick={() => {
                localStorage.clear();
                setPage(0);
                setSearchIsClear(true);
                setRowsPerPage(20);
                setSearchParam('');
                setSearchValue('');
                setFilterParam('');
                setFilterValue('');
              }}
              size="large"
              variant="outlined">
              <ClearAllIcon /> Clear
            </Button>
          </Grid>
        </Grid>
        {searchParam && searchValue ? (
          <Typography variant="body2" className={classes.filteredText}>
            Current filter selection:{' '}
            <span className={classes.filteredTextBold}>{fieldName}</span> ={' '}
            <span className={classes.filteredTextBold}>{searchValue}</span>
          </Typography>
        ) : (
          <Typography variant="body2" className={classes.unfilteredText}>
            Use above filters to search for specific records.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

CustomersToolbar.propTypes = {
  searchParam: PropTypes.string,
  setSearchParam: PropTypes.func,
  setSearchValue: PropTypes.func,
  searchValue: PropTypes.string,
  searchParamFinal: PropTypes.string,
  searchValueFinal: PropTypes.string,
  setPage: PropTypes.func,
  setRowsPerPage: PropTypes.func,
  setSearchIsClear: PropTypes.func
};

export default CustomersToolbar;
