import React from 'react';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles, TableContainer, Tooltip } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Alert, StatusBadge } from '../../../../../components';

import { getInitials } from '../../../../../utils';
import { decrypt } from '../../../../../utils/encryptDecrypt';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2),
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));
function setUserTempStorage(
  id,
  agencyId,
  adEnabled,
  fullname,
  firstName,
  userName,
  lastName,
  docType,
  docNumber,
  msisdn,
  createdBy,
  status,
  createdOn,
  role,
  updatedOn,
  passwordSetDate
) {
  localStorage.clear();
  localStorage.setItem(
    'userDetails',
    JSON.stringify({
      user: {
        isset: true,
        id,
        agencyId,
        adEnabled,
        fullname,
        firstName,
        userName,
        lastName,
        docType,
        docNumber,
        msisdn,
        createdBy: createdBy || 'Unavailable',
        status,
        createdOn: createdOn || 'Unavailable',
        role,
        updatedOn: updatedOn || 'Unavailable',
        passwordSetDate: passwordSetDate || 'Unavailable'
      }
    })
  );
}

const UsersTable = (props) => {
  const {
    handlePageChange,
    handleRowsPerPageChange,
    rowsPerPage,
    page,
    getUsersStatus,
    totalUsers,
    className,
    users,
    agencyId,
    ...rest
  } = props;

  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <TableContainer>
          <div className={classes.inner}>
            {totalUsers > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Mobile No.</TableCell>
                    <TableCell>Document Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created on</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow className={classes.tableRow} hover key={user.id}>
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <Avatar className={classes.avatar}>
                            {getInitials(user.fullname)}
                          </Avatar>
                          <Typography variant="body1">
                            {user.fullname}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.userName ? decrypt(user.userName) : null}
                      </TableCell>
                      <TableCell>
                        {user.msisdn ? decrypt(user.msisdn) : null}
                      </TableCell>
                      <TableCell>
                        {user.docNumber ? decrypt(user.docNumber) : null}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          bgColor={
                            user.status === 1
                              ? theme.palette.success.main
                              : theme.palette.error.main
                          }>
                          {user.status === 1 ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        {user.createdBy ? decrypt(user.createdBy) : null}
                      </TableCell>
                      <TableCell>
                        {user.createdOn
                          ? moment(user.createdOn).format('DD/MM/YYYY')
                          : 'Unavailable'}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View User">
                          <Button
                            variant="outlined"
                            color="primary"
                            component={RouterLink}
                            onClick={() =>
                              setUserTempStorage(
                                user.id,
                                agencyId,
                                user.adEnabled,
                                user.fullname,
                                user.firstName,
                                user.userName,
                                user.lastName,
                                user.docType,
                                user.docNumber,
                                user.msisdn,
                                user.createdBy,
                                user.status,
                                user.createdOn,
                                user.role,
                                user.updatedOn,
                                user.passwordSetDate
                              )
                            }
                            to={`/super-admin/user/${user.id}`}>
                            <VisibilityIcon />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert severity="warning">Sorry, this list is empty.</Alert>
            )}
          </div>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;
