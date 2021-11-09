import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import { useHistory, useLocation } from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import queryString from 'query-string';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Breadcrumbs from '../Components/Breadcrumbs';
import UsersToolbar from './components/UsersToolbar';
import GetUsersQuery from '../../../queries/Account/UsersQuery';
import UsersTable from './components/UsersTable';
import GetSignedInUserQuery from '../../../queries/Account/GetSignedInUser';

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
        <UsersToolbar
          searchParam={searchParam}
          setSearchParam={setSearchParam}
          setSearchUserName={setUserNameSearchAction}
        />
        <Card className={classes.content}>
          <Grid container className={classes.tableTools} spacing={2}>
            <Grid item xs={12} lg={3} sm={12} md={3}>
              <Typography variant="h5">Sales Team</Typography>
              <Typography variant="body2">
                User list for the sale team
              </Typography>
            </Grid>
          </Grid>
          <GetSignedInUserQuery>
            {({
              getSignedInUser: {
                user: { agencyId }
              }
            }) => (
              <GetUsersQuery
                variables={{
                  perPage: rowsPerPage,
                  page: Number(page) + 1,
                  userName,
                  agencyId
                }}>
                {({ getUsers }) => (
                  <UsersTable
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    agencyId={agencyId}
                    getUsersStatus={getUsers.getUsersStatus}
                    totalUsers={getUsers.getUsersCount}
                    users={
                      searchParam === ''
                        ? getUsers.users
                        : getUsers.users.filter((item) =>
                            item.fullname
                              .toLowerCase()
                              .includes(searchParam.toLowerCase())
                          )
                    }
                  />
                )}
              </GetUsersQuery>
            )}
          </GetSignedInUserQuery>
        </Card>
      </div>
    </>
  );
};

export default UserList;
