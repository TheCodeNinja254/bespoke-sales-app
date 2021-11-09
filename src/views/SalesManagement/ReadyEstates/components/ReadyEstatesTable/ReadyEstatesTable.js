import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles, TableContainer } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import { Alert, StatusBadge } from '../../../../../components';

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
  deleteButton: {
    color: '#D32F2F'
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

const ReadyEstatesTable = (props) => {
  const {
    handlePageChange,
    handleRowsPerPageChange,
    rowsPerPage,
    page,
    getEstatesStatus,
    totalEstates,
    estates
  } = props;

  const classes = useStyles();
  const theme = useTheme();
  const [selectedUsers] = useState([]);

  return (
    <>
      <CardContent className={classes.content}>
        <TableContainer>
          <div className={classes.inner}>
            {getEstatesStatus ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Estate Name</TableCell>
                    <TableCell>No. of Homes</TableCell>
                    <TableCell>Occupancy</TableCell>
                    <TableCell>Coordinates</TableCell>
                    <TableCell>Tier</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Deleted At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estates.map((estate) => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={estate.estateId}
                      selected={selectedUsers.indexOf(estate.estateId) !== -1}>
                      <TableCell>
                        <Typography variant="body1">
                          {estate.estateId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {estate.estateName}
                        </Typography>
                      </TableCell>
                      <TableCell>{estate.noOfHouses}</TableCell>
                      <TableCell>{estate.occupancy}</TableCell>
                      <TableCell>{estate.coordinates}</TableCell>
                      <TableCell>{estate.tierNumber}</TableCell>
                      <TableCell>
                        <StatusBadge
                          bgColor={
                            estate.status === 'active'
                              ? theme.palette.success.main
                              : theme.palette.warning.main
                          }>
                          {estate.status === 'active' ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{estate.createdBy}</TableCell>
                      <TableCell>
                        {estate.createdAt != null
                          ? moment(estate.createdAt).format(
                              'DD/MM/YYYY h:mm:ss a'
                            )
                          : ''}
                      </TableCell>
                      <TableCell>
                        {estate.updatedAt != null
                          ? moment(estate.updatedAt).format(
                              'DD/MM/YYYY h:mm:ss a'
                            )
                          : ''}
                      </TableCell>
                      <TableCell>
                        {estate.deletedAt != null
                          ? moment(estate.deletedAt).format(
                              'DD/MM/YYYY h:mm:ss a'
                            )
                          : ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert severity="warning">
                Sorry, this list is empty. Use above filers to show estates
              </Alert>
            )}
          </div>
        </TableContainer>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={totalEstates}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 25, 50, 100]}
          onPageChange={handlePageChange}
        />
      </CardActions>
    </>
  );
};

ReadyEstatesTable.propTypes = {
  estates: PropTypes.array.isRequired,
  getEstatesStatus: PropTypes.bool.isRequired
};

export default ReadyEstatesTable;
