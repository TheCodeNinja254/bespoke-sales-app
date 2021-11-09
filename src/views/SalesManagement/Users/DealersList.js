import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';

import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import { useHistory, useLocation } from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import queryString from 'query-string';
import Breadcrumbs from '../Components/Breadcrumbs';
import { Alert } from '../../../components';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
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
        <title>Users</title>
      </Helmet>
      <div className={classes.root}>
        <Breadcrumbs>
          <Typography color="textPrimary">Users</Typography>
        </Breadcrumbs>
        <Alert severity="info">This feature will be available soon </Alert>
        {/* <RoutersListToolbar */}
        {/*  searchParam={searchParam} */}
        {/*  setSearchParam={setSearchParam} */}
        {/*  setSearchUserName={setUserNameSearchAction} */}
        {/* /> */}
        {/* <div className={classes.content}> */}
        {/*  <GetUsersQuery */}
        {/*    variables={{ perPage: rowsPerPage, page: (Number(page) + 1), userName }} */}
        {/*  > */}
        {/*    {({ getUsers }) => ( */}
        {/*      <RoutersListTable */}
        {/*        handlePageChange={handlePageChange} */}
        {/*        handleRowsPerPageChange={handleRowsPerPageChange} */}
        {/*        rowsPerPage={rowsPerPage} */}
        {/*        page={page} */}
        {/*        totalUsers={getUsers.total} */}
        {/*        users={searchParam === '' */}
        {/*          ? getUsers.users */}
        {/*          : getUsers.users.filter(item => item.fullName.toLowerCase().includes(searchParam.toLowerCase()))} */}
        {/*      /> */}
        {/*    )} */}
        {/*  </GetUsersQuery> */}

        {/* </div> */}
      </div>
    </>
  );
};

export default UserList;
