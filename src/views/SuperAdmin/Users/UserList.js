import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import { useHistory, useLocation } from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import queryString from 'query-string';
import Grid from '@material-ui/core/Grid';
import FilterListIcon from '@material-ui/icons/FilterList';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Breadcrumbs from '../Components/Breadcrumbs';
import UsersToolbar from './components/UsersToolbar';
import UsersTable from './components/UsersTable';
import { Alert } from '../../../components';
import GetAgenciesQuery from '../../../queries/Agencies/GetAgenciesQuery';
import GetAllUsersQuery from '../../../queries/Account/GetAllUsersQuery';
import CollapsibleAlerts from '../../../components/CollapsibleAlerts';

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

  const [agencyId, setAgencyValue] = React.useState('21');

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
              <Typography variant="h5">User List</Typography>
              <Typography variant="body2">
                Use below table to manage users
              </Typography>
            </Grid>
            <Grid item xs={12} lg={1} sm={12} md={1}>
              <FilterListIcon />
              <Typography variant="button">Filters</Typography>
            </Grid>
            <Grid item xs={10} lg={3} sm={10} md={3}>
              <GetAgenciesQuery>
                {({ getAgencies }) => (
                  <>
                    {getAgencies.getAgenciesStatus ? (
                      <TextField
                        fullWidth
                        label="Filter by agency/shop"
                        name="agencyId"
                        onChange={(e) => {
                          setAgencyValue(e.target.value);
                        }}
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        variant="outlined">
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        <option key="" value="">
                          Filter by agency/shop
                        </option>
                        {getAgencies.agencies.map((agency) => (
                          <option key={agency.agencyId} value={agency.agencyId}>
                            {agency.agencyName}
                          </option>
                        ))}
                      </TextField>
                    ) : (
                      <Alert severity="warning">
                        An error was encountered trying to load the list of
                        agencies regions
                      </Alert>
                    )}
                  </>
                )}
              </GetAgenciesQuery>
            </Grid>
            <Grid item xs={10} lg={4} sm={10} md={4}>
              <CollapsibleAlerts alertMessage="You can now edit users info. Click to the view button to make changes" />
            </Grid>
          </Grid>
          <GetAllUsersQuery
            variables={{
              perPage: rowsPerPage,
              page: Number(page) + 1,
              userName,
              agencyId
            }}>
            {({ getAllUsers }) => (
              <UsersTable
                handlePageChange={handlePageChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                page={page}
                agencyId={agencyId}
                getUsersStatus={getAllUsers.getUsersStatus}
                totalUsers={getAllUsers.getUsersCount}
                users={
                  searchParam === ''
                    ? getAllUsers.users
                    : getAllUsers.users.filter((item) =>
                        item.fullname
                          .toLowerCase()
                          .includes(searchParam.toLowerCase())
                      )
                }
              />
            )}
          </GetAllUsersQuery>
        </Card>
      </div>
    </>
  );
};

export default UserList;
