/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import { useHistory, useLocation } from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import queryString from 'query-string';
import { RoutersListTable, RoutersListToolbar } from './components';
import Breadcrumbs from '../Components/Breadcrumbs';
import GetMyCustomersQuery from '../../../queries/Customers/GetCustomersQuery';
import { decrypt } from '../../../utils/encryptDecrypt';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const RoutersList = () => {
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

  const [searchParam, setSearchParam] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(0);

  const [searchUserName, setSearchStoreName] = useState('');
  const urlObjectParams = queryString.parse(search);

  let userName = searchUserName;
  if (!isEmpty(urlObjectParams)) {
    userName = urlObjectParams.q || userName;
  }

  const handlePageChange = (event, pageSelected) => {
    setPage(pageSelected);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const setUserNameSearchAction = (value) => {
    setSearchStoreName(value);
    urlObjectParams.q = value;
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
          <Typography color="textPrimary">Available Routers</Typography>
        </Breadcrumbs>
        <RoutersListToolbar
          searchParam={searchParam}
          setSearchParam={setSearchParam}
          setSearchUserName={setUserNameSearchAction}
        />
        <div className={classes.content}>
          <GetMyCustomersQuery
            variables={{
              perPage: rowsPerPage,
              page: Number(page) + 1,
              userName
            }}>
            {({ getMySales }) => (
              <RoutersListTable
                handlePageChange={handlePageChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                page={page}
                totalSales={getMySales.getSalesCount}
                sales={
                  searchParam === ''
                    ? getMySales.sales
                    : getMySales.sales.filter((item) =>
                        decrypt(item.sponsorMsisdn)
                          .toLowerCase()
                          .includes(searchParam.toLowerCase())
                      )
                }
              />
            )}
          </GetMyCustomersQuery>
        </div>
      </div>
    </>
  );
};

export default RoutersList;
