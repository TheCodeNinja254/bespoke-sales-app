/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import FilterListIcon from '@material-ui/icons/FilterList';
import TextField from '@material-ui/core/TextField';
import Breadcrumbs from '../Components/Breadcrumbs';
import { ReadyEstatesTable, ReadyEstatesToolbar } from './components';
import { Alert } from '../../../components';
import GetRegionsQuery from '../../../queries/Locations/GetRegionsQuery';
import GetZonesQuery from '../../../queries/Locations/GetZones';
import GetEstatesQuery from '../../../queries/Locations/GetEstates';
import { configs } from '../../../Configs';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  divider: {
    height: 50,
    margin: 4
  },
  content: {
    marginTop: theme.spacing(2)
  },
  tableTools: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const ReadyEstates = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { pathname, search } = location;
  localStorage.clear();
  localStorage.setItem(
    'customerDetails',
    JSON.stringify({
      customer: {
        isset: false
      }
    })
  );

  const defaultRegionId = {
    value: configs.defaultRegion,
    retrieveBy: 'region'
  };
  const [{ value, retrieveBy }, setValue] = React.useState(defaultRegionId);
  const defaultZoneId = {
    zoneValue: configs.defaultZone,
    retrieveByZone: 'zone'
  };
  const [{ zoneValue, retrieveByZone }, setZoneValue] =
    React.useState(defaultZoneId);

  const [searchParam, setSearchParam] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(0);

  const urlObjectParams = queryString.parse(search);

  const handlePageChange = (event, pageSelected) => {
    setPage(pageSelected);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const setUserNameSearchAction = (estateName) => {
    urlObjectParams.q = estateName;
    const stringified = queryString.stringify(urlObjectParams);
    history.push(`${pathname}?${stringified}`);
  };

  return (
    <>
      <Helmet>
        <title>Customers</title>
      </Helmet>
      <div className={classes.root}>
        <Breadcrumbs>
          <Typography color="textPrimary">Ready Estates</Typography>
        </Breadcrumbs>
        <ReadyEstatesToolbar
          searchParam={searchParam}
          setSearchParam={setSearchParam}
          setSearchUserName={setUserNameSearchAction}
        />
        <Card className={classes.content}>
          <Grid container className={classes.tableTools} spacing={2}>
            <Grid item xs={12} lg={3} sm={12} md={3}>
              <Typography variant="h5">4G Ready Estates</Typography>
              <Typography variant="body2">
                Filter by Region then Zone as appropriate
              </Typography>
            </Grid>
            {/* <Divider className={classes.divider} orientation="vertical"/> */}
            <Grid item xs={12} lg={1} sm={12} md={1}>
              <Typography variant="body2">
                <FilterListIcon />
                FILTERS
              </Typography>
            </Grid>
            <Grid item xs={10} lg={3} sm={10} md={3}>
              <GetRegionsQuery>
                {({ getRegions }) => (
                  <>
                    {getRegions.getRegionsStatus ? (
                      <TextField
                        fullWidth
                        label="Select Region"
                        name="regionId"
                        // helperText={
                        //   errors.regionId || null
                        // }
                        defaultValue={value}
                        onChange={(e) => {
                          setValue({
                            value: e.target.value,
                            retrieveBy: 'region'
                          });
                        }}
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        // value={values.regionId}
                        variant="outlined">
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        {getRegions.regions.map((regions) => (
                          <option
                            key={regions.regionId}
                            value={regions.regionId}>
                            {regions.regionName}
                          </option>
                        ))}
                      </TextField>
                    ) : (
                      <Alert severity="warning">
                        An error was encountered trying to load the list of
                        available regions
                      </Alert>
                    )}
                  </>
                )}
              </GetRegionsQuery>
            </Grid>
            <Grid item xs={10} lg={3} sm={10} md={3}>
              <GetZonesQuery variables={{ regionId: value, retrieveBy }}>
                {({ getZones }) => (
                  <>
                    {getZones.getZonesStatus ? (
                      <TextField
                        fullWidth
                        label="Select Zone"
                        name="zone"
                        onChange={(e) => {
                          setZoneValue({
                            zoneValue: Number(e.target.value),
                            retrieveByZone: 'zone'
                          });
                        }}
                        defaultValue={zoneValue}
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        variant="outlined">
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        {getZones.zones.map((zones) => (
                          <option key={zones.id} value={zones.id}>
                            {zones.zoneName}
                          </option>
                        ))}
                      </TextField>
                    ) : (
                      <Alert severity="warning">
                        The selected region does not have zones mapped to it.
                      </Alert>
                    )}
                  </>
                )}
              </GetZonesQuery>
            </Grid>
          </Grid>
          <GetEstatesQuery
            variables={{
              zoneId: zoneValue,
              retrieveByZone,
              pageSize: rowsPerPage,
              pageNo: Number(page) + 1
            }}>
            {({ getEstates }) => (
              <ReadyEstatesTable
                handlePageChange={handlePageChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                page={page}
                getEstatesStatus={getEstates.getEstatesStatus}
                totalEstates={getEstates.getEstatesCount}
                estates={
                  searchParam === ''
                    ? getEstates.estates
                    : getEstates.estates.filter((item) =>
                        item.estateName
                          .toLowerCase()
                          .includes(searchParam.toLowerCase())
                      )
                }
              />
            )}
          </GetEstatesQuery>
        </Card>
      </div>
    </>
  );
};

export default ReadyEstates;
