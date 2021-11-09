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
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Breadcrumbs from '../Components/Breadcrumbs';
import DealerToolbar from './components/DealersToolbar';
import GetAgenciesQuery from '../../../queries/Agencies/GetAgenciesQuery';
import DealersTable from './components/DealersTable';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
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

const UserList = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { pathname, search } = location;

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

  const setUserNameSearchAction = (value) => {
    urlObjectParams.q = value;
    const stringified = queryString.stringify(urlObjectParams);
    history.push(`${pathname}?${stringified}`);
  };

  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <div className={classes.root}>
        <Breadcrumbs>
          <Typography color="textPrimary">Dealers/Shops</Typography>
        </Breadcrumbs>
        <DealerToolbar
          searchParam={searchParam}
          setSearchParam={setSearchParam}
          setSearchUserName={setUserNameSearchAction}
        />
        <Card className={classes.content}>
          <Grid container className={classes.tableTools} spacing={2}>
            <Grid item xs={12} lg={3} sm={12} md={3}>
              <Typography variant="h5">Manage Dealers & Shops</Typography>
              <Typography variant="body2">
                Dealer, Shop and terminals list
              </Typography>
            </Grid>
          </Grid>
          <GetAgenciesQuery>
            {({ getAgencies }) => (
              <DealersTable
                handlePageChange={handlePageChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                page={page}
                getAgenciesStatus={getAgencies.getAgenciesStatus}
                agencies={
                  searchParam === ''
                    ? getAgencies.agencies
                    : getAgencies.agencies.filter((item) =>
                        item.agencyName
                          .toLowerCase()
                          .includes(searchParam.toLowerCase())
                      )
                }
              />
            )}
          </GetAgenciesQuery>
        </Card>
      </div>
    </>
  );
};

export default UserList;
